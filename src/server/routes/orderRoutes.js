import express from "express";
import { getOrdersCollection } from "../connectDB.js";
import { isUser } from "../../Middleware/isUser.js";
import { body, validationResult } from "express-validator";
import { ObjectId } from "mongodb";

const orderRouter = express.Router();

// get all orders
orderRouter.get("/getAllOrders", async (req, res) => {
  const orders = getOrdersCollection();
  try {
    const result = await orders.find().toArray();
    // console.log("result: ", result);
    res.json({ result });
  } catch (error) {
    console.log("error", error);
  }
});

// get user orders:
orderRouter.get("/getUserOrders/:id", isUser, async (req, res) => {
  console.log("/getUsersOrders route is triggered");
  const orders = getOrdersCollection();
  const userID = req.params.id;
  try {
    const userOrders = await orders.find({ userID }).toArray();
    console.log("userOrders:", userOrders);
    res.json({ userOrders });
  } catch (err) {
    console.log("error:", err);
  }
});

// Add new order:
orderRouter.post(
  "/addOrder",
  isUser,
  [
    body("firstname").notEmpty().withMessage("Firstname is required"),
    body("lastname").notEmpty().withMessage("Lastname is required"),
    body("email").notEmpty().withMessage("Email is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("address").notEmpty().withMessage("Address is required"),
    body("apartmentORsuite")
      .notEmpty()
      .withMessage("Apartment or suite is required"),
    body("phone").notEmpty().withMessage("Phone is required"),
    body("userID").notEmpty().withMessage("userID is required"),
  ],
  async (req, res) => {
    console.log("/addOrder route is triggered");

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      firstname,
      lastname,
      email,
      phone,
      city,
      country,
      address,
      apartmentORsuite,
      userID,
    } = req.body;

    const orders = getOrdersCollection();
    try {
      const result = await orders.insertOne({
        firstname,
        lastname,
        email,
        phone,
        city,
        country,
        address,
        apartmentORsuite,
        date: Date.now(),
        userID,
      });

      res.json({
        message: "Order has been added",
        orderID: result.insertedId,
      });
    } catch (error) {
      console.error("Error adding order:", error);
      res.status(500).json({ error: "Error adding the order to server" });
    }
  }
);

export default orderRouter;
