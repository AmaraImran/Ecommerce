import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { ArrowLeft } from "lucide-react";

function Category() {
  const { name: categoryId } = useParams(); // route param is named :name, but we're passing the category's _id
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const limit = 9;

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await api.get(`/category/${categoryId}`);
        setCategory(res.data.category);
      } catch (err) {
        console.error("Error fetching category:", err);
      }
    };
    fetchCategory();
  }, [categoryId]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get("/product/", {
          params: { category: categoryId, sort, page, limit },
        });
        setProducts(res.data.products || []);
        setTotal(res.data.totalCount || 0);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId, sort, page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-[#F5EFE2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-10">

        <Link
          to="/product"
          className="flex items-center gap-2 text-[#8A8070] hover:text-[#2B2420] mb-6 transition w-fit"
        >
          <ArrowLeft size={18} />
          All Products
        </Link>

        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-[#2B2420]">
            {category?.name || "Category"}
          </h1>

          <div className="flex items-center gap-2 text-sm text-[#2B2420]">
            <label className="text-[#8A8070]">Sort:</label>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="border border-[#E3D8C4] bg-[#FFFDF8] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#3F5B4E]"
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-[#8A8070]">Loading products...</p>
        ) : products.length === 0 ? (
          <div className="bg-[#FFFDF8] border border-[#E3D8C4] rounded-2xl p-12 text-center">
            <p className="text-[#8A8070] mb-4">No products in this category yet.</p>
            <Link
              to="/product"
              className="inline-block bg-[#3F5B4E] text-[#FBF7EE] px-6 py-3 rounded-lg hover:bg-[#2F4A3D] transition"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <>
            <p className="text-[#8A8070] text-sm mb-4">
              Showing {((page - 1) * limit) + 1} – {Math.min(page * limit, total)} of {total} products
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {products.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="group block bg-[#FFFDF8] rounded-2xl border border-[#E3D8C4] overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative overflow-hidden bg-[#F5EFE2]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 right-3 bg-[#6B7A4F] text-[#FBF7EE] text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                      ${product.price}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-[#2B2420] group-hover:text-[#6B7A4F] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-[#8A8070] text-sm mt-1 line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10 gap-3">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 border border-[#E3D8C4] rounded text-[#2B2420] disabled:opacity-40"
                >
                  Prev
                </button>
                <span className="px-4 py-2 text-[#2B2420]">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 border border-[#E3D8C4] rounded text-[#2B2420] disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Category;