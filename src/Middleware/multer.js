import multer from "multer";

const storage = multer.memoryStorage(); // we'll upload from memory buffer to Cloudinary

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // limit to 5MB
});

export default upload;
