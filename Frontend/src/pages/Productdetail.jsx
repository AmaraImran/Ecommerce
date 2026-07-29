import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../services/api";
import { AlertCircle } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/product/${id}`);
      setProduct(res.data.product);
    } catch (error) {
      console.log("Error fetching product:", error);
    }
  };

  const addToCart = async (productId) => {
    setError("");
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in to add items to your cart.");
      return;
    }

    try {
      await api.post(
        "/cart/addtocart",
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/cart");
    } catch (error) {
      console.log("Add to cart error:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Couldn't add this item to your cart.");
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (!product) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="min-h-screen bg-[#F7F1E6]">
      <div className="max-w-5xl mx-auto px-5 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* LEFT IMAGE */}
          <div className="w-full h-[420px] md:h-[480px] rounded-xl overflow-hidden shadow-lg bg-[#FFFDF8]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* RIGHT INFO */}
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-[#2B2420]">{product.name}</h1>

            <p className="mt-2 text-[#8A8070]">
              {product.category?.name || product.category}
            </p>

            <p className="mt-2 text-[#3F5B4E] font-semibold">
              {product.stock > 0 ? "In stock" : "Out of stock"}
            </p>

            <p className="mt-4 text-2xl font-bold text-[#2B2420]">${product.price}</p>

            <h3 className="mt-6 font-semibold text-lg text-[#2B2420]">Description</h3>
            <p className="text-[#5C5346] mt-1 leading-relaxed">
              {product.description}
            </p>

            {error && (
              <div className="mt-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                <p>
                  {error}{" "}
                  {error.includes("log in") && (
                    <Link to="/login" className="underline font-medium">
                      Go to Login
                    </Link>
                  )}
                </p>
              </div>
            )}

            <button
              disabled={product.stock <= 0}
              onClick={() => addToCart(product._id)}
              className={`w-full py-3 rounded-lg transition mt-6
                ${
                  product.stock > 0
                    ? "bg-[#3F5B4E] text-[#FBF7EE] hover:bg-[#2F4A3D]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;