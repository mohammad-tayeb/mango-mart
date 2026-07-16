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
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid order ID" },
        { status: 400 },
      );
    }
    const { orderStatus } = await req.json();
    const allowedStatuses = [
      "Pending",
      "Accepted",
      "In Transit",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(orderStatus)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    const orderCollection = await dbConnect(collectionNameObj.orderCollection);

    // Get the current order
    const order = await orderCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    if (order.orderStatus === "Deleted") {
      return NextResponse.json(
        { message: "Order already deleted" },
        { status: 400 },
      );
    }

    const updateData = {
      $set: {
        orderStatus,
        updatedAt: new Date(),
      },
      $push: {
        orderHistory: {
          status: orderStatus,
          time: new Date(),
          updatedBy: session.user.email,
        },
      },
    };

    // When delivered, mark payment as fully paid
    if (orderStatus === "Delivered") {
      updateData.$set["payment.amountPaid"] = order.payment.actualAmount;
      updateData.$set["payment.amountDue"] = 0;
    }

    const result = await orderCollection.updateOne(
      { _id: new ObjectId(id) },
      updateData,
    );
    

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "Failed to update order" },
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
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid order ID" },
        { status: 400 },
      );
    }
    const orderCollection = await dbConnect(collectionNameObj.orderCollection);

    const result = await orderCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          orderStatus: "Deleted",
          updatedAt: new Date(),
        },
        $push: {
          orderHistory: {
            status: "Deleted",
            time: new Date(),
            updatedBy: session.user.email,
          },
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
