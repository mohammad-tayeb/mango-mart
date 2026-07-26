import { NextResponse } from "next/server";
import dbConnect, { collectionNameObj } from "@/lib/dbConnect";

export async function GET() {
  try {
    const orderCollection = await dbConnect(
      collectionNameObj.orderCollection
    );

    const messageCollection = await dbConnect(
      collectionNameObj.messageCollection
    );

    // Counts
    const pendingOrders = await orderCollection.countDocuments({
      orderStatus: "Pending",
    });

    // Change this filter based on your message schema
    const unreadMessages = await messageCollection.countDocuments({
      status: "New",
    });

    // Latest pending orders
    const latestOrders = await orderCollection
      .find({
        orderStatus: "Pending",
      })
      .sort({ createdAt: -1 })
      .limit(5)
      .project({
        customer: 1,
        trackingId: 1,
        createdAt: 1,
      })
      .toArray();

    // Latest unread messages
    const latestMessages = await messageCollection
      .find({
        status: "New",
      })
      .sort({ createdAt: -1 })
      .limit(5)
      .project({
        name: 1,
        email: 1,
        subject: 1,
        createdAt: 1,
      })
      .toArray();

    return NextResponse.json({
      pendingOrders,
      unreadMessages,
      total: pendingOrders + unreadMessages,
      latestOrders,
      latestMessages,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to fetch notifications",
      },
      {
        status: 500,
      }
    );
  }
}