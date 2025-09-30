import { MongoClient } from "mongodb";
//import config from "../../config.mjs";

//const uri = "mongodb://127.0.0.1:27017";
//console.log("MongoDB URI:", config.MONGODB_URI);
//const uri = config.MONGODB_URI;
const MONGODB_URI =
  "mongodb+srv://StoreDB_user_7:V9V8x1AGQN6V20E5@cluster0.shhuxk9.mongodb.net/StoreDB";

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
