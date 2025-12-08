// SidebarItem.jsx
import { Link } from "react-router-dom";

export default function SidebarItem({ icon, link, tooltip }) {
  return (
    <Link
      to={link}
      className="relative flex items-center justify-center 
      p-4 rounded-xl hover:bg-gray-800 transition duration-200 group"
    >
      <div className="text-gray-300 group-hover:text-white transition">
        {icon}
      </div>

      {/* Tooltip */}
      <span className="absolute left-24 bg-black px-3 py-1 rounded text-xs 
        opacity-0 group-hover:opacity-100 transition whitespace-nowrap border border-gray-700">
        {tooltip}
      </span>
    </Link>
  );
}
