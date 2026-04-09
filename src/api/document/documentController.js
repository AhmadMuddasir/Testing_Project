import express from "express";
import { config } from "../config/config.js";
import documentModel from "./documentModel.js";
import fs from "fs";
import createHttpError from "http-errors";
import cloudinary from "../config/cloudinary.js";

const uploadDocument = async (req, res, next) => {
  const { title, description, price } = req.body;
  const files = req.files;

  // Validation
  if (!title || !description || !price) {
    return next(
      createHttpError(400, "Title, description, and price are required"),
    );
  }

  if (!files || !files.image || !files.pdf) {
    return next(createHttpError(400, "Both image and PDF files are required"));
  }

  const imageFile = files.image[0];
  const pdfFile = files.pdf[0];

  try {
    // Upload image to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      folder: "pdf-marketplace/images",
      format: imageFile.mimetype.split("/")[1],
    });

    // Upload PDF to Cloudinary
    const pdfUpload = await cloudinary.uploader.upload(pdfFile.path, {
      resource_type: "raw",
      folder: "pdf-marketplace/documents",
      format: "pdf",
    });

    // Create document in database
    const newDocument = await documentModel.create({
      title,
      description,
      price: parseFloat(price),
      imageUrl: imageUpload.secure_url,
      pdfUrl: pdfUpload.secure_url,
      creator_id: req.userId, // From authenticate middleware
    });

    // Delete temporary files
    fs.unlinkSync(imageFile.path);
    fs.unlinkSync(pdfFile.path);

    res.status(201).json({
      message: "Document uploaded successfully",
      document: {
        id: newDocument._id,
        title: newDocument.title,
        description: newDocument.description,
        price: newDocument.price,
        imageUrl: newDocument.imageUrl,
        pdfUrl: newDocument.pdfUrl,
        creator_id: newDocument.creator_id,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);

    // Clean up files if upload fails
    if (imageFile && fs.existsSync(imageFile.path)) {
      fs.unlinkSync(imageFile.path);
    }
    if (pdfFile && fs.existsSync(pdfFile.path)) {
      fs.unlinkSync(pdfFile.path);
    }

    return next(createHttpError(500, "Error uploading document"));
  }
};

const getAllDocuments = async (req, res, next) => {
  try {
    // 1. Added .populate to get the name and email from the User model
    const allDocuments = await documentModel
      .find()
      .populate("creator_id", "name email");

    // 2. Map the data so the structure matches getDocumentById 
    // This ensures the frontend always sees "creator.name" instead of "creator_id.name"
    const formattedDocuments = allDocuments.map(doc => ({
      _id: doc._id,
      title: doc.title,
      description: doc.description,
      price: doc.price,
      imageUrl: doc.imageUrl,
      pdfUrl: doc.pdfUrl,
      creator: {
        id: doc.creator_id?._id,
        name: doc.creator_id?.name || "Unknown User",
        email: doc.creator_id?.email,
      },
      createdAt: doc.createdAt,
    }));

    res.status(200).json(formattedDocuments);
  } catch (error) {
    console.log(error);
    next(error); // Pass error to your error handler
  }
};

const updateDocument = async (req, res, next) => {
  const { id } = req.params;
  const { title, description, price } = req.body;
  const files = req.files;

  try {
    const document = await documentModel.findById(id);

    if (!document) {
      return next(createHttpError(404, "Document not found"));
    }

    if (document.creator_id.toString() !== req.userId) {
      return next(
        createHttpError(403, "You can only update your own documents"),
      );
    }

    if (title) document.title = title;
    if (description) document.description = description;
    if (price) document.price = parseFloat(price);

    if (files && files.image) {
      const imageFile = files.image[0];

      const oldImagePublicId = document.imageUrl
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0];
      await cloudinary.uploader.destroy(oldImagePublicId);

      const pdfUpload = await cloudinary.uploader.upload(imageFile.path, {
        folder: "pdf-marketplace/images",
        format: imageFile.mimetype.split("/")[1],
      });

      document.imageUrl = pdfUpload.secure_url;

      fs.unlinkSync(imageFile.path);
    }

    if (files && files.pdf) {
      const pdfFile = files.pdf[0];

      const oldPdfPublicId = document.pdfUrl
        .split("/")
        .slice(-2)
        .join("/")
        .replace(".pdf", "");
      await cloudinary.uploader.destroy(oldPdfPublicId, {
        resource_type: "raw",
      });

      // Upload new PDF
      const pdfUpload = await cloudinary.uploader.upload(pdfFile.path, {
        resource_type: "raw",
        folder: "pdf-marketplace/documents",
        format: "pdf",
      });

      document.pdfUrl = pdfUpload.secure_url;

      // Delete temp file
      fs.unlinkSync(pdfFile.path);
    }

    // Save updated document
    await document.save();

    res.status(200).json({
      message: "Document updated successfully",
      document: {
        id: document._id,
        title: document.title,
        description: document.description,
        price: document.price,
        imageUrl: document.imageUrl,
        pdfUrl: document.pdfUrl,
        creator_id: document.creator_id,
      },
    });
  } catch (error) {
    console.error("Update error:", error);

    // Clean up temp files if error occurs
    if (files && files.image && fs.existsSync(files.image[0].path)) {
      fs.unlinkSync(files.image[0].path);
    }
    if (files && files.pdf && fs.existsSync(files.pdf[0].path)) {
      fs.unlinkSync(files.pdf[0].path);
    }

    return next(createHttpError(500, "Error updating document"));
  }
};

const getDocumentById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const document = await documentModel
      .findById(id)
      .populate("creator_id", "name email");

    if (!document) {
      return next(createHttpError(404, "document not found"));
    }

    res.status(200).json({
      document: {
        id: document._id,
        title: document.title,
        description: document.description,
        price: document.price,
        imageUrl: document.imageUrl,
        pdfUrl: document.pdfUrl,
        creator: {
          id: document.creator_id._id,
          name: document.creator_id.name,
          email: document.creator_id.email,
        },
        review: document.review,
        createdAt: document.createdAt,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteDocument = async (req, res, next) => {
  const { id } = req.params;

  try {
    const document = await documentModel.findById(id);

    if (!document) {
      return next(createHttpError(404, "Document not found"));
    }

    // Check if logged-in user is the creator
    if (document.creator_id.toString() !== req.userId) {
      return next(
        createHttpError(403, "You can only delete your own documents"),
      );
    }

    // Extract public IDs from URLs for deletion
    const imagePublicId = document.imageUrl
      .split("/")
      .slice(-2)
      .join("/")
      .split(".")[0];
    const pdfPublicId = document.pdfUrl
      .split("/")
      .slice(-2)
      .join("/")
      .replace(".pdf", "");

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(imagePublicId);
    await cloudinary.uploader.destroy(pdfPublicId, { resource_type: "raw" });

    // Delete from database
    await documentModel.findByIdAndDelete(id);

    res.status(200).json({
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Delete document error:", error);
    return next(createHttpError(500, "Error deleting document"));
  }
};

export {
  uploadDocument,
  getAllDocuments,
  updateDocument,
  deleteDocument,
  getDocumentById,
};
