
import React, { useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
export default function Signup() {
    const navigate=useNavigate()
const [formdata,setformdata]=useState({
    name:"",
    email:"",
    password:""
})

const handleChange=(e)=>{
    setformdata({...formdata,[e.target.name]:e.target.value})
}
const handleSubmit=async(e)=>{
    e.preventDefault()
    try {
      console.log(`/auth/sign-up/`, formdata);
     const res =await api.post(`/auth/sign-up/`,
        formdata,
     { withCredentials: true } )
console.log(res.data);
      alert(" successfuly Registered!");
      navigate("/")


    } catch (err) {
         console.error(err.response?.data || err.message);
      alert(`${err.message}`);
    }
}

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-white font-poppins">
      {/* Left Side - Image */}
      <div className="md:w-1/2 w-full flex items-center justify-center ">
      <h1 className="absolute top-0 left-0  text-black  text-3xl px-10 py-10 font-extrabold ">LUDANZA</h1>
        <img
          src="/src/assets/signup.jpg"
          alt="Signup illustration"
          className="w-full h-full object-cover rounded-2xl"
        />
      </div>

      {/* Right Side - Form */}
      <div className="md:w-1/2 w-full flex items-center justify-center p-8">
        <div className="w-full max-w-md  rounded-2xl  p-8">
          <h2 className="text-2xl font-bold  mb-0 text-black">
            Create Account👋
          </h2>
          <p className="text-stone-600 text-sm mb-5">please enter details
          </p>

          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-black">Full Name</label>
              <input
                type="text"
                name="name"

                value={formdata.name}
                onChange={handleChange}
            
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded  border border-black text-black focus:ring-2 focus:ring-red-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-black">Email</label>
              <input
                type="email"
                name="email"
                value={formdata.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded   text-black border border-black focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-black">Password</label>
              <input
              value={formdata.password}
                type="password"
                onChange={handleChange}
                name="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded  border border-black text-black focus:ring-2 focus:ring-red-300"
              />
            </div>

            <button
            onClick={handleSubmit}
              type="submit"
              className="w-full mt-4 bg-black border border-black hover:bg-purple-700 transition-colors duration-300 text-white py-3 rounded font-semibold"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-400 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
