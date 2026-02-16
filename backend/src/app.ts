import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { prisma } from "./config/prisma";
import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/users.routes";
import { errorHandler } from "./middleware/errorhandler";



dotenv.config();

const app = express();

// Security headers
app.use(helmet());

// Allows frontend apps to call your backend
app.use(cors());

// Allows Express to read JSON request bodies
app.use(express.json());

// Logs requests to your terminal
app.use(morgan("dev"));

app.get("/api/v1/health", (req, res) => {
  res.json({ ok: true, service: "eatctrl-api" });
});

const port = Number(process.env.PORT) || 4000;

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/users", usersRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

