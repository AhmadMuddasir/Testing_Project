import Razorpay from "razorpay";
import { config } from "./config.js";

const razorpayInstance = new Razorpay({
     key_id:config.razorpay_api,
     key_secret:config.razorpay_secret
})

export default razorpayInstance;