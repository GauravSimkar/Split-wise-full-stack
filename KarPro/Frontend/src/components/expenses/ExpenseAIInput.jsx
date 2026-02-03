import { useState } from "react";
import { parseExpenseAI } from "../../api/aiApi";
import { useGroup } from "../../context/GroupContext";
import { showError } from "../../utils/toast";

const ExpenseAIInput = ({ onParsed }) => {
  const [text, setText] = useState("");
  const { balances } = useGroup();

  const parse = async () => {
    try {
      const participants = balances.map((b) => b.name);

      const res = await parseExpenseAI({
        text,
        participants
      });

      onParsed(res.data); // 🔥 send parsed data
    } catch {
      showError("AI could not understand this sentence");
    }
  };

  return (
    <div className="border p-3 rounded mb-3">
      <textarea
        className="border w-full p-2"
        placeholder="e.g. I paid 1200 for dinner with Rahul and Aman"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={parse}
        className="mt-2 bg-purple-600 text-white px-3 py-1 rounded"
      >
        🤖 Parse with AI
      </button>
    </div>
  );
};

export default ExpenseAIInput;