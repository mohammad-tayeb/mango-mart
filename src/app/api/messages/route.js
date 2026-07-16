import { auth } from "@/auth";
import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.json();

    if (!data.name?.trim()) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 },
      );
    }

    if (!data.email?.trim()) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 },
      );
    }

    if (!data.message?.trim()) {
      return NextResponse.json(
        { message: "Message is required" },
        { status: 400 },
      );
    }

    const messageCollection = await dbConnect(
      collectionNameObj.messageCollection,
    );

    const result = await messageCollection.insertOne({
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone?.trim() || "",
      subject: data.subject?.trim() || "",
      message: data.message.trim(),

      status: "New",
      isRead: false,

      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to send message" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const adminCollection = await dbConnect(collectionNameObj.adminCollection);

    const admin = await adminCollection.findOne({
      email: session.user.email,
    });

    if (!admin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const messageCollection = await dbConnect(
      collectionNameObj.messageCollection,
    );

    const messages = await messageCollection
      .find()
      .sort({
        isRead: 1,
        createdAt: -1,
      })
      .toArray();

    return NextResponse.json(messages);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}
