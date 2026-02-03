import { useState } from "react";
import ExpenseItem from "./ExpenseItem";
import ExpenseForm from "./ExpenseForm";
import { useGroup } from "../../context/GroupContext";
import ExpenseAIInput from "./ExpenseAIInput";

const ExpenseList = () => {
  const { expenses, refreshGroup } = useGroup();

  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [aiExpense, setAiExpense] = useState(null);

  const openAddForm = () => {
    setEditingExpense(null);
    setAiExpense(null);
    setShowForm(true);
  };

  const openEditForm = (expense) => {
    setEditingExpense(expense);
    setAiExpense(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingExpense(null);
    setAiExpense(null);
  };

  return (
    <div
      className="rounded-2xl border border-white/10
                 bg-white/5 backdrop-blur-md
                 px-5 py-4"
    >
      {/* HEADER */}
      <div className="mb-4 grid grid-cols-3 items-center">
        {/* Left */}
        <h3 className="text-sm font-semibold tracking-widest text-gray-800">
          EXPENSES
        </h3>

        {/* Center */}
        <div className="flex justify-center">
          <ExpenseAIInput
            onParsed={(data) => {
              setAiExpense(data);
              setShowForm(true);
            }}
          />
        </div>

        {/* Right */}
        <div className="flex justify-end">
          <button
            onClick={openAddForm}
            className="rounded-lg bg-green-500 px-4 py-2
                       text-sm font-semibold text-white
                       hover:bg-green-400 transition"
          >
            + Add
          </button>
        </div>
      </div>

      {/* ADD / EDIT FORM */}
      {showForm && (
        <ExpenseForm
          aiData={aiExpense}
          expense={editingExpense}
          onClose={closeForm}
          onSaved={async () => {
            closeForm();
            await refreshGroup();
          }}
        />
      )}

      {/* LIST */}
      {expenses.length === 0 ? (
        <p className="text-sm italic text-gray-400">
          No expenses yet
        </p>
      ) : (
        <div className="space-y-2">
          {expenses.map((e) => (
            <ExpenseItem
              key={e._id}
              expense={e}
              onEdit={() => openEditForm(e)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
