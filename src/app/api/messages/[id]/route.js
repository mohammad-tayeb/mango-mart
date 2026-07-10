import { NextResponse } from "next/server";
import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { auth } from "@/auth";

export async function DELETE(req, { params }) {
  const session = await auth();
  const { id } = await params;

  try {
    const messageCollection = await dbConnect(
      collectionNameObj.messageCollection,
    );

    const result = await messageCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Message not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
export async function PATCH(req, { params }) {
  const session = await auth();
  const { id } = await params;
  try {
    const messageCollection = await dbConnect(
      collectionNameObj.messageCollection,
    );

    const result = await messageCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          isRead: true,
          acceptedAt: new Date(),
          acceptedBy: session.user.email,
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Message not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Message marked as read",
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
