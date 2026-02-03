import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getNetBalances,
  getSettlementSuggestions
} from "../controllers/balanceController.js";

const router = express.Router();

router.get("/:groupId", protect, getNetBalances);
router.get("/settle/:groupId", protect, getSettlementSuggestions);

export default router;
