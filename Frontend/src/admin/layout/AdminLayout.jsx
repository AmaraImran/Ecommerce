// src/admin/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function AdminLayout() {
  return (
    <div className="flex bg-black text-white min-h-screen">
      {/* Sidebar - rendered only once */}
      <Sidebar />

      {/* All admin pages go here */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Outlet />   {/* This is where AdminDashboard, AddProduct, etc. will appear */}
      </div>
    </div>
  );
}