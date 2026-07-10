import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function POST(req) {
  const data = await req.json();

  const messageCollection = await dbConnect(
    collectionNameObj.messageCollection,
  );

  const result = await messageCollection.insertOne({
    ...data,
    createdAt: new Date(),
  });

  return NextResponse.json(result);
}


export async function GET() {
  try {
    const messageCollection = await dbConnect(
      collectionNameObj.messageCollection,
    );

    const messages = await messageCollection
      .find()
      .sort({ isRead : 1, createdAt: -1 })
      .toArray();

    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}
