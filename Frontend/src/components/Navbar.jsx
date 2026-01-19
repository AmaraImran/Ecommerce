import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // For mobile menu icons

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full shadow-sm">
      <div className="flex justify-between items-center py-5 px-6 md:px-16">

        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold tracking-widest">
          LUDANZA
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-10 items-center font-medium">
          <NavItem to="/" label="Home" />
          <NavItem to="/product" label="Shop" />
          <NavItem to="/cart" label="cart" />

          <Link
            to="/login"
            className="px-6 py-2 bg-black text-white rounded-xl hover:bg-purple-700 transition"
          >
            Login
          </Link>
        </ul>

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-white px-6 pb-4 space-y-4 text-black font-medium">
          <MobileItem to="/" label="Home" setOpen={setOpen} />
          <MobileItem to="/shop" label="Shop" setOpen={setOpen} />

          <Link
            to="/login"
            className="block px-4 py-2 bg-black text-white rounded-xl text-center"
            onClick={() => setOpen(false)}
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}

/* Desktop Nav Item with hover underline animation */
function NavItem({ to, label }) {
  return (
    <li>
      <Link
        to={to}
        className="relative group"
      >
        {label}
        <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-black transition-all duration-300 group-hover:w-full"></span>
      </Link>
    </li>
  );
}

/* Mobile Menu Item */
function MobileItem({ to, label, setOpen }) {
  return (
    <Link
      to={to}
      onClick={() => setOpen(false)}
      className="block py-2"
    >
      {label}
    </Link>
  );
}

