import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { query } = await req.json();

    const isTrackingId = /^MM-\d{6}-[A-Z0-9]{6}$/i.test(query);

    const orderCollection = await dbConnect(
      collectionNameObj.orderCollection
    );

    if (isTrackingId) {
      const order = await orderCollection.findOne(
        { trackingId: query },
        {
          projection: {
            _id: 0,
            trackingId: 1,
            orderStatus: 1,
            orderHistory: 1,
            createdAt: 1,
            "customer.fullName": 1,
            "payment.amountPaid": 1,
            "payment.amountDue": 1,
          },
        }
      );

      if (!order) {
        return NextResponse.json(
          { message: "Order not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        type: "single",
        order,
      });
    }

    // Phone number search
    const orders = await orderCollection
      .find(
        { "customer.phoneNumber": query },
        {
          projection: {
            _id: 0,
            trackingId: 1,
            orderStatus: 1,
            orderHistory: 1,
            createdAt: 1,
            "customer.fullName": 1,
            "payment.amountPaid": 1,
            "payment.amountDue": 1,
          },
        }
      )
      .sort({ createdAt: -1 })
      .toArray();

    if (orders.length === 0) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      type: "multiple",
      orders,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch order" },
      { status: 500 }
    );
  }
}