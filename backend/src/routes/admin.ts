import { Router, Request, Response } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "../config/prisma";
import { _res } from "../utils/helper";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "doy5lkpqj";
const apiKey = process.env.CLOUDINARY_API_KEY || "474437244269365";
const apiSecret = process.env.CLOUDINARY_API_SECRET || "R73Yh2369bmRe0bnl2p4YvWWo5Y";

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

const storage = multer.diskStorage({
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

const router = Router();

router.put(
  "/meals/:id/image",
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;

      const meal = await prisma.meals.findUnique({ where: { id } });
      if (!meal) {
        return _res.error(404, res, "Meal not found");
      }

      if (!req.file) {
        return _res.error(400, res, "No image file provided");
      }

      const result = await cloudinary.uploader.upload(req.file!.path as string, {
        folder: "naija_eats/meals",
      });

      const updated = await prisma.meals.update({
        where: { id },
        data: { image_url: result.secure_url },
      });

      return _res.success(200, res, "Image uploaded successfully", {
        image_url: updated.image_url!,
      });
    } catch (err) {
      console.error("Image upload error:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
      return _res.error(500, res, "Failed to upload image");
    }
  },
);

export default router;
