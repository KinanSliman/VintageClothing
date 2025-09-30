import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { connectToDatabase } from "./connectDB.js";
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import offerRouter from "./routes/offerRoute.js";
import productsRouter from "./routes/productsRoutes.js";

const PORT = 5000;
const app = express();
app.use(cors());
app.use(bodyParser.json());

const startServer = async () => {
  try {
    await connectToDatabase();
    app.use("/api/user", userRouter);
    app.use("/api/orders", orderRouter);
    app.use("/api/offers", offerRouter);
    app.use("/api/products", productsRouter);
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Not able to start the server, ${error}`);
  }
};
startServer();
