import { auth } from "@/auth";
import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const adminCollection = await dbConnect(collectionNameObj.adminCollection);

    const admin = await adminCollection.findOne({
      email: session.user.email,
    });

    if (!admin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const [
      orderCollection,
      messageCollection,
      reviewCollection,
      productCollection,
    ] = await Promise.all([
      dbConnect(collectionNameObj.orderCollection),
      dbConnect(collectionNameObj.messageCollection),
      dbConnect(collectionNameObj.reviewCollection),
      dbConnect(collectionNameObj.productCollection),
    ]);

    const getSalesStats = async (startDate, endDate) => {
      const result = await orderCollection
        .aggregate([
          {
            $match: {
              createdAt: {
                $gte: startDate,
                $lte: endDate,
              },
              orderStatus: {
                $nin: ["Pending", "Deleted"],
              },
            },
          },
          {
            $group: {
              _id: null,
              totalSales: {
                $sum: "$payment.actualAmount",
              },
              orderCount: {
                $sum: 1,
              },
            },
          },
        ])
        .toArray();

      return {
        totalSales: result[0]?.totalSales || 0,
        orderCount: result[0]?.orderCount || 0,
      };
    };

    const now = new Date();

    // Today
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    // Last 7 days
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);

    // Last 30 days
    const monthStart = new Date(now);
    monthStart.setDate(now.getDate() - 29);
    monthStart.setHours(0, 0, 0, 0);

    // Last 365 days
    const yearStart = new Date(now);
    yearStart.setFullYear(now.getFullYear() - 1);
    yearStart.setHours(0, 0, 0, 0);

    const [
      orderStats,
      reviewStats,
      productStats,
      unreadMessages,
      todayStats,
      weekStats,
      monthStats,
      yearStats,
    ] = await Promise.all([
      orderCollection
        .aggregate([
          {
            $facet: {
              statusCounts: [
                {
                  $group: {
                    _id: "$orderStatus",
                    count: { $sum: 1 },
                  },
                },
              ],
              revenue: [
                {
                  $match: {
                    orderStatus: {
                      $nin: ["Deleted", "Pending"],
                    },
                  },
                },
                {
                  $group: {
                    _id: null,
                    totalRevenue: {
                      $sum: "$payment.actualAmount",
                    },
                    totalAdvanceReceived: {
                      $sum: "$payment.amountPaid",
                    },
                    totalDue: {
                      $sum: "$payment.amountDue",
                    },
                    totalOrders: {
                      $sum: 1,
                    },
                  },
                },
              ],
            },
          },
        ])
        .toArray(),

      reviewCollection
        .aggregate([
          {
            $group: {
              _id: null,
              totalReviews: { $sum: 1 },
              averageRating: { $avg: "$rating" },
            },
          },
        ])
        .toArray(),

      productCollection
        .aggregate([
          {
            $group: {
              _id: "$stock.status",
              count: { $sum: 1 },
            },
          },
        ])
        .toArray(),

      messageCollection.countDocuments({
        isRead: false,
        status: "New",
      }),
      getSalesStats(todayStart, todayEnd),
      getSalesStats(weekStart, now),
      getSalesStats(monthStart, now),
      getSalesStats(yearStart, now),
    ]);

    // -----------------------------------------------------------

    // ---------------- Orders ----------------

    const revenue = orderStats[0]?.revenue?.[0] || {};

    const statusMap = {};

    orderStats[0]?.statusCounts?.forEach((item) => {
      statusMap[item._id] = item.count;
    });

    // ---------------- Reviews ----------------

    const reviews = reviewStats[0] || {};

    // ---------------- Products ----------------

    const productMap = {};

    productStats.forEach((item) => {
      productMap[item._id] = item.count;
    });

    const allOrders = await orderCollection.countDocuments();

    return NextResponse.json({
      pendingOrders: statusMap["Pending"] || 0,
      deliveredOrders: statusMap["Delivered"] || 0,
      TransitOrders: statusMap["In Transit"] || 0,
      deletedOrders: statusMap["Deleted"] || 0,

      totalOrders: revenue.totalOrders || 0,

      totalRevenue: revenue.totalRevenue || 0,
      totalAdvanceReceived: revenue.totalAdvanceReceived || 0,
      totalDue: revenue.totalDue || 0,

      todaySaleAmount: todayStats.totalSales,
      todayOrderCount: todayStats.orderCount,
      allOrders,

      lastWeek: weekStats,
      lastMonth: monthStats,
      lastYear: yearStats,

      unreadMessages,

      totalProducts: productMap["in_stock"] || 0,
      noOfStockOutProducts: productMap["out_of_stock"] || 0,

      toatlReview: reviews.totalReviews || 0,
      averageRating: reviews.averageRating
        ? Number(reviews.averageRating.toFixed(1))
        : 0,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
