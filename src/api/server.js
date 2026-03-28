import express from "express";
import cors from "cors";
import { config } from "./config/config.js";
import connectDB from "./config/db.js";
import userRouter from "./user/userRouter.js";
import documentRouter from "./document/documentRouter.js";

const app = express();

// Connect to Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRouter);
app.use("/api/documents", documentRouter);

// Test routes
app.get("/", (req, res) => {
  res.json({
    message: "PDF Marketplace API is running!",
    environment: config.env,
  });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
app.listen(config.port, () => {
  console.log(`server running in ${config.port}`);
});
