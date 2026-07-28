import React, { useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [formdata, setformdata] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setformdata({ ...formdata, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post(`/auth/sign-up/`, formdata, {
        withCredentials: true,
      });
      console.log("Signup successful:", res.data);

      navigate("/login");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#EDE4D3]">
      {/* Left Side - Image */}
      <div className="hidden md:flex md:w-1/2 w-full items-center justify-center relative bg-[#F7F1E6]">
        <h1 className="absolute top-0 left-0 text-[#2B2420] text-3xl px-10 py-10 font-extrabold">
          LUDANZA
        </h1>
        <img
          src="/signup.jfif"
          alt="Signup illustration"
          className="w-full h-screen object-cover"
        />
      </div>

      {/* Right Side - Form */}
      <div className="md:w-1/2 w-full flex items-center justify-center p-8">
        <div className="w-full max-w-md rounded-2xl p-8 bg-[#FFFDF8] shadow-sm border border-[#E3D8C4]">
          <h2 className="text-2xl font-bold mb-0 text-[#2B2420]">
            Create Account 👋
          </h2>
          <p className="text-[#8A8070] text-sm mb-5">Please enter your details</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-2 text-[#2B2420]">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formdata.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded border border-[#E3D8C4] bg-[#FFFDF8] text-[#2B2420] focus:outline-none focus:ring-2 focus:ring-[#3F5B4E]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-[#2B2420]">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formdata.email}
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
                value={formdata.password}
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
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-[#8A8070] mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-[#3F5B4E] font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}