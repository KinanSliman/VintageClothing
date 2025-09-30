import express from "express";
import { getProductsCollection } from "../connectDB.js";
import { ObjectId } from "mongodb";
import { body, validationResult } from "express-validator";
import { isAdmin } from "../../Middleware/isAdmin.js";
import cloudinary from "../cloudinaryConfig.js";
import upload from "../../Middleware/multer.js";

const productsRouter = express.Router();

function uploadToCloudinary(fileBuffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
}

// Get all products
productsRouter.get("/getAllProducts", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const searchQuery = req.query.search?.toLowerCase() || "";
  const minPrice = parseFloat(req.query.minPrice) || 0;
  const maxPrice = parseFloat(req.query.maxPrice) || Infinity;

  const category = req.query.category || "";
  const size = req.query.size ? req.query.size.split(",") : [];
  const color = req.query.color ? req.query.color.split(",") : [];
  const fit = req.query.fit || "";

  // Calculate date two weeks ago
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  // ✅ Base filter (always price)
  let searchFilter = {
    price: { $gte: minPrice, $lte: maxPrice },
  };

  // ✅ New arrivals (2 weeks)
  if (category.toLowerCase() === "new arrivals") {
    searchFilter.createdAt = { $gte: twoWeeksAgo };
  }

  // ✅ Category filter (case-insensitive regex)
  if (category && category.toLowerCase() !== "new arrivals") {
    searchFilter.category = { $regex: new RegExp(`^${category}$`, "i") };
  }

  // ✅ Size filter (case-insensitive)
  if (size.length > 0) {
    searchFilter.size = { $in: size.map((s) => new RegExp(`^${s}$`, "i")) };
  }

  // ✅ Color filter (case-insensitive)
  if (color.length > 0) {
    searchFilter.color = { $in: color.map((c) => new RegExp(`^${c}$`, "i")) };
  }

  // ✅ Fit filter (case-insensitive regex)
  if (fit) {
    searchFilter.fit = { $regex: new RegExp(`^${fit}$`, "i") };
  }

  const products = getProductsCollection();

  try {
    const totalProducts = await products.countDocuments(searchFilter);

    const fetchedProducts = await products
      .find(searchFilter)
      .skip(skip)
      .limit(limit)
      .toArray();

    res.json({
      fetchedProducts,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: "Server encountered an error", error });
  }
});
// Get max price
// ============================
productsRouter.get("/maxPrice", async (req, res) => {
  console.log("/maxPrice route triggered");
  const products = getProductsCollection();
  try {
    const maxPriceProduct = await products
      .find()
      .sort({ price: -1 })
      .limit(1)
      .toArray();

    const maxPrice = maxPriceProduct[0]?.price || 100;
    console.log("max price = ", maxPrice);
    res.json({ maxPrice });
  } catch (error) {
    res.status(500).json({ message: "Error fetching max price", error });
  }
});

// ============================
// Add New Product
// ============================
productsRouter.post(
  "/addProduct",
  isAdmin,
  upload.array("images", 5), // allow max 5 images
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("description")
      .isLength({ min: 5 })
      .withMessage("Description must be at least 5 characters"),
    body("price").notEmpty().withMessage("Price is required"),
    body("category").notEmpty().withMessage("Category is required"),
    body("stock").notEmpty().withMessage("Stock is required"),
    body("tags").notEmpty().withMessage("Tags are required"),
    body("fit").notEmpty().withMessage("Fit is required"),
  ],
  async (req, res) => {
    console.log("🚀 /addProduct triggered");

    // Debug: log raw body & files
    console.log("📦 Raw req.body:", req.body);
    console.log(
      "🖼️ Files received:",
      req.files?.map((f) => f.originalname)
    );

    // Parse size & color
    let sizeArray = [];
    let colorArray = [];
    try {
      sizeArray = req.body.size
        ? Array.isArray(req.body.size)
          ? req.body.size
          : JSON.parse(req.body.size)
        : [];
      colorArray = req.body.color
        ? Array.isArray(req.body.color)
          ? req.body.color
          : JSON.parse(req.body.color)
        : [];
    } catch (err) {
      console.error("❌ Failed to parse size/color:", err);
      return res
        .status(400)
        .json({ message: "Invalid format for size or color" });
    }

    // Handle validation errors
    const errors = validationResult(req);
    if (
      !errors.isEmpty() ||
      sizeArray.length === 0 ||
      colorArray.length === 0
    ) {
      const sizeColorErrors = [];
      if (sizeArray.length === 0)
        sizeColorErrors.push({
          msg: "At least one size is required",
          param: "size",
        });
      if (colorArray.length === 0)
        sizeColorErrors.push({
          msg: "At least one color is required",
          param: "color",
        });

      console.log(
        "❌ Validation errors:",
        errors.array().concat(sizeColorErrors)
      );
      return res
        .status(400)
        .json({ errors: errors.array().concat(sizeColorErrors) });
    }

    try {
      const { name, description, price, category, stock, tags, fit } = req.body;

      // Ensure images are provided
      if (!req.files || req.files.length === 0) {
        console.log("❌ No images uploaded");
        return res
          .status(400)
          .json({ message: "At least one product image is required" });
      }

      // Upload all images to Cloudinary
      console.log("☁️ Uploading images to Cloudinary...");
      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.buffer)
      );
      const uploadResults = await Promise.all(uploadPromises);
      const imageUrls = uploadResults.map((r) => r.secure_url);
      console.log("✅ Cloudinary image URLs:", imageUrls);

      // Prepare product data
      const now = new Date();
      const productData = {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        category,
        size: sizeArray,
        color: colorArray,
        tags,
        fit,
        images: imageUrls,
        createdAt: now,
        updatedAt: now,
      };

      console.log("📝 Final productData:", productData);

      // Insert product
      const products = getProductsCollection();
      await products.insertOne(productData);

      console.log("🎉 Product inserted into DB");
      res.status(201).json({ message: "✅ Product added successfully" });
    } catch (err) {
      console.error("❌ Product creation failed:", err);
      res
        .status(500)
        .json({ message: "Failed to add product", error: err.message });
    }
  }
);

// ============================
// Update product by ID
// ============================
productsRouter.put("/updateProductByID/:id", isAdmin, async (req, res) => {
  console.log("updateProductByID route triggered");
  const productID = req.params.id;

  try {
    const products = getProductsCollection();
    const existingProduct = await products.findOne({
      _id: new ObjectId(productID),
    });

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedFields = {
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    // ✅ Ensure size & color remain arrays if passed
    if (updatedFields.size) {
      updatedFields.size = Array.isArray(updatedFields.size)
        ? updatedFields.size
        : [updatedFields.size];
    }
    if (updatedFields.color) {
      updatedFields.color = Array.isArray(updatedFields.color)
        ? updatedFields.color
        : [updatedFields.color];
    }

    await products.updateOne(
      { _id: new ObjectId(productID) },
      { $set: updatedFields }
    );

    res.json({ message: "Product updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update product", error });
  }
});

// ============================
// Delete product by ID
// ============================
productsRouter.delete("/deleteProductByID/:id", isAdmin, async (req, res) => {
  console.log("deleteProductByID route triggered");
  const productID = req.params.id;

  try {
    const products = getProductsCollection();
    const existingProduct = await products.findOne({
      _id: new ObjectId(productID),
    });

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    await products.deleteOne({ _id: new ObjectId(productID) });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error });
  }
});

export default productsRouter;
