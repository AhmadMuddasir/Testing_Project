import createHttpError from "http-errors";
import crypto from "crypto"
import purchaseModel from "./purchaseModel.js";
import razorpayInstance from "../config/razorpay.js";
import { config } from "../config/config.js";
import next from "next";

const createOrder = async (req, res, next) => {
  const { documentId } = req.body;

  try {
    // Get document details
    const document = await documentModel.findById(documentId);

    if (!document) {
      return next(createHttpError(404, "Document not found"));
    }

    // Check if user is trying to buy their own document
    if (document.creator_id.toString() === req.userId) {
      return next(createHttpError(400, "You cannot buy your own document"));
    }

    // Check if already purchased
    const existingPurchase = await purchaseModel.findOne({
      buyer_id: req.userId,
      document_id: documentId,
      status: "success",
    });

    if (existingPurchase) {
      return next(createHttpError(400, "You have already purchased this document"));
    }

    // Create Razorpay order
    const options = {
      amount: document.price * 100, // Amount in paise (₹299 = 29900 paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    // Save purchase record in database
    const purchase = await purchaseModel.create({
      buyer_id: req.userId,
      document_id: documentId,
      amount: document.price,
      razorpay_order_id: razorpayOrder.id,
      status: "pending",
    });

    res.status(200).json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      purchaseId: purchase._id,
      documentTitle: document.title,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return next(createHttpError(500, "Failed to create order"));
  }
};

const verifyPayment = async(req,res,next) => {
  const {razorpay_order_id,razorpay_payment_id,razorpay_signature} = req.body;

  try {
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto.createHmac("sha256",config.razorpay_secret)
    .update(sign.toString()).digest("hex");

    if(razorpay_signature !== expectedSign){
      return next(createHttpError(400,"Invalid payment signature"));
    }

    const purchase = await purchaseModel.findOneAndUpdate(
      {razorpay_order_id},
      {
        razorpay_payment_id,
        razorpay_signature,
        status:"success"
      },
      {new:true}
    ).populate("document_id","title pdfUrl");

    res.status(200).json({
      message:"payment verified successfully",
      purchase:{
        id:purchase._id,
        documentTitle:purchase.document_id.title,
        pdfUrl:purchase.document_id.pdfUrl,
        amount:purchase.amount,
      },
    })

  } catch (error) {
    console.error("Verify payment error:", error);
    return next(createHttpError(500, "Failed to verify payment"));
  }

}

const getMyPurchases = async (req,res,next) =>{
  try {
    const purchases = await purchaseModel
    .find({buyer_id:req.userId,status:"success"})
    .populate("document_id","title description imageUrl pdfUrl price")
    .sort({ createdAt: -1 }).lean();

    res.status(200).json({
      count:purchases.length,
      purchases:purchases.map((p)=>({
        id:p.id,
        document: {
          id: p.document_id._id,
          title: p.document_id.title,
          description: p.document_id.description,
          imageUrl: p.document_id.imageUrl,
          pdfUrl: p.document_id.pdfUrl,
          price: p.document_id.price,
        },
        amount:p.amount,
        purchasedAt:p.createdAt,
      }))

    })

  } catch (error) {
    console.error("Get purchases error:", error);
    return next(createHttpError(500, "Failed to fetch purchases"));
  }
}

const CheckPurchase = async (req,res,next) =>{
    const { documentId } = req.params;

    try {
      const purchase = await purchaseModel.findOne({
      buyer_id: req.userId,
      document_id: documentId,
      status: "success",
    });
      res.status(200).json({
      hasPurchased: !!purchase,
    });
    } catch (error) {
      console.error("Check purchase error:", error);
    return next(createHttpError(500, "Failed to check purchase"));
    }
}

export {createOrder,verifyPayment,getMyPurchases,CheckPurchase};