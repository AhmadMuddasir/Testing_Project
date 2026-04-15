import express from "express";

const app = express();

import {
  createOrder,
  verifyPayment,
  getMyPurchases,
  CheckPurchase,
} from "./purchaseController.js";
import authenticate from "../middlewares/authentication.js";

const purchaseRouter = express.Router();

app.post("/create-order", authenticate, createOrder);

purchaseRouter.post("/verify", authenticate, verifyPayment);

purchaseRouter.get("my-purchase", authenticate, getMyPurchases);

purchaseRouter.get("/check/:documentId", authenticate, CheckPurchase);

export default purchaseRouter;
