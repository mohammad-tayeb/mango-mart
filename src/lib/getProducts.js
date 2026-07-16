import { ObjectId } from "mongodb";
import dbConnect, { collectionNameObj } from "./dbConnect";

// Get all products with pagination
export async function getProducts(page = 1, limit = 12, category = "") {
  const productCollection = await dbConnect(
    collectionNameObj.productCollection,
  );

  const skip = (page - 1) * limit;

  const query = {};

  if (category) {
    query.category = category;
  }

  const products = await productCollection
    .find(query)
    .skip(skip)
    .limit(limit)
    .toArray();

  const totalProducts = await productCollection.countDocuments(query);

  return {
    products: JSON.parse(JSON.stringify(products)),
    totalPages: Math.ceil(totalProducts / limit),
  };
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
  const limit = 8;

  const productCollection = await dbConnect(
    collectionNameObj.productCollection,
  );

  const products = await productCollection
    .aggregate([
      {
        $addFields: {
          categoryPriority: {
            $cond: [{ $eq: ["$category", "mango"] }, 0, 1],
          },
        },
      },
      {
        $sort: {
          categoryPriority: 1,
          createdAt: -1,
        },
      },
      {
        $limit: limit,
      },
      {
        $project: {
          categoryPriority: 0,
        },
      },
    ])
    .toArray();

  return JSON.parse(JSON.stringify(products));
}

export async function getSearchedProducts() {
  const productCollection = await dbConnect(
    collectionNameObj.productCollection,
  );

  const products = await productCollection
    .find()
    .sort({ createdAt: -1 })
    .toArray();

  return JSON.parse(JSON.stringify(products));
}
