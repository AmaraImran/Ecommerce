import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import api from "../../services/api";
import { Link } from "react-router-dom";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/product/");
        setProducts(res.data.products || res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="px-15">
      <h1 className="text-2xl font-semibold mb-4">Manage Products</h1>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white shadow rounded overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100 text-left text-black">
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b">
                <td className="p-3">
                  <img src={p.image} className="w-14 h-14 rounded object-cover" />
                </td>
                <td className="p-3 text-black">{p.name}</td>
                <td className="p-3 text-black">${p.price}</td>

                <td className="p-3 flex gap-4">
                  <Link to={`/admin/edit/${p._id}`}>
                    <Pencil className="text-blue-500 cursor-pointer" />
                  </Link>
                  <Trash2
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleDelete(p._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="md:hidden flex flex-col gap-4 text-black">
        {products.map((p) => (
          <div
            key={p._id}
            className="bg-white shadow rounded p-4 flex gap-4 items-center "
          >
            <img
              src={p.image}
              className="w-20 h-20 rounded object-cover"
            />

            <div className="flex-1">
              <h2 className="font-semibold text-black">{p.name}</h2>
              <p className=" text-black">${p.price}</p>
            </div>

            <div className="flex flex-col gap-3">
              <a href={`/admin/products/edit/${p._id}`}>
                <Pencil className="text-blue-500 cursor-pointer" size={20} />
              </a>

              <Trash2
                className="text-red-500 cursor-pointer"
                size={20}
                onClick={() => handleDelete(p._id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
