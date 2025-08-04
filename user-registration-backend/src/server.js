import express from "express";
import cors from "cors";
import usersRouter from "./routes/users.js";
import positionsRouter from "./routes/positions.js";
// import tokenRouter from "./routes/token.js";

export const startServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

app.use("/api/users", usersRouter);
app.use("/api/positions", positionsRouter);
  app.use("/uploads", express.static("uploads"));

  app.get("/", (req, res) => {
    res.send("Hello from backend!");
  });

  // app.use(tokenRouter);
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};
