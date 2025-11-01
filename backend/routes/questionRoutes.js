import express from "express";
import {
  addQuestion,
  deleteQuestionEventId,
  questionsEvent,
  questionsEventId,
  updateQuestionEventId,
} from "../controllers/admin/questionController.js";
import verifyJWTToken from "../middleware/verifyJWTToken.js";

const router = express.Router();

// ---------- QUESTION ROUTES ----------
router.post("/add/:eventId", verifyJWTToken, addQuestion);
router.get("/all/:eventId", verifyJWTToken, questionsEvent);
router.get("/:id",verifyJWTToken, questionsEventId);
router.put("/:id", verifyJWTToken, updateQuestionEventId);
router.delete("/delete/:id/:eventId", verifyJWTToken, deleteQuestionEventId);

export default router;
