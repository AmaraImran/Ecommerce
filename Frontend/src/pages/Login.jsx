import React, { useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      

      const res = await api.post(`/auth/sign-in/`, formData, {
        withCredentials: true,
      });

      console.log(res.data);
      alert("Logged in successfully!");
      navigate("/");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-white font-poppins">

      {/* Left image — hidden on small screens */}
      <div className="hidden md:flex md:w-1/2 w-full items-center justify-center relative">
        <h1 className="absolute top-0 left-0 text-black text-3xl px-10 py-10 font-extrabold">
          LUDANZA
        </h1>

        <img
          src="/src/assets/login.jpg"
          alt="Login illustration"
          className="w-full h-screen object-cover rounded-2xl "
        />
      </div>

      {/* Right Side Form */}
      <div className="md:w-1/2 w-full flex items-center justify-center p-8 ">
        <div className="w-full max-w-md rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-0 text-black">Welcome Back 👋</h2>
          <p className="text-stone-600 text-sm mb-5">Please login to continue</p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-2 text-black">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded border border-black text-black focus:ring-2 focus:ring-red-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-black">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded border border-black text-black focus:ring-2 focus:ring-red-300"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-black border border-black hover:bg-purple-700 transition-colors duration-300 text-white py-3 rounded font-semibold"
            >
              Log In
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-purple-400 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
