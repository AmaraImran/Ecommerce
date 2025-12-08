// Sidebar.jsx
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings
} from "lucide-react";

import SidebarItem from "./SidebarItems";

export default function Sidebar() {
  return (
    <div className="w-20 bg-[#0d0d0d] text-white h-screen py-6 flex flex-col 
    gap-4 border-r border-gray-800 fixed">

      {/* Logo */}
      <div className="text-center text-2xl font-extrabold tracking-widest mb-4">
        LZ
      </div>

      <SidebarItem icon={<LayoutDashboard size={28} />} link="/admin" tooltip="Dashboard" />
      <SidebarItem icon={<Package size={28} />} link="/admin/products" tooltip="Products" />
      <SidebarItem icon={<ShoppingCart size={28} />} link="/admin/orders" tooltip="Orders" />
      <SidebarItem icon={<Users size={28} />} link="/admin/users" tooltip="Users" />
      <SidebarItem icon={<Settings size={28} />} link="/admin/settings" tooltip="Settings" />

    </div>
  );
}
