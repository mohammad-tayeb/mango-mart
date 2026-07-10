import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { query } = await req.json();

    const orderCollection = await dbConnect(collectionNameObj.orderCollection);

    const order = await orderCollection.findOne(
      {
        $or: [
          { trackingId: query },
          { "customer.phoneNumber": query },
        ],
      },
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

    return NextResponse.json(order);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch order" },
      { status: 500 }
    );
  }
}