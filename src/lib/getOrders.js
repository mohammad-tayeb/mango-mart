import { ObjectId } from "mongodb";
import dbConnect, { collectionNameObj } from "./dbConnect";

// get all order data
export async function getOrders() {
  const orderCollection = await dbConnect(collectionNameObj.orderCollection);

  return await orderCollection
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
}

// Get a single order by ID
export async function getOrderById(id) {
  if (!ObjectId.isValid(id)) {
    return null;
  }
  const orderCollection = await dbConnect(collectionNameObj.orderCollection);

  const order = await orderCollection.findOne({
    _id: new ObjectId(id),
  });

  return JSON.parse(JSON.stringify(order));
}
