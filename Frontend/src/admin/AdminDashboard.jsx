// src/admin/AdminDashboard.jsx
import { Package, ShoppingCart, Users, DollarSign } from "lucide-react";
import DashboardCard from "./components/DashboardCard";

export default function AdminDashboard() {
  return (
    <div className="w-full">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Total Products" count="120" icon={<Package size={36} />} />
        <DashboardCard title="Total Orders" count="45" icon={<ShoppingCart size={36} />} />
        <DashboardCard title="Users" count="210" icon={<Users size={36} />} />
        <DashboardCard title="Revenue" count="$12,450" icon={<DollarSign size={36} />} />
      </div>

      {/* You can add charts, recent orders, etc. here */}
    </div>
  );
}