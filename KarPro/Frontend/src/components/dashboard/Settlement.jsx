import { useEffect, useState } from "react";
import { useGroup } from "../../context/GroupContext";
import { explainSettlementAI } from "../../api/aiApi";

const Settlement = () => {
  const { settlements } = useGroup();
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!settlements || settlements.length === 0) {
      setExplanation("");
      return;
    }

    setLoading(true);

    explainSettlementAI({ settlements })
      .then((res) => setExplanation(res.data.explanation))
      .catch(() =>
        setExplanation("Could not generate settlement explanation.")
      )
      .finally(() => setLoading(false));
  }, [settlements]);

  return (
    <div
      className="rounded-2xl border border-white/10
                 bg-white/5 backdrop-blur-md
                 px-5 py-4"
    >
      {/* HEADER */}
      <h3 className="mb-4 text-sm font-semibold tracking-widest text-gray-300">
        SETTLEMENT SUGGESTIONS
      </h3>

      {/* SETTLEMENT LIST */}
      {settlements.length === 0 ? (
        <p className="text-sm italic text-gray-400">
          All settled 🎉
        </p>
      ) : (
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
      )}

      {/* AI EXPLANATION */}
      {settlements.length > 0 && (
        <div
          className="mt-5 rounded-xl border border-indigo-500/20
                     bg-indigo-500/10 px-4 py-3"
        >
          <p className="mb-2 text-xs font-semibold tracking-widest text-indigo-300">
            🧠 AI EXPLANATION
          </p>

          {loading ? (
            <p className="text-sm italic text-gray-400 animate-pulse">
              Understanding settlements…
            </p>
          ) : (
            <p className="text-sm italic leading-relaxed text-gray-200">
              {explanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Settlement;
