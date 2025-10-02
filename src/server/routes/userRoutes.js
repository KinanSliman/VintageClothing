import express from "express";
import { ObjectId } from "mongodb";
import { getUsersCollection } from "../connectDB.js";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import config from "../../config.mjs";

const userRouter = express.Router();
const JWT_SECRET = config.JWT_SECRET; // Consider storing this in an environment variable for security

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// -------------------- REGISTER --------------------
userRouter.post(
  "/register",
  [
    body("firstName")
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 characters."),
    body("lastName")
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Last name must be at least 3 characters."),
    body("email").isEmail().withMessage("A valid email is required."),
    body("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters."),
    body("country").notEmpty().withMessage("Country is required."),
    handleValidationErrors,
  ],
  async (req, res) => {
    const { firstName, lastName, email, password, country } = req.body;

    try {
      const users = getUsersCollection();
      const existingUser = await users.findOne({ email });

      if (existingUser) {
        return res.status(409).json({ message: "Email already registered." });
      }

      const now = new Date().toISOString();

      await users.insertOne({
        firstName,
        lastName,
        email,
        password, // 🚨 For production, hash this!
        country,
        role: "user",
        createdAt: now,
      });

      res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({ message: "Registration failed." });
    }
  }
);

// -------------------- LOGIN --------------------
userRouter.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required."),
    body("password").notEmpty().withMessage("Password is required."),
    handleValidationErrors,
  ],
  async (req, res) => {
    const { email, password } = req.body;

    try {
      const users = getUsersCollection();
      const user = await users.findOne({ email, password }); // 🚨 Use hashed passwords in production

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password." });
      }

      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({
        message: "Login successful.",
        token,
        firstname: user.firstName,
        role: user.role,
        email: user.email,
        id: user._id,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed. Please try again." });
    }
  }
);

// -------------------- GET ALL CUSTOMERS --------------------
userRouter.get("/getAllCustomers", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search || "";

  try {
    const users = getUsersCollection();

    const query = {
      role: "user",
      $or: [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    const total = await users.countDocuments(query);

    const customers = await users.find(query).skip(skip).limit(limit).toArray();

    res.json({ customers, total });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Failed to fetch customers." });
  }
});

// -------------------- DELETE CUSTOMER BY ID --------------------
userRouter.delete("/deleteCustomerByID/:id", async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format." });
  }

  try {
    const users = getUsersCollection();
    const result = await users.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Customer not found." });
    }

    res.json({ message: "Customer deleted successfully." });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ message: "Failed to delete customer." });
  }
});

export default userRouter;
