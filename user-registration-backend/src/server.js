import express from "express";
import cors from "cors";
import usersRouter from "./routes/users.js";
import positionsRouter from "./routes/positions.js";
import tokenRouter from "./routes/tokenRouter.js";

export function startServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use("/uploads", express.static("uploads"));

  app.use("/api/users", usersRouter);
  app.use("/api/positions", positionsRouter);
  app.use("/api/token", tokenRouter);

  app.get("/", (req, res) => {
    res.send("Hello from backend!");
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}
