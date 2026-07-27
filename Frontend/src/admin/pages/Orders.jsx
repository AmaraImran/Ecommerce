import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Package, ChevronRight } from "lucide-react";

const statusStyles = {
  Pending: "bg-yellow-900/40 text-yellow-300 border border-yellow-800",
  Shipped: "bg-blue-900/40 text-blue-300 border border-blue-800",
  Delivered: "bg-green-900/40 text-green-300 border border-green-800",
  Cancelled: "bg-red-900/40 text-red-300 border border-red-800",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const res = await api.get("/order/all-orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrders(res.data.orders || []);
    } catch (error) {
      console.error("Error fetching orders", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    // optimistic update so the dropdown feels instant
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, orderStatus: status } : o))
    );
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
    } catch (error) {
      console.error("Failed to update order status", error);
      alert("Failed to update order status");
      fetchOrders(); // revert to server truth on failure
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="ml-20 p-10 min-h-screen bg-[#0a0a0a]">
      <h1 className="text-3xl font-extrabold text-white mb-8">All Orders</h1>

      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="bg-[#151515] border border-gray-800 rounded-xl p-10 text-center">
          <Package className="mx-auto text-gray-600 mb-3" size={40} />
          <p className="text-gray-400">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-[#151515] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition"
            >
              {/* HEADER */}
              <div className="flex flex-wrap justify-between gap-6 pb-4 border-b border-gray-800">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Order ID
                  </p>
                  <p className="font-semibold text-white text-sm mt-1">
                    #{order._id.slice(-8)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Customer
                  </p>
                  <p className="font-semibold text-white text-sm mt-1">
                    {order.userId?.name || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500">{order.userId?.email}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Total
                  </p>
                  <p className="font-bold text-white text-sm mt-1">
                    ${order.totalAmount}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Status
                  </p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusStyles[order.orderStatus] ||
                      "bg-gray-800 text-gray-300 border border-gray-700"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              {/* ITEMS */}
              <div className="mt-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                  Items
                </p>
                <ul className="text-sm text-gray-300 space-y-1">
                  {order.items.map((item, i) => (
                    <li key={i} className="flex justify-between max-w-md">
                      <span>
                        {item.productId?.name || "Unknown product"} × {item.quantity}
                      </span>
                      <span className="text-gray-500">
                        ${item.productId?.price}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ACTIONS */}
              <div className="mt-6 flex items-center gap-3">
                <select
                  value={order.orderStatus}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="bg-[#0d0d0d] border border-gray-700 text-white text-sm rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <button
                  onClick={() => navigate(`/admin/orders/${order._id}`)}
                  className="flex items-center gap-1 border border-gray-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-purple-600 hover:border-purple-600 transition"
                >
                  View Order
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;