import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Product from "./models/Product.js";

dotenv.config();

const app = express();

app.use(express.json());

// Create - POST
app.post("/api/products", async (req, res) => {
  const product = req.body;

  if (!product.name || !product.price || !product.image) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all fields" });
  }

  const newProduct = new Product(product);

  try {
    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error("Error in Creating product:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Read - GET
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log("Error in Get All Products:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Update - PUT
app.post("/api/products/:id", async (req, res) => {
  const { id } = req.params;

  const product = req.body;

  try {
    await Product.findByIdAndUpdate(id, product);
    res.status(200).json({ success: true, message: "Product Updated" });
  } catch (error) {
    console.error("Error in Updating product:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Delete - DELETE
app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Product Deleted" });
  } catch (error) {
    console.error("Error in Deleting product:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.listen(5000, () => {
  connectDB();
  console.log("Server is running on http://localhost:5000");
});
