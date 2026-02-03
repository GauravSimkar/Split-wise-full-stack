import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
    addExpense, updateExpense,
    deleteExpense
} from "../controllers/expenseController.js";
import { getFilteredExpenses } from "../controllers/expenseController.js";


const router = express.Router();

router.post("/", protect, addExpense);
router.put("/:expenseId", protect, updateExpense);
router.delete("/:expenseId", protect, deleteExpense);
router.get("/", protect, getFilteredExpenses);

export default router;
