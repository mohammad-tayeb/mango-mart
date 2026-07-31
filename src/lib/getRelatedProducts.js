import { ObjectId } from "mongodb";
import dbConnect, { collectionNameObj } from "./dbConnect";

export async function getRelatedProducts(id) {
  const productCollection = await dbConnect(
    collectionNameObj.productCollection,
  );

  // Current product
  const product = await productCollection.findOne({
    _id: new ObjectId(id),
  });

  if (!product) return [];

  // Try to get products from the same category
  let relatedProducts = await productCollection
    .find({
      category: product.category,
      _id: { $ne: product._id },
    })
    .sort({ createdAt: -1 })
    .limit(4)
    .toArray();

  // If none found, get products from other categories
  if (relatedProducts.length === 0) {
    relatedProducts = await productCollection
      .find({
        category: { $ne: product.category },
        _id: { $ne: product._id },
      })
      .sort({ createdAt: -1 })
      .limit(4)
      .toArray();
  }

  return JSON.parse(JSON.stringify(relatedProducts));
}
