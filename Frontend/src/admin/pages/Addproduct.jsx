import React, { useState } from "react";
import api from "../../services/api";
import { Upload, Image as ImageIcon } from "lucide-react";

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  // Handle text input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image selection + preview
  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };
const token=localStorage.getItem("token")
  // Submit Product
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("description", formData.description);
      fd.append("price", formData.price);
      fd.append("stock", formData.stock);
      fd.append("category", formData.category);
      if (image) fd.append("image", image);

      const res = await api.post("/product/create-product", fd, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
        "Authorization":`Bearer${token}`
    
      });

      alert("Product added successfully!");
      console.log(res.data);

      // Reset
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
      });
      setImage(null);
      setPreview("");

    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Error adding product");
    }
  };

  return (
    <div className="ml-20 p-10 min-h-screen bg-[#f8f8f8]">

      <h1 className="text-3xl font-extrabold text-black mb-6">Add New Product</h1>

      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-3xl">

        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {/* Product Name */}
          <div>
            <label className="font-semibold text-black">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-400 border border-gray-300 text-black"
              placeholder="Enter product name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-semibold text-black">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-400 border-gray-300 text-black"
              placeholder="Product description"
            ></textarea>
          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="font-semibold text-black">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-400 border-gray-300 text-black"
                placeholder="Price"
              />
            </div>

            <div>
              <label className="font-semibold text-black">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-400 border-gray-300 text-black"
                placeholder="Stock quantity"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="font-semibold text-black">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-400 border-gray-300 text-black"
              placeholder="e.g., Shoes, Hoodie, Shirt"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="font-semibold text-black">Product Image</label>

            <div className="flex items-center gap-3 mt-2">
              <label
                className="flex items-center gap-3 cursor-pointer bg-black text-white px-5 py-3 rounded-lg hover:bg-purple-700 transition"
              >
                <Upload size={20} />
                Upload Image
                <input type="file" className="hidden" accept="image/*" onChange={handleImage} />
              </label>

              {/* Show preview */}
              {preview ? (
                <img
                  src={preview}
                  className="w-20 h-20 rounded-lg object-cover border"
                />
              ) : (
                <div className="w-20 h-20 border rounded-lg flex items-center justify-center text-gray-400">
                  <ImageIcon size={28} />
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-xl text-lg font-semibold hover:bg-purple-700 transition"
          >
            Add Product
          </button>
        </form>

      </div>
    </div>
  );
}
