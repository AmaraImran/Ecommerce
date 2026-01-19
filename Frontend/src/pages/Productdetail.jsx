import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/product/${id}`);
      setProduct(res.data.product);
    } catch (error) {
      console.log("Error fetching product:", error);
    }
  };
const addToCart = async (productId) => {
  console.log("Adding to cart:", productId);
  try {
    await api.post(
      "/cart/addtocart",
      { productId },
      {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    alert("Added to cart");
        
    navigate("/cart");
  } catch (error) {
    console.log("Add to cart error:", error.response?.data || error.message);
  }
};


  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (!product) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* LEFT IMAGE */}
     <div className="flex justify-center items-center">
  <img
    src={product.image}
    alt={product.name}
    className="w-full max-w-sm md:max-w-md rounded-lg shadow-lg object-cover"
  />
</div>


        {/* RIGHT INFO */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <p className="mt-2 text-gray-600">{product.category}</p>

          <p className="mt-2 text-green-600 font-semibold">
            {product.stock > 0 ? "In stock" : "Out of stock"}
          </p>

          <p className="mt-4 text-2xl font-bold">${product.price}</p>

          <h3 className="mt-6 font-semibold text-lg">Description</h3>
          <p className="text-gray-700 mt-1 leading-relaxed">
            {product.description}
          </p>

          {/* ADD TO CART */}
 <button
  disabled={product.stock <= 0}
  onClick={() => addToCart(product._id)}
  className={`w-full py-3 rounded-lg transition
    ${
      product.stock > 0
        ? "bg-black text-white hover:bg-gray-800"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }`}
>
  {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
</button>


        </div>

      </div>
    </div>
  );
};

export default ProductDetail;
