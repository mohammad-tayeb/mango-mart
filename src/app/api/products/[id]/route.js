import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { deleteProductFromMeta, syncProductsToMeta } from "@/lib/meta/catalog";

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

    // Product not found
    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 },
      );
    }

    // Get the updated product
    const updatedProduct = await collection.findOne({
      _id: new ObjectId(id),
    });

    // Sync updated product to Meta
    let metaSynced = false;

    try {
      await syncProductsToMeta([updatedProduct]);

      metaSynced = true;

      console.log(`Meta catalogue update successful: ${id}`);
    } catch (metaError) {
      console.error("Meta catalogue update failed:", metaError);
    }

    // Refresh cached pages
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${id}`);

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount,
      metaSynced,
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

    // Delete from MongoDB
    const result = await productCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (!result.deletedCount) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    // Delete from Meta
    let metaDeleted = false;

    try {
      await deleteProductFromMeta(id);

      metaDeleted = true;

      console.log(`Meta catalogue delete successful: ${id}`);
    } catch (metaError) {
      console.error("Meta catalogue delete failed:", metaError);
    }

    // Refresh cached pages
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${id}`);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
      metaDeleted,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 },
    );
  }
}
