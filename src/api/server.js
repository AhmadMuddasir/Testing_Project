import express from "express";
import cors from "cors";
import { config } from "./config/config.js";
import connectDB from "./config/db.js";

const app = express();

// Connect to Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test routes
app.get("/", (req, res) => {
  res.json({
    message: "PDF Marketplace API is running!",
    timestamp: new Date().toISOString(),
    environment: config.env,
  });
});




// Start server
app.listen(config.port, () => {
  console.log(`server running in${config.port}`);
});
