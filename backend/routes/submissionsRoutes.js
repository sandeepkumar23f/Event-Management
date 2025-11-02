import express from "express"
import { checkSubmission, submitQuiz } from "../controllers/user/submissionsController.js"
import verifyJWTToken from "../middleware/verifyJWTToken.js";

const router = express.Router();
router.get("/check/:eventId",verifyJWTToken,checkSubmission)
router.post("/submit/:eventId",verifyJWTToken,submitQuiz);

export default router;