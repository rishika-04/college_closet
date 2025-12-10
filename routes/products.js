import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import { upload } from "../middlewares/multerConfig.js";

import Product from '../models/product.js';



import User from '../models/user.js';

const router = express.Router();
console.log("Product model loaded:", Product);


// ----------------------------------------------------
// Upload Product
// ----------------------------------------------------
router.post('/uploadProduct', upload.single('image_url'), async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(400).json({ 
        modal: "auth-modal",
        message: "You must be logged in to upload a product." 
      });
    }

    const uploaderId = req.session.user._id;

    const { category, product_name, model_name, age_in_years, description, price } = req.body;

    // -----------------------------
    //  VALIDATION FOR EMPTY FIELDS
    // -----------------------------
    if (!category || !product_name || !model_name || !age_in_years ||  !price) {
      return res.status(400).json({
        modal: "incompleteProductModal",
        message: "Please fill all required fields."
      });
    }

    // Create product
    const newProduct = new Product({
      uploader_id: uploaderId,
      category,
      product_name,
      model_name,
      age_in_years,
      description,
      price,
      status: "available",
      image_url: req.file ? "/uploads/" + req.file.filename : "/images/default_item.jpg",
      created_at: new Date(),
      updated_at: new Date()
    });

    await newProduct.save();

    return res.redirect('/');

  } catch (err) {
    console.error("Upload Product Error:", err);

    return res.status(500).json({
      modal: "incompleteProductModal",
      message: "Error uploading product. Ensure all fields are filled."
    });
  }
});



export default router;
