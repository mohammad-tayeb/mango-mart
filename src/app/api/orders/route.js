import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { getOrders } from "@/lib/getOrders";
import { generateTrackingId } from "@/lib/generateTrackingId";

export async function POST(req) {
  try {
    const trackingId = generateTrackingId();
    const order = await req.json();

    // -----------------------
    // Customer Validation
    // -----------------------

    if (!order.customer?.fullName?.trim()) {
      return NextResponse.json(
        { message: "Full name is required" },
        { status: 400 }
      );
    }

    if (!order.customer?.phoneNumber?.trim()) {
      return NextResponse.json(
        { message: "Phone number is required" },
        { status: 400 }
      );
    }

    // -----------------------
    // Cart Validation
    // -----------------------

    if (!Array.isArray(order.cartItems) || order.cartItems.length === 0) {
      return NextResponse.json(
        { message: "Cart is empty" },
        { status: 400 }
      );
    }

    for (const item of order.cartItems) {
      if (!ObjectId.isValid(item._id)) {
        return NextResponse.json(
          { message: "Invalid product." },
          { status: 400 }
        );
      }

      if (!item.variant?.quantity) {
        return NextResponse.json(
          { message: "Invalid product variant." },
          { status: 400 }
        );
      }

      if (item.quantity <= 0) {
        return NextResponse.json(
          { message: "Invalid quantity." },
          { status: 400 }
        );
      }
    }

    // -----------------------
    // Payment Validation
    // -----------------------

    const allowedModes = ["cod", "online"];

    if (!allowedModes.includes(order.payment?.mode)) {
      return NextResponse.json(
        { message: "Invalid payment mode." },
        { status: 400 }
      );
    }

    const allowedMethods = ["cod", "intl_send", "bd_payment", "bank"];

    if (!allowedMethods.includes(order.payment?.method)) {
      return NextResponse.json(
        { message: "Invalid payment method." },
        { status: 400 }
      );
    }

    if (
      order.payment.mode === "online" &&
      !["advance250", "full"].includes(order.payment.type)
    ) {
      return NextResponse.json(
        { message: "Invalid payment type." },
        { status: 400 }
      );
    }

    if (
      order.payment.mode === "online" &&
      !order.payment.trxId?.trim()
    ) {
      return NextResponse.json(
        { message: "Transaction ID is required." },
        { status: 400 }
      );
    }

    // -----------------------
    // Load Products
    // -----------------------

    const productCollection = await dbConnect(
      collectionNameObj.productCollection
    );

    const ids = order.cartItems.map(
      (item) => new ObjectId(item._id)
    );

    const products = await productCollection
      .find({
        _id: { $in: ids },
      })
      .toArray();

    const productMap = new Map(
      products.map((product) => [
        product._id.toString(),
        product,
      ])
    );

    // -----------------------
    // Calculate Amount
    // -----------------------

    let subtotal = 0;

    const safeCartItems = [];

    for (const item of order.cartItems) {
      const product = productMap.get(item._id);

      if (!product) {
        return NextResponse.json(
          { message: "Product not found." },
          { status: 400 }
        );
      }

      if (product.stock?.status !== "in_stock") {
        return NextResponse.json(
          {
            message: `${product.name} is currently out of stock.`,
          },
          { status: 400 }
        );
      }

      const dbVariant = product.variants.find(
        (variant) =>
          Number(variant.quantity) ===
          Number(item.variant.quantity)
      );

      if (!dbVariant) {
        return NextResponse.json(
          {
            message: `Invalid variant for ${product.name}.`,
          },
          { status: 400 }
        );
      }

      const variantPrice =
        dbVariant.offerPrice ?? dbVariant.price;

      subtotal += variantPrice * item.quantity;

      // Save only trusted cart data
      safeCartItems.push({
        _id: product._id.toString(),
        name: product.name,
        image: product.images?.[0] || "",
        quantity: item.quantity,
        variant: {
          quantity: dbVariant.quantity,
          price: dbVariant.price,
          offerPrice: dbVariant.offerPrice,
        },
      });
    }

    // -----------------------
    // Payment Calculation
    // -----------------------

    let charge = 0;

    if (order.payment.method === "intl_send") {
      charge = Math.round(subtotal * 0.018);
    }

    const actualAmount = subtotal + charge;

    let amountPaid = 0;

    if (order.payment.mode === "online") {
      amountPaid =
        order.payment.type === "advance250"
          ? 250
          : actualAmount;
    }

    const amountDue = actualAmount - amountPaid;

    // -----------------------
    // Save Order
    // -----------------------

    const orderCollection = await dbConnect(
      collectionNameObj.orderCollection
    );

    const result = await orderCollection.insertOne({
      customer: order.customer,

      cartItems: safeCartItems,

      payment: {
        mode: order.payment.mode,
        method: order.payment.method,
        type: order.payment.type,
        trxId: order.payment.trxId,

        actualAmount,
        amountPaid,
        amountDue,
        charge,
      },

      trackingId,

      orderStatus: "Pending",

      orderHistory: [
        {
          status: "Pending",
          time: new Date(),
          note: "Order placed successfully",
        },
      ],

      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      insertedId: result.insertedId,
      trackingId,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to place order.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const orders = await getOrders();

    return NextResponse.json(orders);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to fetch orders.",
      },
      {
        status: 500,
      }
    );
  }
}