import multer from "multer";
import HttpError from "../errors/HttpError";

const MIME_TYPES = ["image/png", "image/jpg", "image/jpeg"];

const fileUpload = multer({
  limits: {
    files: 1,
  },
  storage: multer.memoryStorage(),
  fileFilter: (req, file, callback) => {
    const isValid = MIME_TYPES.includes(file.mimetype);
    if (!isValid) {
      return callback(new HttpError("Invalid mime type!", 400));
    }
    callback(null, isValid);
  },
});

export default fileUpload;
