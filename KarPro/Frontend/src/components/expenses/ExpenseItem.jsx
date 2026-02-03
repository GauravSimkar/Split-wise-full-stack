import { useState } from "react";
import ExpenseForm from "./ExpenseForm";
import { deleteExpense } from "../../api/expenseApi";
import { showSuccess, showError } from "../../utils/toast";
import { useGroup } from "../../context/GroupContext";

const ExpenseItem = ({ expense }) => {
   console.log("Category:", expense.category);
  const [editing, setEditing] = useState(false);
  const { refreshGroup, removeExpenseLocally } = useGroup();

  const remove = async () => {
    if (!confirm("Delete this expense?")) return;

    try {
      // 🔥 backend delete
      await deleteExpense(expense._id);

      // 🔥 instant UI update
      removeExpenseLocally(expense._id);

      showSuccess("Expense deleted");

      // 🔥 safety re-sync
      refreshGroup();
    } catch {
      showError("Failed to delete expense");
    }
  };

  if (editing) {
    return (
      <ExpenseForm
        expense={expense}
        onClose={() => setEditing(false)}
        onSaved={async () => {
          setEditing(false);
          await refreshGroup();
        }}
      />
    );
  }

  return (
    <div className="border p-2 rounded flex justify-between items-center">
      <div>
        <p className="font-medium">₹{expense.amount}</p>
        <p className="text-sm text-gray-600">{expense.description}</p>
        <p className="text-xs text-gray-500">
          {expense.category}
         
        </p>

        <p className="text-xs text-gray-500">
          Paid by {expense.payer?.name} •{" "}
          {new Date(expense.date).toLocaleDateString()}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setEditing(true)}
          className="text-blue-600 text-sm"
        >
          Edit
        </button>
        <button
          onClick={remove}
          className="text-red-600 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ExpenseItem;
