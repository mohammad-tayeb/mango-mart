import { NextResponse } from "next/server";
import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { getOrders } from "@/lib/getOrders";
import { generateTrackingId } from "@/lib/generateTrackingId";

export async function POST(req) {
  const trackingId = generateTrackingId();
  try {
    const order = await req.json();
    if (!order.customer?.fullName) {
      return NextResponse.json(
        { message: "Full name is required" },
        { status: 400 },
      );
    }

    if (!order.customer?.phoneNumber) {
      return NextResponse.json(
        { message: "Phone number is required" },
        { status: 400 },
      );
    }

    if (!Array.isArray(order.cartItems) || order.cartItems.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    if (!order.payment?.method) {
      return NextResponse.json(
        { message: "Payment method is required" },
        { status: 400 },
      );
    }

    const orderCollection = await dbConnect(collectionNameObj.orderCollection);

    const result = await orderCollection.insertOne({
      ...order,
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
        message: "Failed to place order",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const orders = await getOrders();

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}
