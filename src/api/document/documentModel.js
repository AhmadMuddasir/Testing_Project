import { config } from "../config/config.js";
import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
      trim: true,
    },
    description: {
      type: String,
      require: true,
    },
    creator_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      require: true,
      trim: true,
    },
    pdfUrl: {
      type: String,
      require: true,
      trim: true,
    },
    review: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true },
);

export default mongoose.model("Book", documentSchema);
