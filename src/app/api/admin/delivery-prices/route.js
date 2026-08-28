import { auth } from "@/auth";
import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check admin
    const adminCollection = await dbConnect(collectionNameObj.adminCollection);

    const admin = await adminCollection.findOne({
      email: session.user.email,
    });

    if (!admin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Get delivery prices
    const deliveryPriceCollection = await dbConnect(
      collectionNameObj.deliveryPricesCollection,
    );

    const deliveryPrices = await deliveryPriceCollection
      .find({})
      .sort({ category: 1 })
      .toArray();

    return NextResponse.json(deliveryPrices);
  } catch (error) {
    console.error("Get delivery prices error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch delivery prices",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(req) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check admin
    const adminCollection = await dbConnect(collectionNameObj.adminCollection);

    const admin = await adminCollection.findOne({
      email: session.user.email,
    });

    if (!admin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    const { id, price } = body;

    // Validation
    if (!id) {
      return NextResponse.json(
        { message: "Delivery price ID is required" },
        { status: 400 },
      );
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid delivery price ID" },
        { status: 400 },
      );
    }

    const numericPrice = Number(price);

    if (price === undefined || price === null || isNaN(numericPrice)) {
      return NextResponse.json(
        { message: "Valid delivery price is required" },
        { status: 400 },
      );
    }

    if (numericPrice < 0) {
      return NextResponse.json(
        { message: "Delivery price cannot be negative" },
        { status: 400 },
      );
    }

    const deliveryPriceCollection = await dbConnect(
      collectionNameObj.deliveryPricesCollection,
    );

    const result = await deliveryPriceCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          price: numericPrice,
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Delivery price not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Delivery price updated successfully",
    });
  } catch (error) {
    console.error("Update delivery price error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update delivery price",
      },
      { status: 500 },
    );
  }
}
