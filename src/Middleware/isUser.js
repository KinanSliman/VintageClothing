import jwt from "jsonwebtoken";
const JWT_SECRET = "1234"; // keep it same as your userRouter

export const isUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1]; // ✅ Move this up

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // ✅ Now token is defined
    if (decoded.role !== "user") {
      return res.status(403).json({ message: "Forbidden: users only" });
    }

    req.user = decoded; // store user info if needed later
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
