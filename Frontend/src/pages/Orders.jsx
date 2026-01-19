import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/order/all-orders/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setOrders(res.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-600">You have no orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-xl p-6 shadow-sm bg-white"
            >
              {/* HEADER */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-semibold">{order._id}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-semibold">
                    {new Date(order.createdAt).toDateString()}
                  </p>
                </div>

                <span
                  className={`px-4 py-1 rounded-full text-sm font-medium
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
              <div className="mt-4">
                <p className="font-semibold mb-2">Items</p>
                <ul className="text-gray-700 text-sm space-y-1">
                  {order.items.map((item, i) => (
                    <li key={i}>
                      {item.productId?.name || "Product"} × {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>

              {/* FOOTER */}
              <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <p className="text-lg font-bold">
                  Total: <span className="text-black">${order.totalAmount}</span>
                </p>

                <button
                  onClick={() => navigate(`/orders/${order._id}`)}
                  className="border border-black px-6 py-2 rounded-lg hover:bg-black hover:text-white transition"
                >
                  View Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
