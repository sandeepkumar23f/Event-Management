import express from "express";
import {
  addQuestion,
  deleteQuestionEventId,
  questionsEvent,
  questionsEventId,
  updateQuestionEventId,
} from "../controllers/admin/questionController.js";
import verifyJWTToken from "../middleware/verifyJWTToken.js";
import { userQuestionsById } from "../controllers/user/questionController.js";

const router = express.Router();

//  QUESTION ROUTES 
router.post("/add/:eventId", verifyJWTToken, addQuestion);
router.get("/all/:eventId", verifyJWTToken, questionsEvent);
router.get("/:id",verifyJWTToken, questionsEventId);
router.put("/:id", verifyJWTToken, updateQuestionEventId);
router.delete("/delete/:id/:eventId", verifyJWTToken, deleteQuestionEventId);

// this route is for user to fetch all the questions
router.get("/user-questions/:id",verifyJWTToken,userQuestionsById);

export default router;
