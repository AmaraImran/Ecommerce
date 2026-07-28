import React, { useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post(`/auth/sign-in/`, formData, {
        withCredentials: true,
      });

      login(res.data.token);
      navigate("/");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#EDE4D3]">
      <div className="hidden md:flex md:w-1/2 w-full items-center justify-center relative bg-[#F7F1E6]">
        <h1 className="absolute top-0 left-0 text-[#2B2420] text-3xl px-10 py-10 font-extrabold">
          LUDANZA
        </h1>
        <img
          src="login.jfif"
          alt="Login illustration"
          className="w-full h-screen object-cover"
        />
      </div>

      <div className="md:w-1/2 w-full flex items-center justify-center p-8">
        <div className="w-full max-w-md rounded-2xl p-8 bg-[#FFFDF8] shadow-sm border border-[#E3D8C4]">
          <h2 className="text-2xl font-bold mb-0 text-[#2B2420]">Welcome Back 👋</h2>
          <p className="text-[#8A8070] text-sm mb-5">Please login to continue</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-2 text-[#2B2420]">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded border border-[#E3D8C4] bg-[#FFFDF8] text-[#2B2420] focus:outline-none focus:ring-2 focus:ring-[#3F5B4E]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-[#2B2420]">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded border border-[#E3D8C4] bg-[#FFFDF8] text-[#2B2420] focus:outline-none focus:ring-2 focus:ring-[#3F5B4E]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-[#3F5B4E] hover:bg-[#2F4A3D] transition-colors duration-300 text-[#FBF7EE] py-3 rounded font-semibold disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="text-center text-[#8A8070] mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#3F5B4E] font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}