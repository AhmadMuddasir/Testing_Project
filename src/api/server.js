import express from "express";
import cors from "cors";
import { config } from "./config/config.js";
import connectDB from "./config/db.js";
import userRouter from "./user/userRouter.js";
import documentRouter from "./document/documentRouter.js";
import purchaseRouter from "./purchase/purchaseRouter.js";

const app = express();

// Connect to Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRouter);
app.use("/api/documents", documentRouter);
app.use("/api/purchases",purchaseRouter);

// Test routes
app.get("/", (req, res) => {
  res.json({
    message: "PDF Marketplace API is running!",
    environment: config.env,
  });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({ message: "Internal server error" });
});

app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.originalUrl}`);
  next();
});

// Start server
app.listen(config.port, () => {
  console.log(`server running in ${config.port}`);
});
