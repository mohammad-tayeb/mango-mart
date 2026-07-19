import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { NextResponse } from "next/server";


export async function GET() {
  const collection = await dbConnect(collectionNameObj.bannerCollection);

  const banners = await collection
    .find({ isActive: true })
    .sort({ order: 1 })
    .toArray();

  return NextResponse.json(banners);
}