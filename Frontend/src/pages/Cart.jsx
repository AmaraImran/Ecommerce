import { useEffect, useState } from "react";
import api from "../services/api";
import { Trash2, AlertTriangle, ShoppingBag } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCart(res.data);
    } catch (error) {
      console.log("Error fetching cart:", error);
    }
  };

  const updateQuantity = async (productId, quantity, stock) => {
    if (quantity < 1) return;

    if (quantity > stock) {
      setError(`Only ${stock} left in stock`);
      return;
    }

    setError("");
    try {
      await api.patch(
        "/cart/update-quantity",
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchCart();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't update quantity.");
    }
  };

  const removeItem = async (productId) => {
    try {
      await api.delete("/cart/removefromcart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { productId },
      });
      fetchCart();
    } catch (error) {
      console.log("Remove error:", error);
    }
  };

  const removeUnavailableItem = async (itemId) => {
    try {
      await api.delete("/cart/removefromcart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { itemId },
      });
      fetchCart();
    } catch (error) {
      console.log("Remove error:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5EFE2] flex items-center justify-center px-6">
        <div className="bg-[#FFFDF8] border border-[#E3D8C4] rounded-2xl p-12 text-center shadow-sm max-w-md">
          <ShoppingBag className="mx-auto text-[#C9BEA8] mb-4" size={48} />
          <p className="text-[#8A8070] mb-4">Your cart is empty</p>
          <Link
            to="/product"
            className="inline-block bg-[#3F5B4E] text-[#FBF7EE] px-6 py-3 rounded-lg hover:bg-[#2F4A3D] transition"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const validItems = cart.items.filter((item) => item.productId);
  const unavailableItems = cart.items.filter((item) => !item.productId);

  const total = validItems.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-[#F5EFE2]">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT - CART ITEMS */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-[#2B2420] mb-6">Cart</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Unavailable items — product was deleted */}
            {unavailableItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between bg-red-50 border border-red-200 rounded-2xl p-5"
              >
                <div className="flex gap-3 items-center text-red-600">
                  <AlertTriangle size={20} />
                  <span className="text-sm">
                    This item is no longer available and was removed from sale.
                  </span>
                </div>
                <button
                  onClick={() => removeUnavailableItem(item._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}

            {validItems.map((item) => {
              const stock = item.productId.stock ?? Infinity;
              const atMaxStock = item.quantity >= stock;

              return (
                <div
                  key={item.productId._id}
                  className="flex items-center justify-between bg-[#FFFDF8] border border-[#E3D8C4] rounded-2xl p-5 shadow-sm"
                >
                  {/* Product */}
                  <div className="flex gap-4 items-center">
                    <img
                      src={item.productId.image}
                      alt={item.productId.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />

                    <div>
                      <h3 className="font-semibold text-[#2B2420]">
                        {item.productId.name}
                      </h3>
                      <p className="text-[#8A8070]">${item.productId.price}</p>
                      {atMaxStock && (
                        <p className="text-xs text-red-500 mt-1">
                          Max stock reached
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-3 border border-[#E3D8C4] rounded-lg px-3 py-1 bg-[#F5EFE2]">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId._id, item.quantity - 1, stock)
                      }
                      className="text-lg text-[#2B2420]"
                    >
                      −
                    </button>

                    <span className="text-[#2B2420]">{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(item.productId._id, item.quantity + 1, stock)
                      }
                      disabled={atMaxStock}
                      className={`text-lg text-[#2B2420] ${
                        atMaxStock ? "opacity-30 cursor-not-allowed" : ""
                      }`}
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <p className="font-semibold text-[#2B2420]">
                    ${item.productId.price * item.quantity}
                  </p>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.productId._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT - SUMMARY */}
        <div className="bg-[#FFFDF8] border border-[#E3D8C4] rounded-2xl p-6 h-fit shadow-sm">
          <h2 className="text-xl font-semibold text-[#2B2420] mb-4">Summary</h2>

          <div className="flex justify-between mb-2 text-[#8A8070]">
            <span>Delivery Charge</span>
            <span>$0</span>
          </div>

          <div className="flex justify-between font-bold text-lg border-t border-[#E3D8C4] pt-4 text-[#2B2420]">
            <span>Grand Total</span>
            <span>${total}</span>
          </div>

          <button
            className="w-full bg-[#3F5B4E] text-[#FBF7EE] py-3 rounded-lg mt-6 hover:bg-[#2F4A3D] transition"
            onClick={() => navigate("/checkout")}
          >
            Proceed to checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;