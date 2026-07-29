import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ThankYou = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-[#F7F1E6]">
      <div className="max-w-md w-full bg-[#FFFDF8] border border-[#E3D8C4] rounded-2xl shadow-sm p-8 text-center">

        <CheckCircle className="w-16 h-16 text-[#3F5B4E] mx-auto mb-4" />

        <h1 className="text-2xl font-bold mb-2 text-[#2B2420]">
          Thank you for shopping with us!
        </h1>

        <p className="text-[#8A8070] mb-6">
          Your order has been placed successfully.
          <br />
          You will receive a confirmation email shortly.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/product")}
            className="w-full bg-[#3F5B4E] text-[#FBF7EE] py-3 rounded-lg hover:bg-[#2F4A3D] transition"
          >
            Continue Shopping
          </button>

          <button
            onClick={() => navigate("/order")}
            className="w-full border border-[#3F5B4E] text-[#3F5B4E] py-3 rounded-lg hover:bg-[#3F5B4E] hover:text-[#FBF7EE] transition"
          >
            View My Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;