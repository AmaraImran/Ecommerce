import { useEffect, useState } from "react";
import api from "../services/api"; // axios instance
import { Link } from "react-router-dom";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);

  // Filters
  const [category, setCategory] = useState(""); // will hold category _id now
  const [sort, setSort] = useState("latest");

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 9;

  // Fetch categories once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/category/all-categories");
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [category, sort, page]);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/product/", {
        params: {
          page,
          limit,
          category,
          sort,
        },
      });
      setProducts(res.data.products);
      setTotal(res.data.totalCount);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="w-full flex flex-col md:flex-row gap-8 md:gap-10 px-4 sm:px-6 md:px-10 py-10 bg-[#F5EFE2]">
      {/* SIDEBAR — full width on mobile (stacks above content), fixed width on desktop */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <h2 className="text-lg font-semibold mb-4 text-[#2B2420]">
          Product Categories
        </h2>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label
              key={cat._id}
              className="flex items-center gap-2 cursor-pointer text-[#2B2420]"
            >
              <input
                type="radio"
                name="category"
                checked={category === cat._id}
                onChange={() => {
                  setCategory(cat._id);
                  setPage(1);
                }}
              />
              {cat.name}
            </label>
          ))}

          <button
            onClick={() => {
              setCategory("");
              setPage(1);
            }}
            className="text-sm underline text-[#8A8070]"
          >
            Clear
          </button>
        </div>

        <h2 className="text-lg font-semibold mt-8 mb-4 text-[#2B2420]">
          Sort By
        </h2>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[#2B2420]">
            <input
              type="radio"
              name="sort"
              checked={sort === "latest"}
              onChange={() => setSort("latest")}
            />
            Latest
          </label>

          <label className="flex items-center gap-2 text-[#2B2420]">
            <input
              type="radio"
              name="sort"
              checked={sort === "oldest"}
              onChange={() => setSort("oldest")}
            />
            Oldest
          </label>
        </div>
      </aside>

      {/* RIGHT CONTENT */}
      <main className="flex-1 min-w-0">
        <div className="text-[#8A8070] text-sm mb-4">
          Showing {((page - 1) * limit) + 1} – {Math.min(page * limit, total)} of {total} products
        </div>

        {/* PRODUCTS GRID */}
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
      </main>
    </div>
  );
}