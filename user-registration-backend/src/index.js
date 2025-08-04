import dotenv from "dotenv";
dotenv.config();

import { initMongoDB } from "./db/initMongoDB.js";
import { startServer } from "./server.js";

const bootstrap = async () => {
  try {
    await initMongoDB();
    startServer();
  } catch (error) {
    console.error("Failed to start app", error);
    process.exit(1);
  }
};

bootstrap();
