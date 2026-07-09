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
  // Related products
  const relatedProducts = await productCollection
    .find({
      category: product.category,
      _id: { $ne: product._id },
    })
    .limit(4)
    .toArray();
  return JSON.parse(JSON.stringify(relatedProducts));
}
