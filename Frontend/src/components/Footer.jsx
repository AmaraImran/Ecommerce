import {FacebookIcon,Instagram,Twitter} from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-black text-white py-6 px-10 w-full mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">

        {/* Logo */}
        <h1 className="text-xl font-bold tracking-wide">LUDANZA</h1>

        {/* Copyright */}
        <p className="text-sm text-gray-300 text-center">
          © 2024 Ludanza. All rights reserved.
        </p>

        {/* Icons */}
        <div className="flex space-x-4 text-lg">
          <a href="#" className="hover:text-purple-400 transition">
           <FacebookIcon / >
          </a>
          <a href="#" className="hover:text-purple-400 transition">
            <Instagram />
          </a>
          <a href="#" className="hover:text-purple-400 transition">
            <Twitter />
          </a>
        </div>

      </div>
    </footer>
  );
}
