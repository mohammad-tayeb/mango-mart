import { NextResponse } from "next/server";
import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { auth } from "@/auth";

export async function PATCH(req, { params }) {
  const session = await auth();
  const { id } = await params;
  const { status } = await req.json();

  try {
    const messageCollection = await dbConnect(
      collectionNameObj.messageCollection,
    );

    const updateData = {
      updatedAt: new Date(),
    };

    switch (status) {
      case "Read":
        updateData.isRead = true;
        updateData.readAt = new Date();
        updateData.readBy = session.user.email;
        break;

      case "Replied":
        updateData.status = "Replied";
        updateData.isRead = true;
        updateData.repliedAt = new Date();
        updateData.repliedBy = session.user.email;
        break;

      case "Deleted":
        updateData.status = "Deleted";
        updateData.deletedAt = new Date();
        updateData.deletedBy = session.user.email;
        break;

      default:
        return NextResponse.json(
          { message: "Invalid status" },
          { status: 400 },
        );
    }

    const result = await messageCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Message not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `Message marked as ${status}`,
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
