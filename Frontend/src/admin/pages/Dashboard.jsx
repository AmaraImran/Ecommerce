import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { Package, Tag, ShoppingCart, Clock } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import DashboardCard from "../components/DashboardCard"; 
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    pending: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, categoriesRes, ordersRes] = await Promise.all([
          api.get("/product", authHeader).catch(() => ({ data: { products: [] } })),
          api.get("/category/all-categories").catch(() => ({ data: { categories: [] } })),
          api.get("/order/all-orders", authHeader).catch(() => ({ data: { orders: [] } })),
        ]);

        const products = productsRes.data.products || productsRes.data || [];
        const categories = categoriesRes.data.categories || [];
        const orders = ordersRes.data.orders || ordersRes.data || [];

        const pendingCount = orders.filter(
          (o) => o.orderStatus === "Pending"
        ).length;

        setStats({
          products: Array.isArray(products) ? products.length : 0,
          categories: categories.length,
          orders: orders.length,
          pending: pendingCount,
        });

        // Recent 5 orders, sorted newest first
        const sorted = [...orders].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRecentOrders(sorted.slice(0, 5));

        // Build last-7-days order count chart
        const days = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          days.push({
            label: d.toLocaleDateString("en-US", { weekday: "short" }),
            dateKey: d.toDateString(),
            count: 0,
          });
        }
        orders.forEach((order) => {
          const orderDate = new Date(order.createdAt).toDateString();
          const day = days.find((d) => d.dateKey === orderDate);
          if (day) day.count += 1;
        });
        setChartData(days);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="ml-20 p-10 min-h-screen bg-[#0a0a0a]">
      <h1 className="text-3xl font-extrabold text-white mb-8">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <DashboardCard
          title="Total Products"
          count={loading ? "..." : stats.products}
          icon={<Package className="text-purple-400" size={24} />}
        />
        <DashboardCard
          title="Total Categories"
          count={loading ? "..." : stats.categories}
          icon={<Tag className="text-purple-400" size={24} />}
        />
        <DashboardCard
          title="Total Orders"
          count={loading ? "..." : stats.orders}
          icon={<ShoppingCart className="text-purple-400" size={24} />}
        />
        <DashboardCard
          title="Pending Orders"
          count={loading ? "..." : stats.pending}
          icon={<Clock className="text-purple-400" size={24} />}
        />
      </div>

      {/* Chart + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Trend Chart */}
        <div className="bg-[#151515] border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Orders — Last 7 Days</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="label" stroke="#999" fontSize={12} />
              <YAxis stroke="#999" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: "#1a1a1a", border: "1px solid #333" }}
                labelStyle={{ color: "#fff" }}
              />
              <Bar dataKey="count" fill="#a855f7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Orders */}
        <div className="bg-[#151515] border border-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white font-semibold">Recent Orders</h2>
            <Link
              to="/admin/orders"
              className="text-purple-400 text-sm hover:underline"
            >
              View all
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-sm">No orders yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentOrders.map((order) => (
                <li
                  key={order._id}
                  className="flex justify-between items-center border-b border-gray-800 pb-3 last:border-0"
                >
                  <div>
                    <p className="text-white text-sm font-medium">
                      #{order._id.slice(-6)}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      order.orderStatus === "Pending"
                        ? "bg-yellow-900 text-yellow-300"
                        : order.orderStatus === "Delivered"
                        ? "bg-green-900 text-green-300"
                        : order.orderStatus === "Cancelled"
                        ? "bg-red-900 text-red-300"
                        : "bg-gray-800 text-gray-300"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 flex gap-4">
        <Link
          to="/admin/add-product"
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-lg font-medium transition"
        >
          + Add Product
        </Link>
        <Link
          to="/admin/manage-category"
          className="bg-[#151515] border border-gray-800 hover:bg-[#1a1a1a] text-white px-5 py-3 rounded-lg font-medium transition"
        >
          Manage Categories
        </Link>
      </div>
    </div>
  );
}