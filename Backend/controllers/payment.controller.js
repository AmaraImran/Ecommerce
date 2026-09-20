import { Safepay } from "@sfpy/node-sdk";
import Order from "../models/ordermodel.js";

const safepay = new Safepay({
  environment: process.env.SAFEPAY_ENVIRONMENT, 
  apiKey: process.env.SAFEPAY_API_KEY,
  v1Secret: process.env.SAFEPAY_V1_SECRET,
  webhookSecret: process.env.SAFEPAY_WEBHOOK_SECRET,
});

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
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};