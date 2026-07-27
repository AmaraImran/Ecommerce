// pages/admin/ManageCategories.jsx
import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { Trash2, Plus } from "lucide-react";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const fetchCategories = async () => {
    try {
      const res = await api.get("/category/all-categories");
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await api.post(
        "/category/create-category",
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setName("");
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await api.delete(`/category/delete-category/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting category");
    }
  };

  return (
    <div className="ml-20 p-10 min-h-screen bg-[#f8f8f8]">
      <h1 className="text-3xl font-extrabold text-black mb-6">Manage Categories</h1>

      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-2xl mb-8">
        <form onSubmit={handleAdd} className="flex gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Home Decor"
            className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-400 border-gray-300 text-black"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition flex items-center gap-2"
          >
            <Plus size={18} />
            Add
          </button>
        </form>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-2xl">
        {categories.length === 0 ? (
          <p className="text-gray-400">No categories yet. Add one above.</p>
        ) : (
          <ul className="space-y-3">
            {categories.map((cat) => (
              <li
                key={cat._id}
                className="flex justify-between items-center border-b pb-3 last:border-0"
              >
                <span className="text-black font-medium">{cat.name}</span>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}