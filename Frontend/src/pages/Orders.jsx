import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { Package, ChevronRight } from "lucide-react";

const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/order/user-orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-gray-500">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-extrabold text-black mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white border rounded-2xl p-12 text-center shadow-sm">
          <Package className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
          <Link
            to="/product"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="block bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    Order ID
                  </p>
                  <p className="font-semibold text-black text-sm mt-1">
                    #{order._id.slice(-8)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    Placed On
                  </p>
                  <p className="text-black text-sm mt-1">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    Items
                  </p>
                  <p className="text-black text-sm mt-1">
                    {order.items.length} item{order.items.length > 1 ? "s" : ""}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    Total
                  </p>
                  <p className="font-bold text-black text-sm mt-1">
                    ${order.totalAmount}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusStyles[order.orderStatus] || "bg-gray-100 text-gray-600"
                  }`}
                >
                  {order.orderStatus}
                </span>

                <ChevronRight className="text-gray-400" size={20} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}