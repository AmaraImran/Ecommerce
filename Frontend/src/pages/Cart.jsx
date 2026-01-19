import { useEffect, useState } from "react";
import api from "../services/api";
import { Trash2 } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState(null);
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

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

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
  };

 const removeItem = async (productId) => {
  try {
    await api.delete("/cart/removefromcart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { productId },   // ✅ body goes here
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
    return <p className="text-center mt-20 text-lg">Your cart is empty</p>;
  }

  const total = cart.items.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
      
      {/* LEFT - CART ITEMS */}
      <div className="lg:col-span-2">
        <h1 className="text-3xl font-bold mb-6">Cart</h1>

        <div className="space-y-6">
          {cart.items.map((item) => (
            <div
              key={item.productId._id}
              className="flex items-center justify-between border-b pb-6"
            >
              {/* Product */}
              <div className="flex gap-4 items-center">
                <img
                  src={item.productId.image}
                  alt={item.productId.name}
                  className="w-24 h-24 object-cover rounded"
                />

                <div>
                  <h3 className="font-semibold">
                    {item.productId.name}
                  </h3>
                  <p className="text-gray-600">
                    ${item.productId.price}
                  </p>
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3 border rounded px-3 py-1">
                <button
                  onClick={() =>
                    updateQuantity(item.productId._id, item.quantity - 1)
                  }
                  className="text-lg"
                >
                  −
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() =>
                    updateQuantity(item.productId._id, item.quantity + 1)
                  }
                  className="text-lg"
                >
                  +
                </button>
              </div>

              {/* Subtotal */}
              <p className="font-semibold">
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
          ))}
        </div>
      </div>

      {/* RIGHT - SUMMARY */}
      <div className="border rounded-lg p-6 h-fit">
        <h2 className="text-xl font-semibold mb-4">Summary</h2>

        <div className="flex justify-between mb-2 text-gray-600">
          <span>Delivery Charge</span>
          <span>$0</span>
        </div>

        <div className="flex justify-between font-bold text-lg border-t pt-4">
          <span>Grand Total</span>
          <span>${total}</span>
        </div>

        <button className="w-full bg-black text-white py-3 rounded-lg mt-6 hover:bg-gray-800" onClick={() => navigate("/checkout")}>
          Proceed to checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
