import { Router } from "express";
import express from "express";
import { handleSafepayWebhook } from "../controllers/payment.controller.js";

const paymentRouter = Router();

paymentRouter.post(
  "/webhooks/safepay",
  express.raw({ type: "application/json" }),
  handleSafepayWebhook
);

export default paymentRouter;