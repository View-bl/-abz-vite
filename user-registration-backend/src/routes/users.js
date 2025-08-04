import express from "express";
import multer from "multer";
import path from "path";
import User from "../models/User.js";
import { checkToken } from "../middleware/checkToken.js";

const router = express.Router();

// Налаштування multer для збереження фото в папку uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `photo_${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG and PNG images are allowed"));
    }
  },
});

// GET /users?count=5&page=1
router.get("/", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page)) || 1;
    const count = Math.min(100, parseInt(req.query.count)) || 5;

    const total_users = await User.countDocuments();
    const total_pages = Math.ceil(total_users / count);

    if (page > total_pages && total_pages !== 0) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    const users = await User.find()
      .sort({ id: 1 })
      .skip((page - 1) * count)
      .limit(count)
      .select(
        "-_id id name email phone position_id photo_url registration_date"
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
            ? `${baseUrl}?page=${page + 1}&count=${count}`
            : null,
        prev_url:
          page > 1 ? `${baseUrl}?page=${page - 1}&count=${count}` : null,
      },
      users,
    });
  } catch (error) {
    console.error("GET /users error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /users/:id
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
    const user = await User.findOne({ id }).select(
      "-_id id name email phone position position_id photo"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("GET /users/:id error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST /users - приймаємо multipart/form-data з фото з довільною назвою поля
// Додаємо checkToken middleware для перевірки токена перед обробкою запиту
router.post("/", checkToken, upload.any(), async (req, res) => {
  try {
    const { name, email, phone, position_id } = req.body;
    const photoFile = req.files && req.files.length > 0 ? req.files[0] : null;

    const fails = {};

    // Валідація
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

    // Перевірка на існування користувача з таким email або телефоном
    const exists = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "User with this phone or email already exist",
      });
    }

    // Автоматичний id
    const lastUser = await User.findOne().sort({ id: -1 });
    const newId =
      lastUser && typeof lastUser.id === "number" ? lastUser.id + 1 : 1;

    // Створюємо юзера, фото - шлях до файлу
    const newUser = new User({
      id: newId,
      name,
      email,
      phone,
      position_id: parseInt(position_id),
      position: "Unknown", // Тимчасово, доки не зробиш мапінг position_id → position
      registration_timestamp: Math.floor(Date.now() / 1000),
      photo: `${req.protocol}://${req.get("host")}/uploads/${
        photoFile.filename
      }`,
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

router.get("/checkfields", async (req, res) => {
  try {
    const users = await User.find().limit(5);
    res.json(users);
  } catch (error) {
    console.error("GET /checkfields error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
