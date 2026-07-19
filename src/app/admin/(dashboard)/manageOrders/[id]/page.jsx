import { getOrderById } from '@/lib/getOrders';
import React from 'react';
import ReceiptButton from '@/components/ReceiptButton';

export default async function OrderDetails({ params }) {
    const { id } = await params
    const order = await getOrderById(id)
    if (!order) {
        notFound();
    }
    // Helper to format ISO dates
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="max-w-4xl mx-auto bg-gray-50  font-sans">
            {/* Header Summary */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Order Details</h1>
                    <p className="text-sm text-gray-500 mt-1">ID: <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">{order._id}</span></p>
                    <p className="text-sm text-gray-500 mt-1">ID: <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">{order.trackingId}</span></p>
                    <p className="text-xs text-gray-400 mt-0.5">Placed on: {formatDate(order.createdAt)}</p>
                </div>
                <div className="flex sm:flex-col flex-row sm:items-start justify-between sm:justify-end md:items-end gap-2">
                    {/* Dynamic Status Badge */}
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${order.orderStatus?.toLowerCase() === 'pending'
                        ? 'bg-amber-100 text-amber-800 border-amber-200'
                        : order.orderStatus?.toLowerCase() === 'accepted'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : order.orderStatus?.toLowerCase() === 'deleted'
                                ? 'bg-rose-100 text-rose-800 border-rose-200'
                                : 'bg-gray-100 text-gray-800 border-gray-200'
                        }`}>
                        <span className={`w-2 h-2 mr-2 rounded-full ${order.orderStatus?.toLowerCase() === 'pending'
                            ? 'bg-amber-500 animate-pulse'
                            : order.orderStatus?.toLowerCase() === 'accepted'
                                ? 'bg-emerald-500'
                                : order.orderStatus?.toLowerCase() === 'deleted'
                                    ? 'bg-rose-500'
                                    : 'bg-gray-400'
                            }`}></span>
                        {order.orderStatus}
                    </span>
                    <ReceiptButton order={order} />

                    {/* Meta Info Panel for Accepted Orders */}
                    {order.orderStatus?.toLowerCase() === 'accepted' && (order.acceptedBy || order.acceptedAt) && (
                        <div className="text-left md:text-right text-xs text-gray-500 space-y-0.5 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100 min-w-[140px]">
                            {order.acceptedBy && (
                                <p>
                                    <span className="text-gray-400">Accepted by:</span>{" "}
                                    <span className="font-semibold text-emerald-900">{order.acceptedBy}</span>
                                </p>
                            )}
                            {order.acceptedAt && (
                                <p className="text-[11px] text-emerald-600 font-mono">
                                    {new Date(order.acceptedAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Meta Info Panel for Deleted Orders */}
                    {order.orderStatus?.toLowerCase() === 'deleted' && (order.deletedBy || order.deletedAt) && (
                        <div className="text-left md:text-right text-xs text-gray-500 space-y-0.5 bg-rose-50/50 p-2 rounded-lg border border-rose-100 min-w-[140px]">
                            {order.deletedBy && (
                                <p>
                                    <span className="text-gray-400">Deleted by:</span>{" "}
                                    <span className="font-semibold text-rose-900">{order.deletedBy}</span>
                                </p>
                            )}
                            {order.deletedAt && (
                                <p className="text-[11px] text-rose-600 font-mono">
                                    {new Date(order.deletedAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer & Shipping Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <h2 className="text-md font-semibold text-gray-700 border-b pb-2 mb-4">Customer & Shipping</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">Full Name</label>
                                <p className="text-sm font-medium text-gray-800">{order.customer.fullName}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">Phone</label>
                                    <p className="text-sm text-gray-800">{order.customer.phoneNumber}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">Email</label>
                                    <p className="text-sm text-gray-800 truncate" title={order.customer.email}>{order.customer.email}</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">Address</label>
                                <p className="text-sm text-gray-800">
                                    {order.customer.deliveryAddress}, {order.customer.thana}, {order.customer.district}
                                </p>
                            </div>
                        </div>
                    </div>

                    {order.customer.specialInstructions && (
                        <div className="mt-6 bg-blue-50 border border-blue-100 p-3 rounded-lg">
                            <label className="block text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Special Instructions</label>
                            <p className="text-sm italic text-blue-800">&quot;{order.customer.specialInstructions}&quot;</p>
                        </div>
                    )}
                </div>

                {/* Payment Statement Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-md font-semibold text-gray-700 border-b pb-2 mb-4">Payment Statement</h2>
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">Method</label>
                                <p className="text-sm text-gray-800 capitalize">{order.payment.method.replace('_', ' ')} ({order.payment.type})</p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">Transaction ID</label>
                                <p className="text-sm font-mono text-gray-800">{order.payment.trxId}</p>
                            </div>
                        </div>

                        <hr className="border-gray-100 my-2" />

                        <div className="space-y-2 pt-1">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Subtotal Amount</span>
                                <span className="font-medium text-gray-800">৳{order.payment.actualAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Service Charge</span>
                                <span className="font-medium text-gray-800">৳{order.payment.charge}</span>
                            </div>
                            <div className="flex justify-between text-sm text-emerald-600 font-medium">
                                <span>Advance Paid</span>
                                <span>- ৳{order.payment.amountPaid.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-200">
                                <span className="text-sm font-semibold text-gray-700">Cash on Delivery (Due)</span>
                                <span className="text-lg font-bold text-rose-600">৳{order.payment.amountDue.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};