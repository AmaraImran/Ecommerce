import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { ArrowLeft, AlertTriangle } from "lucide-react";

const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [cancelling, setCancelling] = useState(false);

  const token = localStorage.getItem("token");

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/order/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(res.data.order);
    } catch (error) {
      console.log("Error fetching order:", error.response?.data || error.message);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    setCancelling(true);
    setMessage({ type: "", text: "" });
    try {
      await api.patch(
        `/order/cancel-order/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ type: "success", text: "Order cancelled successfully." });
      fetchOrder();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "This order cannot be cancelled.",
      });
    } finally {
      setCancelling(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EFE6D6] flex items-center justify-center">
        <p className="text-[#8A8070]">Loading...</p>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="min-h-screen bg-[#EFE6D6] flex items-center justify-center px-6">
        <div className="bg-[#FFFDF8] border border-[#E3D8C4] rounded-2xl p-10 text-center max-w-md">
          <p className="text-[#8A8070] mb-4">Order not found.</p>
          <button
            onClick={() => navigate("/order")}
            className="bg-[#3F5B4E] text-[#FBF7EE] px-6 py-2.5 rounded-lg hover:bg-[#2F4A3D] transition text-sm"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EFE6D6]">
      <div className="max-w-3xl mx-auto px-5 py-10">

        <button
          onClick={() => navigate("/order")}
          className="flex items-center gap-2 text-[#8A8070] hover:text-[#2B2420] mb-6 transition text-sm"
        >
          <ArrowLeft size={16} />
          Back to Orders
        </button>

        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-bold text-[#2B2420]">Order Details</h1>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              statusStyles[order.orderStatus] || "bg-gray-100 text-gray-600"
            }`}
          >
            {order.orderStatus}
          </span>
        </div>

        {message.text && (
          <div
            className={`text-sm rounded-lg p-3 mb-4 border ${
              message.type === "success"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* ORDER INFO */}
        <div className="bg-[#FFFDF8] border border-[#E3D8C4] rounded-xl p-5 space-y-2.5 text-sm">
          <p className="text-[#2B2420]">
            <span className="text-[#8A8070]">Order ID:</span> #{order._id.slice(-8)}
          </p>
          <p className="text-[#2B2420]">
            <span className="text-[#8A8070]">Date:</span>{" "}
            {new Date(order.createdAt).toDateString()}
          </p>
          <p className="text-[#2B2420]">
            <span className="text-[#8A8070]">Shipping Address:</span>{" "}
            {order.shippingAddress}
          </p>
          <p className="text-[#2B2420]">
            <span className="text-[#8A8070]">Payment Method:</span>{" "}
            {order.paymentMethod}
          </p>
          <p className="text-[#2B2420]">
            <span className="text-[#8A8070]">Payment Status:</span>{" "}
            {order.paymentStatus}
          </p>
        </div>

        {/* ITEMS */}
        <div className="mt-5 bg-[#FFFDF8] border border-[#E3D8C4] rounded-xl p-5">
          <h2 className="font-semibold text-[#2B2420] mb-3 text-sm">Items</h2>
          <ul className="space-y-2">
            {order.items.map((item, i) => (
              <li key={i} className="flex justify-between items-center text-sm">
                {item.productId ? (
                  <>
                    <span className="text-[#2B2420]">
                      {item.productId.name} × {item.quantity}
                    </span>
                    <span className="text-[#2B2420]">
                      ${item.productId.price * item.quantity}
                    </span>
                  </>
                ) : (
                  <span className="flex items-center gap-2 text-[#8A8070] italic">
                    <AlertTriangle size={14} />
                    Product no longer available × {item.quantity}
                  </span>
                )}
              </li>
            ))}
          </ul>

          <div className="border-t border-[#E3D8C4] mt-3 pt-3 flex justify-between font-bold text-sm text-[#2B2420]">
            <span>Total</span>
            <span>${order.totalAmount}</span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-6">
          {order.orderStatus === "Pending" ? (
            <button
              onClick={cancelOrder}
              disabled={cancelling}
              className="px-6 py-2.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition disabled:opacity-60"
            >
              {cancelling ? "Cancelling..." : "Cancel Order"}
            </button>
          ) : (
            <p className="text-[#8A8070] text-sm">
              This order can no longer be cancelled.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;