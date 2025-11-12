import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connection } from "./config/dbconfig.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import leaderBoardRoutes from "./routes/leaderBoardRoutes.js";
import submissionsRoutes from "./routes/submissionsRoutes.js";

dotenv.config();
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://quiz-arena-gecsv.onrender.com",
];

const port = process.env.PORT || 5000;

// app.use((req, res, next) => {
//   const origin = req.headers.origin;
//   if (allowedOrigins.includes(origin)) {
//     res.header("Access-Control-Allow-Origin", origin);
//     res.header("Access-Control-Allow-Credentials", "true");
//   }
//   if (req.method === "OPTIONS") {
//     res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
//     res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
//     return res.sendStatus(204); // Preflight requests respond immediately
//   }

//   next();
// });

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json());
app.use(cookieParser());

connection();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/leaderboard", leaderBoardRoutes);
app.use("/api/submissions", submissionsRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});