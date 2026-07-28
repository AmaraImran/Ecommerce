import { FacebookIcon, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#2B2420] text-[#FBF7EE] py-8 px-10 w-full mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">

        {/* Logo */}
        <h1 className="text-xl font-bold tracking-wide">LUDANZA</h1>

        {/* Copyright + Credit */}
        <div className="text-center">
          <p className="text-sm text-[#C9BEA8]">
            © {year} Ludanza. All rights reserved.
          </p>
          <p className="text-xs text-[#8A8070] mt-1">
            Crafted with care by Amara Imran
          </p>
        </div>

        {/* Icons */}
        <div className="flex space-x-4 text-lg">
          <a href="#" className="hover:text-[#D9A441] transition">
            <FacebookIcon />
          </a>
          <a href="#" className="hover:text-[#D9A441] transition">
            <Instagram />
          </a>
          <a href="#" className="hover:text-[#D9A441] transition">
            <Twitter />
          </a>
        </div>

      </div>
    </footer>
  );
}