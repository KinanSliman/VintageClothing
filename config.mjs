import dotenv from "dotenv";
dotenv.config();

export default {
  MONGODB_URI: process.env.MONGODB_URI,
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
  JWT_SECRET: process.env.JWT_SECRET,
};
