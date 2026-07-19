import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import dbConnect, { collectionNameObj } from "@/lib/dbConnect";

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;

    const { image, order, isActive } = await req.json();

    const bannerCollection = await dbConnect(
      collectionNameObj.bannerCollection
    );

    const result = await bannerCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          image,
          order,
          isActive,
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Banner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Banner updated successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update banner",
      },
      { status: 500 }
    );
  }
}