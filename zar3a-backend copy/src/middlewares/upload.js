// src/middlewares/upload.js
import multer from "multer";
import path   from "path";
import fs     from "fs";
import { v4 as uuidv4 } from "uuid";

const uploadDir = process.env.CV_UPLOAD_DIR || "uploads/cv";
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename:    (_req, file,  cb) => cb(null, `${uuidv4()}${path.extname(file.originalname)}`),
});

const fileFilter = (_req, file, cb) => {
  const allowed = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".heic", ".heif", ".png"];
  if (allowed.includes(path.extname(file.originalname).toLowerCase()))
    cb(null, true);
  else
    cb(new Error("Only images (jpg, heic, png) and documents (pdf, doc, docx) are accepted"));
};

export const uploadCV = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
}).single("cv");

const productImageDir = "uploads/products";
fs.mkdirSync(productImageDir, { recursive: true });

const productImageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, productImageDir),
  filename:    (_req, file,  cb) => cb(null, `${uuidv4()}${path.extname(file.originalname)}`),
});

const productImageFilter = (_req, file, cb) => {
  const allowed = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".heic", ".heif"];
  if (allowed.includes(path.extname(file.originalname).toLowerCase()))
    cb(null, true);
  else
    cb(new Error("Only images (png, jpg, jpeg, webp, gif, heic) are accepted"));
};

export const uploadProductImage = multer({
  storage: productImageStorage,
  fileFilter: productImageFilter,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
}).single("imageFile");

// ── Chat attachment upload ────────────────────────────────────────────────────
const chatDir = "uploads/chat";
fs.mkdirSync(chatDir, { recursive: true });

const chatStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, chatDir),
  filename:    (_req, file,  cb) => cb(null, `${uuidv4()}${path.extname(file.originalname)}`),
});

const chatFileFilter = (_req, file, cb) => {
  const allowed = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".pdf", ".doc", ".docx", ".heic", ".heif"];
  if (allowed.includes(path.extname(file.originalname).toLowerCase()))
    cb(null, true);
  else
    cb(new Error("Only images and documents (pdf, doc, docx) are accepted"));
};

export const uploadChatAttachment = multer({
  storage: chatStorage,
  fileFilter: chatFileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
}).single("file");

const expertImageDir = "uploads/experts";
fs.mkdirSync(expertImageDir, { recursive: true });

const expertImageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, expertImageDir),
  filename:    (_req, file,  cb) => cb(null, `${uuidv4()}${path.extname(file.originalname)}`),
});

const expertImageFilter = (_req, file, cb) => {
  const allowed = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".heic", ".heif"];
  if (allowed.includes(path.extname(file.originalname).toLowerCase()))
    cb(null, true);
  else
    cb(new Error("Only images (png, jpg, jpeg, webp, gif, heic) are accepted"));
};

export const uploadExpertImage = multer({
  storage: expertImageStorage,
  fileFilter: expertImageFilter,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
}).single("imageFile");

