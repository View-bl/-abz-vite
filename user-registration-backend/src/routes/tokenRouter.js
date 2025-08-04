import express from "express";
import generateToken from "./generateToken.js";

const router = express.Router();

router.get("/", (req, res) => {
  try {
    const payload = { userId: 123, name: "Roman" }; 
    const token = generateToken(payload);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate token" });
  }
});

export default router;
