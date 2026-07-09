'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';

const OrdersTable = () => {
  const [statusFilter, setStatusFilter] = useState("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

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
    if (statusFilter === "all") return orders;

    return orders.filter(
      (order) =>
        order.orderStatus?.toLowerCase() === statusFilter.toLowerCase()
    );
  }, [orders, statusFilter]);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const pendingCount = orders.filter(
    order => order.orderStatus === "Pending"
  ).length;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 font-medium">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4"></div>
        Loading orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-red-50 rounded-xl border border-red-200 p-6 text-center text-red-700 font-medium">
        Error loading orders: {error.message}
      </div>
    );
  }

  const handleAccept = async (id) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderStatus: "Accepted",
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      refetch(); // from useQuery
    } catch (err) {
      console.log(err);
    }
  };


  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      refetch();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

      {/* Table Header / Actions bar */}
      <div className="p-5 border-b border-slate-300 flex flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md border border-slate-200">
            Total: {filteredOrders.length}
          </span>

          {pendingCount > 0 && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-red-500 text-white rounded-md">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              {pendingCount} Pending
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="select select-bordered select-sm w-44"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="deleted">Deleted</option>
          </select>
        </div>
      </div>

      {/* Responsive Wrapper */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-400 font-semibold text-xs tracking-wider uppercase border-b border-slate-200">
              <th className="py-3 px-5">Customer Info</th>
              <th className="py-3 px-5 w-[300px]">Ordered Products</th>
              <th className="py-3 px-5">Payment Details</th>
              <th className="py-3 px-5">Due</th>
              <th className="py-3 px-5 text-center">Status</th>
              <th className="py-3 px-5 text-right">Actions</th>
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
                const isPending = order.orderStatus?.toLowerCase() === 'pending';
                const isAccepted = order.orderStatus?.toLowerCase() === 'accepted';

                return (
                  <tr key={order._id} className="hover:bg-slate-50/70 transition-colors items-start">

                    {/* 2. Customer Detail Block */}
                    <td className="py-4 px-5 align-top">
                      <p className="font-semibold text-slate-800">{order.customer?.fullName}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{order.customer?.phoneNumber}</p>
                      <p className="text-xs text-slate-400 truncate max-w-[160px]" title={order.customer?.email}>
                        {order.customer?.email}
                      </p>
                    </td>

                    {/* 3. NEW PRODUCT DETAILS COLUMN */}
                    <td className="py-4 px-5 align-top">
                      <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
                        {order.cartItems && order.cartItems.length > 0 ? (
                          order.cartItems.map((item, index) => (
                            <div key={item.id || index} className="flex gap-2.5 items-center bg-slate-50/60 p-1.5 rounded-lg border border-slate-100">
                              {/* Thumbnail Image Wrapper */}
                              <div className="h-10 w-10 shrink-0 bg-slate-200 rounded-md overflow-hidden border border-slate-200 flex items-center justify-center text-[10px] text-slate-400">
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

                    {/* 4. Payment Overview */}
                    <td className="py-4 px-5 align-top">
                      <div className="text-xs text-slate-700 space-y-0.5">
                        <p><span className="text-slate-400">Method:</span> <span className="capitalize font-medium">{order.payment?.method?.replace('_', ' ')}</span></p>
                        <p><span className="text-slate-400">TrxID:</span> <span className="font-mono text-slate-600 bg-slate-50 px-1 rounded">{order.payment?.trxId}</span></p>
                        <p><span className="text-slate-400">Paid:</span> <span className="text-emerald-600 font-medium">৳{order.payment?.amountPaid?.toLocaleString()}</span></p>
                      </div>
                    </td>

                    {/* 5. Due Amount Balance */}
                    <td className="py-4 px-5 align-top font-bold text-slate-800">
                      ৳{order.payment?.amountDue?.toLocaleString()}
                    </td>

                    {/* 6. Context Status Badge */}
                    <td className="py-4 px-5 align-top text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${isPending
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : isAccepted
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-red-500 text-white border-slate-200'
                        }`}>
                        <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${isPending ? 'bg-amber-500 animate-pulse' : isAccepted ? 'bg-emerald-500' : 'bg-white'}`}></span>
                        {order.orderStatus}
                      </span>
                    </td>

                    {/* 7. Interactive Action Layout */}
                    <td className="py-4 px-5 align-top text-right">
                      <div className="inline-flex gap-2">
                        <Link
                          href={`/admin/manageOrders/${order._id}`}
                          className="px-2.5 py-1.5 text-xs font-semibold text-amber-500 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          View
                        </Link>

                        {isPending && (
                          <button
                            onClick={() => handleAccept(order._id)}
                            className="px-2.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-sm transition-colors cursor-pointer"
                          >
                            Accept
                          </button>
                        )}
                        {filteredOrders.orderStatus === "Pending" || filteredOrders.orderStatus === "Accepted" &&
                          <button
                            onClick={() => handleDelete(order._id)}
                            className="px-2.5 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        }
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
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded border ${currentPage === i + 1
                ? "bg-amber-500 text-white border-amber-500"
                : ""
                }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, totalPages))
            }
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdersTable;