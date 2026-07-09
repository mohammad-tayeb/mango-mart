import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { getReviews } from "@/lib/getReviews";
import { NextResponse } from "next/server";

export async function GET() {
  const reviews = await getReviews();
  return NextResponse.json(reviews);
}

export async function POST(req) {
  const data = await req.json();

  const reviewCollection = await dbConnect(collectionNameObj.reviewCollection);

  const result = await reviewCollection.insertOne({
    ...data,
    createdAt: new Date(),
  });

  return NextResponse.json(result);
}
