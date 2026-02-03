import express from "express";
import protect from "../middleware/authMiddleware.js";
import { explainSettlements, generateGroupSummary, parseExpenseFromText } from "../controllers/aiController.js";

const router = express.Router();

router.post("/parse-expense", protect, parseExpenseFromText);
router.post("/group-summary", protect, generateGroupSummary);
router.post("/settlement-explain", protect, explainSettlements);



export default router;
