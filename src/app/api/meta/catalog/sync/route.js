import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import dbConnect, {
  collectionNameObj,
} from "@/lib/dbConnect";

import { syncProductsToMeta } from "@/lib/meta/catalog";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));

    const productId = body.productId;

    const productCollection = await dbConnect(
      collectionNameObj.productCollection
    );

    let query = {};

    if (productId) {
      query = {
        _id: new ObjectId(productId),
      };
    }

    const limit = Math.min(
      Number(body.limit) || 1,
      100
    );

    const products = await productCollection
      .find(query)
      .limit(productId ? 1 : limit)
      .toArray();

    if (products.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No products found",
        },
        {
          status: 404,
        }
      );
    }

    console.log(
      "Products selected for Meta sync:",
      products.map((product) => ({
        id: product._id.toString(),
        name: product.name,
      }))
    );

    const metaResult =
      await syncProductsToMeta(products);

    return NextResponse.json({
      success: true,

      synced: products.length,

      products: products.map((product) => ({
        id: product._id.toString(),
        name: product.name,
      })),

      meta: metaResult,
    });
  } catch (error) {
    console.error(
      "Meta catalogue sync error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}