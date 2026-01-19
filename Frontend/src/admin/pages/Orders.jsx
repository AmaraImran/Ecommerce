import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const res = await api.get("/order/all-orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setOrders(res.data.orders);
    } catch (error) {
      console.error("Error fetching orders", error);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.patch(
        `/order/update-status/${orderId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchOrders();
    } catch (error) {
      alert("Failed to update order status",error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">All Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white border rounded-xl p-6 shadow-sm"
          >
            {/* HEADER */}
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-semibold">{order._id}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">User</p>
                <p className="font-semibold">
                  {order.userId?.name}
                </p>
                <p className="text-sm text-gray-500">
                  {order.userId?.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-bold">${order.totalAmount}</p>
              </div>

              <span
                className={`px-4 py-1 rounded-full text-sm font-medium
                  ${
                    order.orderStatus === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.orderStatus === "Shipped"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
              >
                {order.orderStatus}
              </span>
            </div>

            {/* ITEMS */}
            <div className="mt-4">
              <p className="font-semibold mb-2">Items</p>
              <ul className="text-sm text-gray-700 space-y-1">
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.productId?.name} × {item.quantity} (
                    ${item.productId?.price})
                  </li>
                ))}
              </ul>
            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex gap-4 items-center">
              <select
                value={order.orderStatus}
                onChange={(e) =>
                  updateStatus(order._id, e.target.value)
                }
                className="border rounded-lg px-4 py-2"
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>

              <button
                onClick={() => navigate(`/admin/orders/${order._id}`)}
                className="border px-4 py-2 rounded-lg hover:bg-black hover:text-white transition"
              >
                View Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
