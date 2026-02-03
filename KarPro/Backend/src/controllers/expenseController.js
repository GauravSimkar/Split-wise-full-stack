import Expense from "../models/Expense.js";
import Group from "../models/Group.js";
import Participant from "../models/Participants.js";
import { categorizeExpense } from "./aiController.js";


// utility
const round2 = (n) => Math.round(n * 100) / 100;

/**
 * ADD EXPENSE
 */
export const addExpense = async (req, res) => {
  const {
    groupId,
    amount,
    description,
    date,
    payer,
    splitType,
    splits = [],
  } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const participants = await Participant.find({ groupId });
    if (!participants.length) {
      return res.status(400).json({ message: "No participants in group" });
    }

    let finalSplits = [];

    // 🟢 EQUAL SPLIT (with remainder handling)
    if (splitType === "equal") {
      const base = Math.floor((amount / participants.length) * 100) / 100;
      let remainder = round2(amount - base * participants.length);

      finalSplits = participants.map((p) => {
        const extra = remainder > 0 ? 0.01 : 0;
        remainder = round2(remainder - extra);
        return {
          participantId: p._id,
          amount: round2(base + extra)
        };
      });
    }

    // 🔵 CUSTOM SPLIT
    if (splitType === "custom") {
      const total = round2(
        splits.reduce((sum, s) => sum + Number(s.amount), 0)
      );

      if (total !== round2(amount)) {
        return res
          .status(400)
          .json({ message: "Split total must equal expense amount" });
      }

      finalSplits = splits;
    }

    // 🟣 PERCENTAGE SPLIT
    if (splitType === "percentage") {
      const percentTotal = splits.reduce(
        (sum, s) => sum + Number(s.percentage),
        0
      );

      if (percentTotal !== 100) {
        return res
          .status(400)
          .json({ message: "Total percentage must be 100" });
      }

      finalSplits = splits.map((s) => ({
        participantId: s.participantId,
        amount: round2((s.percentage / 100) * amount)
      }));
    }

    const category = await categorizeExpense(description);
    console.log("Categorized as:", category);

    const expense = await Expense.create({
      groupId,
      amount: round2(amount),
      description,
      date: date || new Date(),
      payer,
      splitType,
      splits: finalSplits,
      category
    });

    group.totalSpent = round2((group.totalSpent || 0) + amount);
    await group.save();

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE EXPENSE (SAFE)
 */
export const updateExpense = async (req, res) => {
  const { expenseId } = req.params;
  const newData = req.body;

  try {
    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const group = await Group.findById(expense.groupId);

    // rollback old amount
    group.totalSpent = round2(group.totalSpent - expense.amount);

    // apply new data
    expense.amount = round2(newData.amount);
    expense.description = newData.description;
    expense.date = newData.date || expense.date;
    expense.payer = newData.payer;
    expense.splitType = newData.splitType;
    expense.splits = newData.splits;

    await expense.save();

    // add new amount
    group.totalSpent = round2(group.totalSpent + expense.amount);
    await group.save();

    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE EXPENSE
 */
export const deleteExpense = async (req, res) => {
  const { expenseId } = req.params;

  try {
    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const group = await Group.findById(expense.groupId);

    group.totalSpent = round2(group.totalSpent - expense.amount);
    await group.save();

    await expense.deleteOne();

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET FILTERED EXPENSES
 */
export const getFilteredExpenses = async (req, res) => {
  const {
    groupId,
    search,
    participant,
    startDate,
    endDate,
    minAmount,
    maxAmount
  } = req.query;

  try {
    if (!groupId) {
      return res.status(400).json({ message: "groupId is required" });
    }

    const query = { groupId };

    if (search) {
      query.description = { $regex: search, $options: "i" };
    }

    if (participant) {
      query.$or = [
        { payer: participant },
        { "splits.participantId": participant }
      ];
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = Number(minAmount);
      if (maxAmount) query.amount.$lte = Number(maxAmount);
    }

    const expenses = await Expense.find(query)
      .populate("payer", "name")
      .populate("splits.participantId", "name")
      .sort({ date: -1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
