import express from "express";
import {
  createMcqEvent,
  deleteEventById,
  events,
  eventsById,
  startEvent,
  updateEventById,
} from "../controllers/admin/eventController.js";
import { eventUser, exploreEventById } from "../controllers/user/eventController.js";
import {
  myRegistration,
  userRegistration,
} from "../controllers/user/registrationController.js";
import verifyJWTToken from "../middleware/verifyJWTToken.js"
import { viewRegistration } from "../controllers/admin/registrationController.js";

const router = express.Router();

// ---------- ADMIN ROUTES ----------
router.post("/create", verifyJWTToken, createMcqEvent);
router.get("/", verifyJWTToken, events);
router.get("/event-registrations/:id", verifyJWTToken, viewRegistration);
router.put("/update/:id", verifyJWTToken, updateEventById);
router.delete("/delete/:id", verifyJWTToken, deleteEventById);
router.post("/start/:id", verifyJWTToken, startEvent);


// ---------- USER ROUTES ----------
router.get("/explore", verifyJWTToken, eventUser);
router.get("/explore/:id", verifyJWTToken, exploreEventById);
router.post("/register/:id", verifyJWTToken, userRegistration);
router.get("/registrations", verifyJWTToken, myRegistration);

router.get("/:id", verifyJWTToken, eventsById);

export default router;
