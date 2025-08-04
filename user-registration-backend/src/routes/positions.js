import express from "express";
const router = express.Router();

const positions = [
  { id: 1, name: "Frontend developer" },
  { id: 2, name: "Backend developer" },
  { id: 3, name: "Designer" },
  { id: 4, name: "QA" },
];

// GET /positions
router.get("/", (req, res) => {
  if (positions.length === 0) {
    return res.status(422).json({
      success: false,
      message: "Positions not found",
    });
  }
  res.json({
    success: true,
    positions,
  });
});

export default router;
