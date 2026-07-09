import { NextResponse } from "next/server";
import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { getProducts, getSearchedProducts } from "@/lib/getProducts";

// export async function POST(req) {
//   try {
//     const product = await req.json();

//     const productCollection = await dbConnect(
//       collectionNameObj.productCollection
//     );

//     const result = await productCollection.insertOne({
//       ...product,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         insertedId: result.insertedId,
//         message: "Product added successfully",
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to add product",
//       },
//       { status: 500 }
//     );
//   }
// }


export async function GET() {
  const products = await getSearchedProducts();

  return NextResponse.json(products);
}