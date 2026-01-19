import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const res = await api.get("/cart", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setCart(res.data);
  };

  const placeOrder = async () => {
    if (!address) return alert("Enter shipping address");

    await api.post(
      "/order/place-order",
      {
        shippingAddress: address,
        paymentMethod,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    alert("Order placed successfully");
    navigate("/thankyou");
  };

  if (!cart) return <p>Loading...</p>;

  const total = cart.items.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  );

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* ORDER SUMMARY */}
      <div className="border rounded-lg p-5 mb-6">
        {cart.items.map((item) => (
          <div key={item._id} className="flex justify-between mb-3">
            <span>
              {item.productId.name} × {item.quantity}
            </span>
            <span>
              ${item.productId.price * item.quantity}
            </span>
          </div>
        ))}
        <hr />
        <div className="flex justify-between font-bold mt-3">
          <span>Total</span>
          <span>${total}</span>
        </div>
      </div>

      {/* SHIPPING */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold">Shipping Address</label>
        <textarea
          className="w-full border p-3 rounded"
          rows="3"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      {/* PAYMENT */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold">Payment Method</label>

        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
            />
            Cash on Delivery
          </label>

          <label className="flex items-center gap-2 opacity-50">
            <input type="radio" disabled />
            JazzCash (Coming Soon)
          </label>

          <label className="flex items-center gap-2 opacity-50">
            <input type="radio" disabled />
            EasyPaisa (Coming Soon)
          </label>
        </div>
      </div>

      {/* BUTTON */}
      <button
        onClick={placeOrder}
        className="w-full bg-black text-white py-3 rounded hover:bg-gray-800"
      >
        Place Order
      </button>
    </div>
  );
};

export default Checkout;
