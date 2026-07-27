// Sidebar.jsx
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  PlusSquare,
  Tag
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
      <SidebarItem icon={<PlusSquare size={28} />} link="/admin/add-product" tooltip="Add Product" />
      <SidebarItem icon={<Tag size={28} />} link="/admin/manage-category" tooltip="Categories" />
      <SidebarItem icon={<ShoppingCart size={28} />} link="/admin/orders" tooltip="Orders" />

    </div>
  );
}