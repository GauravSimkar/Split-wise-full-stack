import { useState } from "react";
import { useGroup } from "../../context/GroupContext";
import { explainSettlementAI } from "../../api/aiApi";

const Settlement = () => {
  const { settlements } = useGroup();
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleExplain = () => {
    if (!settlements || settlements.length === 0) return;

    setLoading(true);
    setExplanation("");

    explainSettlementAI({ settlements })
      .then((res) => setExplanation(res.data.explanation))
      .catch(() =>
        setExplanation("Could not generate settlement explanation.")
      )
      .finally(() => setLoading(false));
  };

  return (
    <div className="rounded-2xl border border-white/10
                    bg-white/5 backdrop-blur-md
                    px-5 py-4">
      <h3 className="mb-4 text-sm font-semibold tracking-widest text-gray-300">
        SETTLEMENT SUGGESTIONS
      </h3>

      {settlements.length === 0 ? (
        <p className="text-sm italic text-gray-400">
          All settled 🎉
        </p>
      ) : (
        <>
          <ul className="space-y-2">
            {settlements.map((s, i) => (
              <li
                key={i}
                className="flex items-center justify-between
                           rounded-lg bg-white/5 px-3 py-2"
              >
                <span className="text-sm text-gray-200">
                  <span className="font-medium">{s.fromName}</span>{" "}
                  pays{" "}
                  <span className="font-medium">{s.toName}</span>
                </span>
                <span className="text-sm font-semibold text-gray-200">
                  ₹{s.amount}
                </span>
              </li>
            ))}
          </ul>

          {/* Button */}
          <button
            onClick={handleExplain}
            disabled={loading}
            className="mt-4 rounded-lg bg-indigo-500/20
                       px-4 py-2 text-sm font-medium text-indigo-300
                       hover:bg-indigo-500/30 disabled:opacity-50"
          >
            {loading ? "Explaining..." : "Explain with AI"}
          </button>
        </>
      )}

      {/* AI Explanation */}
      {explanation && (
        <div className="mt-4 rounded-xl border border-indigo-500/20
                        bg-indigo-500/10 px-4 py-3">
          <p className="mb-2 text-xs font-semibold tracking-widest text-indigo-300">
            🧠 AI EXPLANATION
          </p>
          <p className="text-sm italic leading-relaxed text-gray-200">
            {explanation}
          </p>
        </div>
      )}
    </div>
  );
};

export default Settlement;
