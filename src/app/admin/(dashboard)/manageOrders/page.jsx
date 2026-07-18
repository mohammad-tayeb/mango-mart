'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';

const OrdersTable = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");

  const statusFilter =
    searchParams.get("status") || "pending";

  const currentPage =
    Number(searchParams.get("page")) || 1;


  const ordersPerPage = 10;

  const changeFilter = (value) => {
    router.replace(`?status=${value}&page=1`);
  };

  const changePage = (page) => {
    router.replace(`?status=${statusFilter}&page=${page}`);
  };


  //loading data
  const { data: orders = [], isLoading, error, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await fetch("/api/orders");
      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }
      return res.json();
    },
  });


  const filteredOrders = useMemo(() => {
    const query = search.toLowerCase().trim();

    return orders.filter((order) => {
      // Status filter
      const statusMatch =
        statusFilter === "all" ||
        order.orderStatus?.toLowerCase() === statusFilter.toLowerCase();

      // Search filter
      const searchMatch =
        query === "" ||
        order.customer?.fullName?.toLowerCase().includes(query) ||
        order.customer?.phoneNumber?.toLowerCase().includes(query) ||
        order.customer?.email?.toLowerCase().includes(query) ||
        order.trackingId?.toLowerCase() === query ||
        order.cartItems?.some((item) =>
          item.name?.toLowerCase().includes(query)
        );

      return statusMatch && searchMatch;
    });
  }, [orders, statusFilter, search]);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const pendingCount = orders.filter(
    order => order.orderStatus === "Pending"
  ).length;

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto w-full bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 font-medium">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4"></div>
        Loading orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto w-full bg-red-50 rounded-xl border border-red-200 p-6 text-center text-red-700 font-medium">
        Error loading orders: {error.message}
      </div>
    );
  }

  const handleUpdateStatus = async (id, orderStatus) => {
    const confirmed = window.confirm(
      `Are you sure you want to set the status to ${orderStatus}?`
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderStatus: orderStatus,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success(data.message || `Set Order Status to ${orderStatus}!`);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error(err.message || `Failed to Set Order ${orderStatus}!`);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this order?"
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success(data.message || "Order deleted!");
      refetch();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to delete order");
    }
  };
  return (
    <div className="max-w-6xl mx-auto w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

      {/* Table Header / Actions bar */}
      <div className="p-4 border-b border-slate-300 bg-slate-50/50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          {/* Left Side */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md border border-slate-200">
              Total: {filteredOrders.length}
            </span>

            {pendingCount > 0 && (
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                {pendingCount} Pending
              </button>
            )}
          </div>

          {/* Right Side */}
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <input
              type="text"
              placeholder="Search customer, phone, email, tracking ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input input-bordered input-sm w-full sm:flex-1 lg:w-72 text-xs"
            />

            <select
              value={statusFilter}
              onChange={(e) => changeFilter(e.target.value)}
              className="select select-bordered select-sm w-full sm:w-40 text-xs"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="deleted">Deleted</option>
              <option value="in transit">In transit</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

        </div>
      </div>

      {/* Responsive Wrapper */}
      <div className="overflow-auto max-h-[65vh]">
        <table className="w-full min-w-[1000px] border-collapse">
          <thead className="sticky top-0 z-10 bg-slate-50 border-gray-300">
            <tr className="bg-slate-50 border-gray-300 text-slate-400 font-semibold text-xs tracking-wider uppercase border-b border-slate-200">
              <th className="py-3 px-4">Customer Info</th>
              <th className="py-3 px-4 w-[260px]">Ordered Products</th>
              <th className="py-3 px-4">Payment Details</th>
              <th className="py-3 px-4">Due</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-12 text-slate-400 font-medium">
                  No orders available in queue.
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order) => {
                const status = order.orderStatus?.toLowerCase();

                const isPending = status === "pending";
                const isAccepted = status === "accepted";
                const isInTransit = status === "in transit";
                const isDelivered = status === "delivered";
                const isDeleted = status === "deleted";

                return (
                  <tr key={order._id} className="hover:bg-slate-50/70 transition-colors items-start border border-gray-300">

                    {/* Customer Detail Block */}
                    <td className="py-3.5 px-4 align-top">
                      <p className="font-semibold text-slate-800">{order.customer?.fullName}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{order.customer?.phoneNumber}</p>
                      <p className="text-xs text-slate-400 truncate max-w-[150px]" title={order.customer?.email}>
                        {order.customer?.email}
                      </p>
                    </td>

                    {/* PRODUCT DETAILS COLUMN */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
                        {order.cartItems && order.cartItems.length > 0 ? (
                          order.cartItems.map((item, index) => (
                            <div key={item.id || index} className="flex gap-2 items-center bg-slate-50/60 p-1.5 rounded-lg border border-slate-100">
                              {/* Thumbnail Image Wrapper */}
                              <div className="h-9 w-9 shrink-0 bg-slate-200 rounded-md overflow-hidden border border-slate-200 flex items-center justify-center text-[10px] text-slate-400">
                                {item.image ? (
                                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                ) : (
                                  "📦"
                                )}
                              </div>
                              {/* Product Info Description */}
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-slate-800 truncate" title={item.name || "Sample Item"}>
                                  {item.name || "Sample Item"}
                                </p>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                  Qty: <span className="font-bold text-slate-700">{item.quantity || 1}</span>
                                  {item.price && ` • ৳${item.price.toLocaleString()}`}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">No product information</span>
                        )}
                      </div>
                    </td>

                    {/* Payment Overview */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="text-xs text-slate-700 space-y-0.5">
                        <p><span className="text-slate-400">Method:</span> <span className="capitalize font-medium">{order.payment?.method?.replace('_', ' ')}</span></p>
                        <p><span className="text-slate-400">TrxID:</span> <span className="font-mono text-slate-600 bg-slate-50 px-1 rounded">{order.payment?.trxId}</span></p>
                        <p><span className="text-slate-400">Paid:</span> <span className="text-emerald-600 font-medium">৳{order.payment?.amountPaid?.toLocaleString()}</span></p>
                      </div>
                    </td>

                    {/* Due Amount Balance */}
                    <td className="py-3.5 px-4 align-top font-bold text-slate-800">
                      ৳{order.payment?.amountDue?.toLocaleString()}
                    </td>

                    {/* Context Status Badge */}
                    <td className="py-3.5 px-4 align-top text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
      ${isPending
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : isAccepted
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : isInTransit
                                ? "bg-blue-50 text-blue-800 border-blue-200"
                                : isDelivered
                                  ? "bg-green-50 text-green-800 border-green-200"
                                  : isDeleted
                                    ? "bg-red-50 text-red-800 border-red-200"
                                    : "bg-gray-50 text-gray-800 border-gray-200"
                          }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 mr-1.5 rounded-full
        ${isPending
                              ? "bg-amber-500 animate-pulse"
                              : isAccepted
                                ? "bg-emerald-500"
                                : isInTransit
                                  ? "bg-blue-500"
                                  : isDelivered
                                    ? "bg-green-500"
                                    : isDeleted
                                      ? "bg-red-500"
                                      : "bg-gray-500"
                            }`}
                        ></span>

                        {order.orderStatus}
                      </span>
                    </td>

                    {/* Interactive Action Layout */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="flex flex-col gap-2 w-36 ml-auto">

                        {/* View */}
                        <Link
                          href={`/admin/manageOrders/${order._id}?status=${statusFilter}&page=${currentPage}`}
                          className="w-full px-3 py-2 text-center text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          View
                        </Link>

                        {/* Accept */}
                        {isPending && (
                          <button
                            onClick={() => handleUpdateStatus(order._id, "Accepted")}
                            className="w-full px-3 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                          >
                            Accept
                          </button>
                        )}

                        {/* In Transit */}
                        {isAccepted && (
                          <button
                            onClick={() => handleUpdateStatus(order._id, "In Transit")}
                            className="w-full px-3 py-2 text-xs font-semibold text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors"
                          >
                            Set In Transit
                          </button>
                        )}

                        {/* Delivered */}
                        {isInTransit && (
                          <button
                            onClick={() => handleUpdateStatus(order._id, "Delivered")}
                            className="w-full px-3 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Set Delivered
                          </button>
                        )}

                        {/* Delete */}
                        {(isPending || isAccepted || isInTransit) && (
                          <button
                            onClick={() => handleDelete(order._id)}
                            className="w-full px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>


      <div className="flex items-center justify-between px-5 py-4 border-t border-slate-200">
        <p className="text-sm text-slate-500">
          Page {currentPage} of {totalPages || 1}
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => changePage(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border disabled:opacity-50 text-xs"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => changePage(i + 1)}
              className={`px-3 py-1 rounded border text-xs ${currentPage === i + 1
                ? "bg-amber-500 text-white border-amber-500"
                : ""
                }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() =>
              changePage(Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 rounded border disabled:opacity-50 text-xs"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdersTable;