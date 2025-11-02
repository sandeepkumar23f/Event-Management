import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connection } from "./config/dbconfig.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import leaderBoardRoutes from "./routes/leaderBoardRoutes.js"
import submissionsRoutes from "./routes/submissionsRoutes.js"
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
connection();

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/leaderboard",leaderBoardRoutes)
app.use("/api/submissions",submissionsRoutes)
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
