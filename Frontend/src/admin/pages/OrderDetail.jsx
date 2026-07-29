import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { ArrowLeft, AlertTriangle } from "lucide-react";

const statusStyles = {
  Pending: "bg-yellow-900/40 text-yellow-300 border border-yellow-800",
  Shipped: "bg-blue-900/40 text-blue-300 border border-blue-800",
  Delivered: "bg-green-900/40 text-green-300 border border-green-800",
  Cancelled: "bg-red-900/40 text-red-300 border border-red-800",
};

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [updating, setUpdating] = useState(false);

  const token = localStorage.getItem("token");

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/order/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(res.data.order);
    } catch (error) {
      console.error("Error fetching order:", error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    setUpdating(true);
    try {
      await api.patch(
        `/order/update-status/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrder();
    } catch (error) {
      console.error("Failed to update order status", error);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="ml-20 p-10 min-h-screen bg-[#0a0a0a]">
        <p className="text-gray-500">Loading order...</p>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="ml-20 p-10 min-h-screen bg-[#0a0a0a]">
        <p className="text-gray-400 mb-4">Order not found.</p>
        <button
          onClick={() => navigate("/admin/orders")}
          className="text-purple-400 hover:underline text-sm"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="ml-20 p-10 min-h-screen bg-[#0a0a0a]">
      <button
        onClick={() => navigate("/admin/orders")}
        className="flex items-center gap-2 text-gray-500 hover:text-white mb-6 transition text-sm"
      >
        <ArrowLeft size={16} />
        Back to Orders
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">
          Order #{order._id.slice(-8)}
        </h1>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            statusStyles[order.orderStatus] ||
            "bg-gray-800 text-gray-300 border border-gray-700"
          }`}
        >
          {order.orderStatus}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* CUSTOMER + ORDER INFO */}
        <div className="bg-[#151515] border border-gray-800 rounded-xl p-6 space-y-3 text-sm">
          <h2 className="text-white font-semibold mb-2">Order Info</h2>
          <InfoRow label="Customer" value={order.userId?.name || "N/A"} />
          <InfoRow label="Email" value={order.userId?.email || "N/A"} />
          <InfoRow label="Date" value={new Date(order.createdAt).toDateString()} />
          <InfoRow label="Shipping Address" value={order.shippingAddress} />
          <InfoRow label="Payment Method" value={order.paymentMethod} />
          <InfoRow label="Payment Status" value={order.paymentStatus} />
        </div>

        {/* ITEMS + TOTAL */}
        <div className="bg-[#151515] border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-3 text-sm">Items</h2>
          <ul className="space-y-2 text-sm">
            {order.items.map((item, i) => (
              <li key={i} className="flex justify-between items-center">
                {item.productId ? (
                  <>
                    <span className="text-gray-300">
                      {item.productId.name} × {item.quantity}
                    </span>
                    <span className="text-gray-400">
                      ${item.productId.price * item.quantity}
                    </span>
                  </>
                ) : (
                  <span className="flex items-center gap-2 text-gray-500 italic">
                    <AlertTriangle size={14} />
                    Product deleted × {item.quantity}
                  </span>
                )}
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-800 mt-3 pt-3 flex justify-between font-bold text-white text-sm">
            <span>Total</span>
            <span>${order.totalAmount}</span>
          </div>
        </div>
      </div>

      {/* STATUS UPDATE */}
      <div className="mt-6 bg-[#151515] border border-gray-800 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-3 text-sm">Update Status</h2>
        <select
          value={order.orderStatus}
          onChange={(e) => updateStatus(e.target.value)}
          disabled={updating}
          className="bg-[#0d0d0d] border border-gray-700 text-white text-sm rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none disabled:opacity-50"
        >
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <p className="text-gray-300">
      <span className="text-gray-500">{label}:</span> {value}
    </p>
  );
}