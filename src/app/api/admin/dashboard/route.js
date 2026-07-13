import { auth } from "@/auth";
import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const orderCollection = await dbConnect(collectionNameObj.orderCollection);
  const messageCollection = await dbConnect(
    collectionNameObj.messageCollection,
  );
  const reviewCollection = await dbConnect(collectionNameObj.reviewCollection);

  const productCollection = await dbConnect(
    collectionNameObj.productCollection,
  );

  const pendingOrders = await orderCollection.countDocuments({
    orderStatus: "Pending",
  });
  const deliveredOrders = await orderCollection.countDocuments({
    orderStatus: "Delivered",
  });
  const TransitOrders = await orderCollection.countDocuments({
    orderStatus: "In Transit",
  });
  const deletedOrders = await orderCollection.countDocuments({
    orderStatus: "Deleted",
  });
  const totalOrders = await orderCollection.countDocuments();

  const toatlReview = await reviewCollection.countDocuments();

  const result = await reviewCollection
    .aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ])
    .toArray();

  const averageRating = result.length
    ? Number(result[0].averageRating.toFixed(1))
    : 0;

  const unreadMessages = await messageCollection.countDocuments({
    isRead: false,
    status: "New",
  });

  const totalProducts = await productCollection.countDocuments({
    "stock.status": "in_stock",
  });

  const amounts = await orderCollection
    .aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$payment.actualAmount" },
          totalAdvanceReceived: { $sum: "$payment.amountPaid" },
          totalDue: { $sum: "$payment.amountDue" },
        },
      },
    ])
    .toArray();

  const totalRevenue = amounts[0]?.totalRevenue || 0;
  const totalAdvanceReceived = amounts[0]?.totalAdvanceReceived || 0;
  const totalDue = amounts[0]?.totalDue || 0;

  return NextResponse.json({
    pendingOrders,
    totalOrders,
    unreadMessages,
    totalProducts,
    toatlReview,
    averageRating,
    totalRevenue,
    toatlReview,
    deletedOrders,
    TransitOrders,
    deliveredOrders,
    totalAdvanceReceived,
    totalDue,
  });
}
