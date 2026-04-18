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

purchaseRouter.post("/create-order", authenticate, createOrder);

purchaseRouter.post("/verify", authenticate, verifyPayment);

purchaseRouter.get("/my-purchases", authenticate, getMyPurchases);

purchaseRouter.get("/check/:documentId", authenticate, CheckPurchase);

export default purchaseRouter;
