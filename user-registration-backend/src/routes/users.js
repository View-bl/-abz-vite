import express from "express";
import multer from "multer";
import path from "path";
import User from "../models/User.js";
import { checkToken } from "../middleware/checkToken.js";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG and PNG images are allowed"));
    }
  },
});

router.get("/", async (req, res) => {
  try {
    const rawPage = req.query.page;
    const rawCount = req.query.count;

    const page = parseInt(rawPage);
    const count = parseInt(rawCount);

    const fails = {};

    if (!rawPage || isNaN(page) || page < 1 || !Number.isInteger(page)) {
      fails.page = ["The page must be an integer and at least 1."];
    }

    if (!rawCount || isNaN(count) || count < 1 || !Number.isInteger(count)) {
      fails.count = ["The count must be an integer and at least 1."];
    }

    if (Object.keys(fails).length > 0) {
      return res.status(422).json({
        success: false,
        message: "Validation failed",
        fails,
      });
    }

    const finalCount = Math.min(100, count);

    const total_users = await User.countDocuments();
    const total_pages = Math.ceil(total_users / finalCount);

    if (page > total_pages && total_pages !== 0) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    const users = await User.find()
      .sort({ id: 1 })
      .skip((page - 1) * finalCount)
      .limit(finalCount)
      .select(
        "-_id id name email phone position_id photo registration_timestamp"
      );

    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;

    res.json({
      success: true,
      page,
      total_pages,
      total_users,
      count: users.length,
      links: {
        next_url:
          page < total_pages
            ? `${baseUrl}?page=${page + 1}&count=${finalCount}`
            : null,
        prev_url:
          page > 1 ? `${baseUrl}?page=${page - 1}&count=${finalCount}` : null,
      },
      users,
    });
  } catch (error) {
    console.error("GET /users error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/checkfields", async (req, res) => {
  try {
    const users = await User.find().limit(5);
    res.json(users);
  } catch (error) {
    console.error("GET /checkfields error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "The user ID must be an integer.",
      fails: { userId: ["The user ID must be an integer."] },
    });
  }

  try {
    const user = await User.findOne({ id })
      .select(
        "-_id id name email phone position_id photo registration_timestamp"
      )
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("GET /users/:id error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/", checkToken, upload.single("photo"), async (req, res) => {
  try {
    const { name, email, phone, position_id } = req.body;
    const photoFile = req.file;

    const fails = {};

    if (!name || name.length < 2 || name.length > 60) {
      fails.name = ["The name must be between 2 and 60 characters."];
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      fails.email = ["The email must be a valid email address."];
    }

    if (!phone || !/^\+380\d{9}$/.test(phone)) {
      fails.phone = ["The phone must start with +380 and be 12 digits total."];
    }

    if (!position_id || isNaN(parseInt(position_id))) {
      fails.position_id = ["The position id must be an integer."];
    }

    if (!photoFile) {
      fails.photo = ["The photo field is required."];
    }

    if (Object.keys(fails).length > 0) {
      return res.status(422).json({
        success: false,
        message: "Validation failed",
        fails,
      });
    }

    const exists = await User.findOne({ $or: [{ email }, { phone }] });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "User with this phone or email already exist",
      });
    }

    const lastUser = await User.findOne().sort({ id: -1 });
    const newId = lastUser?.id ? lastUser.id + 1 : 1;

    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "user-photos" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req);

    const newUser = new User({
      id: newId,
      name,
      email,
      phone,
      position_id: parseInt(position_id),
      photo: result.secure_url,
      registration_timestamp: Math.floor(Date.now() / 1000),
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      user_id: newId,
      message: "New user successfully registered",
    });
  } catch (error) {
    if (error instanceof multer.MulterError) {
      return res.status(422).json({
        success: false,
        message: error.message,
      });
    }

    console.error("POST /users error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

export default router;
