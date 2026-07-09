import dbConnect, { collectionNameObj } from "./dbConnect";

export async function getReviews() {
  const reviewCollection = await dbConnect(collectionNameObj.reviewCollection);

  const reviews = await reviewCollection.find({}).toArray();

  return JSON.parse(JSON.stringify(reviews));
}