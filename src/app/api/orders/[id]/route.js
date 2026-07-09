import { auth } from "@/auth";
import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { orderStatus } = await req.json();

    const orderCollection = await dbConnect(collectionNameObj.orderCollection);

    const result = await orderCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          orderStatus,
          acceptedAt: new Date(),
          acceptedBy: session.user.email,
          updatedAt: new Date(),
        },
      },
    );

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      {
        message: "Failed to update order",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const orderCollection = await dbConnect(collectionNameObj.orderCollection);

    const result = await orderCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          orderStatus: "Deleted",
          deletedAt: new Date(),
          deletedBy: session.user.email,
          updatedAt: new Date(),
        },
      },
    );

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to delete order",
      },
      { status: 500 },
    );
  }
}
