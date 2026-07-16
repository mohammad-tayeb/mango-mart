import { NextResponse } from "next/server";
import { getSearchedProducts } from "@/lib/getProducts";
import { auth } from "@/auth";
import dbConnect, { collectionNameObj } from "@/lib/dbConnect";

//get searched product
export async function GET() {
  const products = await getSearchedProducts();

  return NextResponse.json(products);
}

//post new product
export async function POST(req) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    // Optional: Protect admin route
    const session = await auth();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const {
      name,
      category,
      unitPricePerKg,
      variants,
      images,
      description,
      stock,
    } = body;

    // Validation
    if (
      !name ||
      !category ||
      unitPricePerKg === undefined ||
      !description ||
      !Array.isArray(variants) ||
      variants.length === 0 ||
      !Array.isArray(images) ||
      images.length === 0
    ) {
      return NextResponse.json(
        { message: "Please fill all required fields." },
        { status: 400 },
      );
    }

    const productCollection = await dbConnect(
      collectionNameObj.productCollection,
    );

    const product = {
      name: name.trim(),
      category: category.trim().toLowerCase(),
      unitPricePerKg: Number(unitPricePerKg),

      variants: variants.map((variant) => ({
        quantity:
          typeof variant.quantity === "number"
            ? variant.quantity
            : isNaN(Number(variant.quantity))
              ? variant.quantity
              : Number(variant.quantity),

        price: Number(variant.price),

        offerPrice:
          variant.offerPrice === null ||
          variant.offerPrice === "" ||
          variant.offerPrice === undefined
            ? null
            : Number(variant.offerPrice),
      })),

      images,

      description: description.trim(),

      stock: {
        quantity: Number(stock.quantity),
        unit: stock.unit,
        status: stock.status,
        lowStockThreshold: Number(stock.lowStockThreshold),
      },

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await productCollection.insertOne(product);

    return NextResponse.json(
      {
        success: true,
        message: "Product added successfully.",
        insertedId: result.insertedId,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
