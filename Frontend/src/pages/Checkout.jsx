import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { AlertCircle, LogIn } from "lucide-react";

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [addressError, setAddressError] = useState("");
  const [orderError, setOrderError] = useState("");
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, []);

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
      setOrderError("Couldn't load your cart. Please try again.");
    }
  };

  const placeOrder = async () => {
    setAddressError("");
    setOrderError("");

    if (!address.trim()) {
      setAddressError("Please enter a shipping address before placing your order.");
      return;
    }

    setPlacing(true);
    try {
      // Step 1: create the order in your DB either way (COD or Safepay)
      const orderRes = await api.post(
        "/order/place-order",
        {
          shippingAddress: address,
          paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const orderId = orderRes.data.order?._id;
      if (!orderId) {
        throw new Error("The order was created without an ID.");
      }

      // Step 2: branch based on payment method
      if (paymentMethod === "COD") {
        navigate("/thankyou");
        return;
      }

      if (paymentMethod === "SAFEPAY") {
        // Ask YOUR backend to create the Safepay session and give back a checkout URL
        const paymentRes = await api.post(
          "/payment/checkout",
          { orderId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { checkoutUrl } = paymentRes.data;
        if (!checkoutUrl) {
          throw new Error("Safepay did not return a checkout URL.");
        }

        // Redirect the browser to Safepay's hosted checkout page
        window.location.href = checkoutUrl;
        return; // don't navigate to /thankyou — Safepay's redirectUrl handles that after payment
      }
    } catch (error) {
      setOrderError(
        error.response?.data?.message || "Something went wrong placing your order. Please try again."
      );
    } finally {
      setPlacing(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#EFE6D6] flex items-center justify-center px-6">
        <div className="bg-[#FFFDF8] border border-[#E3D8C4] rounded-2xl p-10 max-w-md w-full text-center shadow-sm">
          <LogIn className="mx-auto text-[#3F5B4E] mb-4" size={36} />
          <h2 className="text-xl font-bold text-[#2B2420] mb-2">
            Please log in to checkout
          </h2>
          <p className="text-[#5C5346] mb-6">
            You'll need to be signed in to review your cart and place an order.
          </p>
          <Link
            to="/login"
            className="inline-block bg-[#3F5B4E] text-[#FBF7EE] px-6 py-3 rounded-lg hover:bg-[#2F4A3D] transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (!cart) {
    return (
      <div className="min-h-screen bg-[#EFE6D6] flex items-center justify-center">
        <p className="text-[#5C5346]">Loading...</p>
      </div>
    );
  }

  const total = cart.items.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-[#EFE6D6]">
      <div className="max-w-5xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8 text-[#2B2420]">Checkout</h1>

        {orderError && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
            <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
            <p className="text-sm">{orderError}</p>
          </div>
        )}

        {/* ORDER SUMMARY */}
        <div className="bg-[#FFFDF8] border border-[#E3D8C4] rounded-lg p-5 mb-6">
          {cart.items.map((item) => (
            <div key={item._id} className="flex justify-between mb-3 text-[#2B2420]">
              <span>
                {item.productId.name} × {item.quantity}
              </span>
              <span>${item.productId.price * item.quantity}</span>
            </div>
          ))}
          <hr className="border-[#E3D8C4]" />
          <div className="flex justify-between font-bold mt-3 text-[#2B2420]">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>

        {/* SHIPPING */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold text-[#2B2420]">
            Shipping Address
          </label>
          <textarea
            className={`w-full border p-3 rounded bg-[#FFFDF8] text-[#2B2420] focus:outline-none focus:ring-2 focus:ring-[#3F5B4E] ${
              addressError ? "border-red-400" : "border-[#E3D8C4]"
            }`}
            rows="3"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              if (addressError) setAddressError("");
            }}
            placeholder="House number, street, city, postal code"
          />
          {addressError && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} />
              {addressError}
            </p>
          )}
        </div>

        {/* PAYMENT */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold text-[#2B2420]">
            Payment Method
          </label>

          <div className="space-y-2 text-[#2B2420]">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
              />
              Cash on Delivery
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={paymentMethod === "SAFEPAY"}
                onChange={() => setPaymentMethod("SAFEPAY")}
              />
              Pay with Card (Safepay)
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
          disabled={placing}
          className="w-full bg-[#3F5B4E] text-[#FBF7EE] py-3 rounded-lg hover:bg-[#2F4A3D] transition disabled:opacity-50"
        >
          {placing
            ? "Processing..."
            : paymentMethod === "SAFEPAY"
            ? "Proceed to Payment"
            : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default Checkout;