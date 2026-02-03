import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getMyGroups,
  createGroup,
  updateGroupName,
  addParticipant,
  removeParticipant,
  deleteGroup,
  getGroupSummary,
  getGroupById,
  updateParticipant
} from "../controllers/groupController.js";

const router = express.Router();

/**
 * COLLECTION LEVEL ROUTES
 */
router.post("/", protect, createGroup);   // create group
router.get("/", protect, getMyGroups);    // list my groups

/**
 * SPECIAL NESTED ROUTES (MUST COME BEFORE :groupId)
 */
router.get("/:groupId/summary", protect, getGroupSummary);

/**
 * GROUP LEVEL ROUTES
 */
router.get("/:groupId", protect, getGroupById); // 🔥 REQUIRED
router.put("/:groupId", protect, updateGroupName);
router.delete("/:groupId", protect, deleteGroup);

/**
 * PARTICIPANT ROUTES
 */
router.post("/:groupId/participants", protect, addParticipant);
router.put(
  "/participants/:participantId",
  protect,
  updateParticipant
);

router.delete(
  "/:groupId/participants/:participantId",
  protect,
  removeParticipant
);

export default router;
