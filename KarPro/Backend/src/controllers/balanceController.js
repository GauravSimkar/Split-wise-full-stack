import Expense from "../models/Expense.js";
import Participant from "../models/Participants.js"; // ✅ CORRECT IMPORT

const round2 = (n) => Math.round(n * 100) / 100;

export const getNetBalances = async (req, res) => {
  const { groupId } = req.params;

  try {
    const participants = await Participant.find({ groupId });
    const expenses = await Expense.find({ groupId });

    // 🔹 init map
    const balanceMap = {};
    participants.forEach((p) => {
      balanceMap[p._id.toString()] = {
        participantId: p._id,
        name: p.name,
        balance: 0
      };
    });

    // 🔹 calculate balances
    expenses.forEach((expense) => {
      if (!expense || !expense.amount) return;

      const payerId = expense.payer?.toString();

      // ✅ payer gets credit
      if (payerId && balanceMap[payerId]) {
        balanceMap[payerId].balance = round2(
          balanceMap[payerId].balance + expense.amount
        );
      }

      // ✅ participants pay their share
      if (Array.isArray(expense.splits)) {
        expense.splits.forEach((split) => {
          const pid = split.participantId?.toString();
          if (pid && balanceMap[pid]) {
            balanceMap[pid].balance = round2(
              balanceMap[pid].balance - (split.amount || 0)
            );
          }
        });
      }
    });

    res.json(Object.values(balanceMap));
  } catch (error) {
    console.error("❌ NET BALANCE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET SETTLEMENT SUGGESTIONS (WHO PAYS WHOM)
 */


export const getSettlementSuggestions = async (req, res) => {
  const { groupId } = req.params;

  try {
    const participants = await Participant.find({ groupId });
    const expenses = await Expense.find({ groupId });

    const balance = {};
    const nameMap = {};

    // init
    participants.forEach((p) => {
      balance[p._id.toString()] = 0;
      nameMap[p._id.toString()] = p.name;
    });

    // calculate balances
    expenses.forEach((expense) => {
      expense.splits.forEach((s) => {
        balance[s.participantId.toString()] -= s.amount;
      });

      balance[expense.payer.toString()] += expense.amount;
    });

    const debtors = [];
    const creditors = [];

    Object.entries(balance).forEach(([id, amt]) => {
      if (amt < 0) debtors.push({ id, amount: -amt });
      if (amt > 0) creditors.push({ id, amount: amt });
    });

    const settlements = [];
    let i = 0, j = 0;

    while (i < debtors.length && j < creditors.length) {
      const pay = Math.min(debtors[i].amount, creditors[j].amount);

      settlements.push({
        from: debtors[i].id,
        fromName: nameMap[debtors[i].id],
        to: creditors[j].id,
        toName: nameMap[creditors[j].id],
        amount: Number(pay.toFixed(2))   // ✅ rounding fix
      });

      debtors[i].amount -= pay;
      creditors[j].amount -= pay;

      if (debtors[i].amount === 0) i++;
      if (creditors[j].amount === 0) j++;
    }

    res.json(settlements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
