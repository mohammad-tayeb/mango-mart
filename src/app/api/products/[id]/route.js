import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { auth } from "@/auth";

export async function PATCH(req, { params }) {
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
  try {
    const { id } = await params;
    const body = await req.json();
    delete body._id;

    const collection = await dbConnect(collectionNameObj.productCollection);

    const result = await collection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          ...body,
          updatedAt: new Date(),
        },
      },
    );

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err.message,
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(req, { params }) {
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
  try {
    const { id } = await params;

    const productCollection = await dbConnect(
      collectionNameObj.productCollection,
    );

    const result = await productCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (!result.deletedCount) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
