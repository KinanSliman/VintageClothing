import express from "express";
import { getOffersCollection } from "../connectDB.js";
import { ObjectId } from "mongodb";
import { body, validationResult } from "express-validator";
import { isAdmin } from "../../Middleware/isAdmin.js";

const offerRouter = express.Router();

// GET all offers
offerRouter.get("/getOffers", async (req, res) => {
  console.log("triggering the offers route");
  const offers = getOffersCollection();
  try {
    const fetchedOffers = await offers.find().toArray();
    res.json({ fetchedOffers });
  } catch (error) {
    console.error("Error fetching offers:", error);
    res.status(500).json({ error: "Failed to fetch offers" });
  }
});

// ADD a new offer
offerRouter.post(
  "/addOffer",
  isAdmin,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("description")
      .isLength({ min: 5 })
      .withMessage("Description must be at least 5 characters"),
  ],
  async (req, res) => {
    console.log("addOffer route is triggered");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;
    const offers = getOffersCollection();
    try {
      const result = await offers.insertOne({ name, description });
      res.json({ message: "Offer has been added", offerID: result.insertedId });
    } catch (error) {
      console.error("Error adding offer:", error);
      res.status(500).json({ error: "Error adding the offer to server" });
    }
  }
);

// EDIT an existing offer
offerRouter.post(
  "/editOffer",
  isAdmin,
  [
    body("offerID").notEmpty().withMessage("Offer ID is required"),
    body("name").notEmpty().withMessage("Name is required"),
    body("description")
      .isLength({ min: 5 })
      .withMessage("Description must be at least 5 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, offerID } = req.body;
    const offers = getOffersCollection();
    try {
      const result = await offers.updateOne(
        { _id: new ObjectId(offerID) },
        { $set: { name, description } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Offer not found" });
      }

      res.json({ message: "Offer has been edited successfully" });
    } catch (error) {
      console.error("Error editing offer:", error);
      res.status(500).json({ error: "Error editing the offer on the server" });
    }
  }
);

// DELETE an offer
// DELETE /offers/delete/:offerID
offerRouter.delete("/delete/:offerID", isAdmin, async (req, res) => {
  const { offerID } = req.params;

  if (!offerID) {
    return res.status(400).json({ error: "Offer ID is required" });
  }

  const offers = getOffersCollection();
  try {
    const result = await offers.deleteOne({ _id: new ObjectId(offerID) });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Offer not found or already deleted" });
    }

    res.json({ message: "Offer has been deleted successfully" });
  } catch (error) {
    console.error("Error deleting offer:", error);
    res.status(500).json({
      message: "Server encountered an issue, offer wasn't deleted",
      error: error.message,
    });
  }
});

export default offerRouter;
