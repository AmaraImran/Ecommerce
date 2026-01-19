import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ThankYou = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border rounded-2xl shadow-sm p-8 text-center">

        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />

        <h1 className="text-2xl font-bold mb-2">
          Thank you for shopping with us!
        </h1>

        <p className="text-gray-600 mb-6">
          Your order has been placed successfully.
          <br />
          You will receive a confirmation email shortly.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/products")}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Continue Shopping
          </button>

          <button
            onClick={() => navigate("/orders")}
            className="w-full border border-black text-black py-3 rounded-lg hover:bg-gray-100 transition"
          >
            View My Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
