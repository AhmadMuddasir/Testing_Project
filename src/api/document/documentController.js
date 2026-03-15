import express from "express";
import { config } from "../config/config.js";
import documentModel from "./documentModel.js";
import fs from "fs";
import createHttpError from "http-errors";
import cloudinary from "../config/cloudinary.js";

const uploadDocument = async (req, res, next) => {
  const { title, description, price } = req.body;
  const files = req.files;

  if (!title || !description || !price) {
    return next(createHttpError(400, "all field required"));
  }
  if (!files || !files.image || !files.pdf) {
    return next(createHttpError(400, "both image and pdf required"));
  }
  const imageFile = files.image[0];
  const pdfFile = files.pdf[0];
  try {
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      folder: "pdf-marketplace/documents",
      format: imageFile.mimetype.split("/")[1],
    });
    const pdfUpload = await cloudinary.uploader.upload(pdfFile.path, {
      resource_type: "raw",
      folder: "pdf-marketplace/documents",
      format: "pdf",
    });

    const newDocument = await documentModel.create({
      title,
      description,
      price: parseFloat(price),
      imageUrl: imageUpload.secure_url,
      pdfUrl: pdfUpload.secure_url,
      creator_id: req.userId,
    });

    fs.unlinkSync(imageFile.path);
    fs.unlink(pdfFile.path);

    res.status(201).json({
      message: "document uploded successfult",
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
    console.log(error);
    if (imageFile && fs.existsSync(imageFile.path)) {
      fs.unlinkSync(imageFile.path);
    }
    if (pdfFile && fs.existsSync(pdfFile.path)) {
      fs.unlinkSync(pdfFile.path);
    }

    return next(createHttpError(500, "Error uploading document"));
  }
};

const updateDocument = async (req, res, next) => {};

const deleteDocument = async (req, res, next) => {};
