import { Safepay } from "@sfpy/node-sdk";
import Cart from "../models/cartmodel.js";
import Order from "../models/ordermodel.js";
import mongoose from "mongoose";

const safepay = new Safepay({
  environment: process.env.SAFEPAY_ENVIRONMENT, 
  apiKey: process.env.SAFEPAY_API_KEY,
  v1Secret: process.env.SAFEPAY_V1_SECRET,
  webhookSecret: process.env.SAFEPAY_WEBHOOK_SECRET,
});
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

export const createSafepayCheckout = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId || !mongoose.isValidObjectId(orderId)) {
      return res.status(400).json({ message: "A valid order ID is required" });
    }

    if (!process.env.SAFEPAY_API_KEY || !process.env.SAFEPAY_ENVIRONMENT) {
      return res.status(500).json({ message: "Safepay is not configured on the server" });
    }

    const order = await Order.findOne({ _id: orderId, userId: req.user.id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.paymentMethod !== "SAFEPAY") {
      return res.status(400).json({ message: "This order is not a Safepay order" });
    }

    const { token } = await safepay.payments.create({
      amount: order.totalAmount,
      currency: "PKR",
    });

    const checkoutUrl = safepay.checkout.create({
      token,
      orderId: order._id.toString(),
      cancelUrl: `${frontendUrl}/checkout`,
      redirectUrl: `${frontendUrl}/thankyou`,
      source: "custom",
      webhooks: true,
    });

    res.status(200).json({ success: true, checkoutUrl });
  } catch (error) {
    const providerError = error.response?.data?.message || error.response?.data?.error;
    console.error("Safepay checkout error:", error.response?.data || error.message);
    res.status(502).json({
      message:
        process.env.NODE_ENV === "production"
          ? "Unable to start Safepay checkout"
          : providerError || error.message || "Unable to start Safepay checkout",
    });
  }
};

export const handleSafepayWebhook = async (req, res) => {
  try {
    const isValid = await safepay.verify.webhook(req);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = JSON.parse(req.body.toString());
    const orderId = event.data?.orderId;
    const status = event.type;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.paymentStatus === 'Paid') {
      return res.status(200).json({ message: 'Already processed' });
    }

    if (status === 'payment.succeeded' || status === 'tracker.completed') {
      order.paymentStatus = 'Paid';
      await order.save();
      await Cart.findOneAndUpdate({ userId: order.userId }, { items: [] });
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};