import express from "express"
import { leaderBoard } from "../controllers/admin/leaderBoardController.js"
const router = express.Router();

router.get("/:id",leaderBoard);

export default router;