import { useEffect, useState } from "react";
import { createExpense, updateExpense } from "../../api/expenseApi";
import { showSuccess, showError } from "../../utils/toast";
import { useGroup } from "../../context/GroupContext";

const round2 = (n) => Math.round(n * 100) / 100;

const ExpenseForm = ({aiData, expense, onClose, onSaved }) => {
  const isEdit = !!expense;
  const { balances, refreshGroup,summary } = useGroup();

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [payer, setPayer] = useState("");

  const [splitType, setSplitType] = useState("equal");
  const [splits, setSplits] = useState([]);

useEffect(() => {
  if (!aiData) return;

  setAmount(aiData.amount || "");
  setDescription(aiData.description || "");
  setSplitType(aiData.splitType || "equal");
}, [aiData]);

  useEffect(() => {
    if (!expense) return;

    setAmount(expense.amount);
    setDescription(expense.description);
    setSplitType(expense.splitType || "equal");
    setPayer(expense.payer?._id || expense.payer || "");

    if (Array.isArray(expense.splits)) {
      setSplits(
        expense.splits.map((s) => ({
          participantId: s.participantId?._id || s.participantId,
          amount: s.amount,
          percentage: s.percentage
        }))
      );
    }
  }, [expense]);

  /* =========================
     BUILD SPLITS (🔥 FIX)
  ========================== */
  const buildSplits = () => {
    const amt = Number(amount);
    if (!amt || balances.length === 0) return [];

    // ✅ EQUAL SPLIT
    if (splitType === "equal") {
      const rawShare = amt / balances.length;
      let remaining = round2(amt);

      return balances.map((b, index) => {
        const share =
          index === balances.length - 1
            ? remaining
            : round2(rawShare);

        remaining = round2(remaining - share);

        return {
          participantId: b.participantId,
          amount: share
        };
      });
    }

    // ✅ PERCENTAGE SPLIT
    if (splitType === "percentage") {
      let remaining = round2(amt);

      return splits.map((s, index) => {
        const share =
          index === splits.length - 1
            ? remaining
            : round2((s.percentage / 100) * amt);

        remaining = round2(remaining - share);

        return {
          participantId: s.participantId,
          amount: share
        };
      });
    }

    // ✅ CUSTOM SPLIT
    return splits;
  };

  /* =========================
     SUBMIT
  ========================== */
  const submit = async () => {
    if (!amount || amount <= 0) {
      showError("Amount must be greater than 0");
      return;
    }

    if (!payer) {
      showError("Please select who paid");
      return;
    }

    const finalSplits = buildSplits();

    if (!finalSplits.length) {
      showError("Invalid split configuration");
      return;
    }

    try {
      const payload = {
        groupId: summary.groupId,
        amount: Number(amount),
        description,
        payer,
        splitType,
        splits: finalSplits   // 🔥 ALWAYS SEND
      };

      if (isEdit) {
        await updateExpense(expense._id, payload);
        showSuccess("Expense updated");
      } else {
        await createExpense(payload);
        showSuccess("Expense added");
      }

      await refreshGroup();
      onClose();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to save expense");
    }
  };

  /* =========================
     UI
  ========================== */
  return (
    <div className="border p-4 rounded bg-gray">
      <h3 className="font-bold mb-3">
        {isEdit ? "Edit Expense" : "Add Expense"}
      </h3>

      {/* Amount */}
      <input
        type="number"
        placeholder="Amount"
        className="border p-2 w-full mb-2"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      {/* Description */}
      <input
        placeholder="Description"
        className="border p-2 w-full mb-2"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* PAYER */}
      <select
        className="border p-2 w-full mb-2"
        value={payer}
        onChange={(e) => setPayer(e.target.value)}
      >
        <option value="">Who paid?</option>
        {balances.map((b) => (
          <option key={b.participantId} value={b.participantId}>
            {b.name}
          </option>
        ))}
      </select>

      {/* SPLIT TYPE */}
      <select
        className="border p-2 w-full mb-2"
        value={splitType}
        onChange={(e) => {
          setSplitType(e.target.value);
          setSplits([]);
        }}
      >
        <option value="equal">Equal Split</option>
        <option value="custom">Custom Amount</option>
        <option value="percentage">Percentage</option>
      </select>

      {/* CUSTOM / PERCENTAGE INPUTS */}
      {splitType !== "equal" &&
        balances.map((b) => {
          const existing = splits.find(
            (s) => s.participantId === b.participantId
          );

          return (
            <div key={b.participantId} className="flex gap-2 mb-1">
              <span className="w-24 text-sm">{b.name}</span>
              <input
                type="number"
                className="border p-1 flex-1"
                placeholder={splitType === "percentage" ? "%" : "Amount"}
                value={
                  splitType === "percentage"
                    ? existing?.percentage || ""
                    : existing?.amount || ""
                }
                onChange={(e) => {
                  const value = Number(e.target.value);

                  setSplits((prev) => {
                    const filtered = prev.filter(
                      (s) => s.participantId !== b.participantId
                    );

                    return [
                      ...filtered,
                      {
                        participantId: b.participantId,
                        ...(splitType === "percentage"
                          ? { percentage: value }
                          : { amount: value })
                      }
                    ];
                  });
                }}
              />
            </div>
          );
        })}

      {/* ACTIONS */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={submit}
          className="bg-black text-white px-4 py-1 rounded"
        >
          {isEdit ? "Update" : "Add"}
        </button>

        <button
          onClick={onClose}
          className="px-4 py-1 border rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ExpenseForm;
