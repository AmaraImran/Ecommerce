import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/order/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrder(res.data.order);
    } catch (error) {
      alert("Order not found",error);
      navigate("/order");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await api.patch(`/order/cancel-order/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Order cancelled successfully");
      fetchOrder();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "This order cannot be cancelled"
      );
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (!order) return null;

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <h1 className="text-3xl font-bold mb-6">Order Details</h1>

      {/* ORDER INFO */}
      <div className="bg-white border rounded-xl p-6 space-y-4">
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Date:</strong> {new Date(order.createdAt).toDateString()}</p>
        <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        <p><strong>Payment Status:</strong> {order.paymentStatus}</p>

        <span
          className={`inline-block px-4 py-1 rounded-full text-sm font-medium
            ${
              order.orderStatus === "Delivered"
                ? "bg-green-100 text-green-700"
                : order.orderStatus === "Pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
        >
          {order.orderStatus}
        </span>
      </div>

      {/* ITEMS */}
      <div className="mt-6 bg-white border rounded-xl p-6">
        <h2 className="font-semibold mb-4">Items</h2>
        <ul className="space-y-2">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between text-sm">
              <span>
                {item.productId?.name} × {item.quantity}
              </span>
              <span>
                ${item.productId?.price * item.quantity}
              </span>
            </li>
          ))}
        </ul>

        <div className="border-t mt-4 pt-4 flex justify-between font-bold">
          <span>Total</span>
          <span>${order.totalAmount}</span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="mt-6 flex gap-4">
        {order.orderStatus === "Pending" ? (
          <button
            onClick={cancelOrder}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Cancel Order
          </button>
        ) : (
          <p className="text-red-600 font-medium">
            This order cannot be cancelled
          </p>
        )}

        <button
          onClick={() => navigate("/orders")}
          className="px-6 py-3 border rounded-lg hover:bg-black hover:text-white"
        >
          Back to Orders
        </button>
      </div>
    </div>
  );
};

export default OrderDetail;
