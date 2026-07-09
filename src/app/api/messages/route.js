import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function POST(req) {
  const data = await req.json();

  const messageCollection = await dbConnect(collectionNameObj.messageCollection);

  const result = await messageCollection.insertOne({
    ...data,
    createdAt: new Date(),
  });

  return NextResponse.json(result);
}
