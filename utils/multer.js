import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// ✅ Cloudinary Storage Configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "task-management/profiles",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    public_id: (req, file) => `profile-${Date.now()}`,
    transformation: [{ quality: "auto:best" }],
  },
});

// File filter
function fileFilter(req, file, cb) {
  const allowedType = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  
  if (allowedType.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .PNG, .JPG, .JPEG, .WEBP files are allowed!"), false);
  }
}

const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,  // 5MB
  }
});

export default upload;