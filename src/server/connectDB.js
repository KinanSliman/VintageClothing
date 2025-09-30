import { MongoClient } from "mongodb";

import config from "../../config.mjs";

const MONGODB_URI = config.MONGODB_URI;
const client = new MongoClient(MONGODB_URI);
let db;
let users;
let orders;
let offers;
let products;

const connectToDatabase = async () => {
  if (!db) {
    try {
      await client.connect();
      db = client.db("StoreDB");
      users = db.collection("users");
      orders = db.collection("orders");
      offers = db.collection("offers");
      products = db.collection("products");
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("sorry, error connecting to the database", error);
    }
  }
};
const getUsersCollection = () => users;
const getOrdersCollection = () => orders;
const getOffersCollection = () => offers;
const getProductsCollection = () => products;
export {
  connectToDatabase,
  getUsersCollection,
  getOrdersCollection,
  getOffersCollection,
  getProductsCollection,
};
