import { ObjectId } from "mongodb";
import dbConnect, { collectionNameObj } from "./dbConnect";

// Get all products with pagination
export async function getProducts(page = 1, limit = 12) {
  const productCollection = await dbConnect(
    collectionNameObj.productCollection,
  );

  const total = await productCollection.countDocuments();

  const products = await productCollection
    .find({})
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  return JSON.parse(
    JSON.stringify({
      products,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    }),
  );
}




// Get a single product by ID
export async function getProductById(id) {
  const productCollection = await dbConnect(
    collectionNameObj.productCollection,
  );

  const product = await productCollection.findOne({
    _id: new ObjectId(id),
  });

  return JSON.parse(JSON.stringify(product));
}



// Get featured products
export async function getFeaturedProducts() {
  const limit = 4
  const productCollection = await dbConnect(
    collectionNameObj.productCollection,
  );

  const product = await productCollection.find().limit(limit).toArray();

  return JSON.parse(JSON.stringify(product));
}

export async function getSearchedProducts() {
  const productCollection = await dbConnect(
    collectionNameObj.productCollection
  );

  const products = await productCollection.find().toArray();

  return JSON.parse(JSON.stringify(products));
}