import dns from "node:dns/promises";
import { MongoClient, ServerApiVersion } from "mongodb";

dns.setServers(["1.1.1.1", "1.0.0.1"]);

export const collectionNameObj = {
  productCollection: "products",
  reviewCollection: "reviews",
  messageCollection: "messages",
  adminCollection: "admins",
  orderCollection: "orders"
};

const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let isConnected = false;

export default async function dbConnect(collectionName) {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
  }

  return client
    .db(process.env.DB_NAME)
    .collection(collectionName);
}