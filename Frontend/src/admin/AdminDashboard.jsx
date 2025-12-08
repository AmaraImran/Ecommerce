// AdminDashboard.jsx
import { Package, ShoppingCart, Users, DollarSign } from "lucide-react";
import Sidebar from "./components/Sidebar";
import DashboardCard from "./components/DashboardCard";

export default function AdminDashboard() {
  return (
    <div className="flex">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Dashboard Content */}
      <div className="flex-1 ml-16 p-10 bg-[#0f0f0f] min-h-screen text-white">
        
        {/* Header */}
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard 
            title="Total Products" 
            count="120"
            icon={<Package size={26} />}
          />

          <DashboardCard 
            title="Total Orders" 
            count="45"
            icon={<ShoppingCart size={26} />}
          />

          <DashboardCard 
            title="Users" 
            count="210"
            icon={<Users size={26} />}
          />

          <DashboardCard 
            title="Revenue" 
            count="$12,450"
            icon={<DollarSign size={26} />}
          />
        </div>

      </div>
    </div>
  );
}
