import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import HeroSection from "../components/Herosection";
import { Home as HomeIcon, Leaf, BookOpen, Coffee, Package } from "lucide-react";

// maps known category names to an icon (falls back to Package for anything unrecognized)
const categoryIcons = {
  "Home Decor": HomeIcon,
  "Plants & Planters": Leaf,
  "Stationery & Journals": BookOpen,
  "Ceramics & Tableware": Coffee,
};

function CategoryShowcase() {
  const [categories, setCategories] = useState([]);

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

  if (categories.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-[#2B2420] mb-8 text-center">
        Shop by Category
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {categories.map((cat) => {
          const Icon = categoryIcons[cat.name] || Package;
          return (
            <Link
              key={cat._id}
              to={`/category/${cat._id}`}
              className="group bg-[#FFFDF8] border border-[#E3D8C4] rounded-2xl p-6 flex flex-col items-center text-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="bg-[#F5EFE2] group-hover:bg-[#3F5B4E] w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-300">
                <Icon className="text-[#3F5B4E] group-hover:text-[#FBF7EE] transition-colors duration-300" size={26} />
              </div>
              <p className="font-medium text-[#2B2420] text-sm md:text-base">
                {cat.name}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get("/product/", {
          params: { page: 1, limit: 8, sort: "latest" },
        });
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("Error fetching featured products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-[#2B2420]">
          New Arrivals
        </h2>
        <Link
          to="/product"
          className="text-[#3F5B4E] font-medium hover:underline text-sm md:text-base"
        >
          View All →
        </Link>
      </div>

      {loading ? (
        <p className="text-[#8A8070]">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-[#8A8070]">No products yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
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
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 bg-[#6B7A4F] text-[#FBF7EE] text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                  ${product.price}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-[#2B2420] group-hover:text-[#6B7A4F] transition-colors">
                  {product.name}
                </h3>
                <p className="text-[#8A8070] text-sm mt-1 line-clamp-2">
                  {product.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function Home() {
  return (
    <div className="bg-[#F7F1E6]">
      <HeroSection />
      <CategoryShowcase />
      <FeaturedProducts />
    </div>
  );
}

export default Home;