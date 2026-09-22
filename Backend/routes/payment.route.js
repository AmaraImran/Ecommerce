import { Router } from "express";
import express from "express";
import {
  createSafepayCheckout,
  handleSafepayWebhook,
} from "../controllers/payment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const paymentRouter = Router();

paymentRouter.post(
  "/payment/checkout",
  express.json(),
  verifyJWT,
  createSafepayCheckout
);

paymentRouter.post(
  "/webhooks/safepay",
  express.raw({ type: "application/json" }),
  handleSafepayWebhook
);

export default paymentRouter;