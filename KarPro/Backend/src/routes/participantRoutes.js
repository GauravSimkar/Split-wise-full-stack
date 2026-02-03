import express from "express";
import protect from "../middleware/authMiddleware.js";
import { addParticipant,updateParticipantName,removeParticipant } from "../controllers/participantController.js";

const router = express.Router();

router.post("/:groupId", protect, addParticipant);
router.put("/:participantId", protect, updateParticipantName);
router.delete("/:participantId", protect, removeParticipant);
export default router;

