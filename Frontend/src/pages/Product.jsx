import { useEffect, useState } from "react";
import api from "../services/api"; // axios instance
import { Link } from "react-router-dom";
export default function Shop() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);

  // Filters
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("latest");

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 9;

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
console.log(res.data);
      setProducts(res.data.products);
      setTotal(res.data.totalCount);

    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="w-full flex gap-10 px-10 py-10">

      {/* LEFT SIDEBAR */}
      <aside className="w-64">
        <h2 className="text-lg font-semibold mb-4">Product Categories</h2>
        <div className="space-y-2">
          {["tech", "Unstitched", "Shirt", "Accessories", "Laptops", "Phones"].map(cat => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={category === cat.toLowerCase()}
                onChange={() => setCategory(cat.toLowerCase())}
              />
              {cat}
            </label>
          ))}

          {/* Reset Category */}
          <button
            onClick={() => setCategory("")}
            className="text-sm underline text-gray-600"
          >
            Clear
          </button>
        </div>

        <h2 className="text-lg font-semibold mt-8 mb-4">Sort By</h2>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="sort"
              checked={sort === "latest"}
              onChange={() => setSort("latest")}
            />
            Latest
          </label>

          <label className="flex items-center gap-2">
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
      <main className="flex-1">
        <div className="text-gray-700 text-sm mb-4">
          Showing {((page - 1) * limit) + 1} – {Math.min(page * limit, total)} of {total} products
        </div>

        {/* PRODUCTS GRID */}
        {/* PRODUCTS GRID */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
  {products.map(product => (
    <Link
      key={product._id}
      to={`/product/${product._id}`}
      className="cursor-pointer block"
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-60 object-cover bg-gray-100 rounded-lg"
      />

      <h3 className="mt-3 font-semibold text-lg">{product.name}</h3>

      <p className="text-gray-600 text-sm line-clamp-2">
        {product.description}
      </p>

      <p className="font-semibold mt-1">${product.price}</p>
    </Link>
  ))}
</div>


        {/* PAGINATION */}
        <div className="flex justify-center mt-10 gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 border rounded disabled:opacity-40"
          >
            Prev
          </button>

          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}
