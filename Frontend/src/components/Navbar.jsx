import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  return (
    <nav className="w-full shadow-sm">
      <div className="flex justify-between items-center py-5 px-6 md:px-16">
        <Link to="/" className="text-2xl font-extrabold tracking-widest">
          LUDANZA
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-10 items-center font-medium">
          <NavItem to="/" label="Home" />
          <NavItem to="/product" label="Shop" />
          <NavItem to="/cart" label="Cart" />

          {user?.role === "admin" ? (
            <>
              <NavItem to="/admin" label="Admin Panel" />
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-black text-white rounded-xl hover:bg-purple-700 transition"
              >
                Logout
              </button>
            </>
          ) : user ? (
            <>
              <NavItem to="/profile" label="Profile" />
              <NavItem to="/order" label="My Orders" />
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-black text-white rounded-xl hover:bg-purple-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2 bg-black text-white rounded-xl hover:bg-purple-700 transition"
            >
              Login
            </Link>
          )}
        </ul>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-white px-6 pb-4 space-y-4 text-black font-medium">
          <MobileItem to="/" label="Home" setOpen={setOpen} />
          <MobileItem to="/product" label="Shop" setOpen={setOpen} />
          <MobileItem to="/cart" label="Cart" setOpen={setOpen} />

          {user?.role === "admin" ? (
            <>
              <MobileItem to="/admin" label="Admin Panel" setOpen={setOpen} />
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 bg-black text-white rounded-xl text-center"
              >
                Logout
              </button>
            </>
          ) : user ? (
            <>
              <MobileItem to="/profile" label="Profile" setOpen={setOpen} />
              <MobileItem to="/order" label="My Orders" setOpen={setOpen} />
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 bg-black text-white rounded-xl text-center"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block px-4 py-2 bg-black text-white rounded-xl text-center"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

function NavItem({ to, label }) {
  return (
    <li>
      <Link to={to} className="relative group">
        {label}
        <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-black transition-all duration-300 group-hover:w-full"></span>
      </Link>
    </li>
  );
}

function MobileItem({ to, label, setOpen }) {
  return (
    <Link to={to} onClick={() => setOpen(false)} className="block py-2">
      {label}
    </Link>
  );
}