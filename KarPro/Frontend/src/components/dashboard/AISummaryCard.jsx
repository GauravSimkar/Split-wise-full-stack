import { useState } from "react";
import { useGroup } from "../../context/GroupContext";
import { getAISummary } from "../../api/aiApi";

const AISummaryCard = () => {
  const { summary } = useGroup();
  const [aiSummary, setAiSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateSummary = () => {
    if (!summary) return;

    setLoading(true);
    setAiSummary("");

    getAISummary({
      totalSpent: summary.totalSpent,
      balances: summary.balances,
    })
      .then((res) => setAiSummary(res.data.summary))
      .catch(() =>
        setAiSummary("Could not generate AI summary right now.")
      )
      .finally(() => setLoading(false));
  };

  return (
    <div className="relative overflow-hidden rounded-2xl
                    border border-white/10
                    bg-white/5 backdrop-blur-md
                    px-6 py-5">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent opacity-60" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full
                          bg-indigo-500/20 text-indigo-400">
            🧠
          </div>
          <h3 className="text-sm font-semibold tracking-widest text-indigo-300">
            AI TRIP SUMMARY
          </h3>
        </div>

        {/* Button */}
        <button
          onClick={handleGenerateSummary}
          disabled={loading}
          className="mb-3 rounded-lg bg-indigo-500/20
                     px-4 py-2 text-sm font-medium text-indigo-300
                     hover:bg-indigo-500/30 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Summary"}
        </button>

        {/* Content */}
        <p className="text-sm italic leading-relaxed text-gray-300">
          {loading
            ? "Thinking like a human accountant…"
            : aiSummary || "Click the button to generate AI summary."}
        </p>
      </div>
    </div>
  );
};

export default AISummaryCard;
