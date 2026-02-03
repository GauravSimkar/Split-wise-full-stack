import { useGroup } from "../../context/GroupContext";

const Ledger = () => {
  const { expenses } = useGroup();

  if (!expenses || expenses.length === 0) {
    return (
      <p className="text-sm italic text-gray-400">
        No transactions yet
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {expenses.map((e) => (
        <div
          key={e._id}
          className="rounded-2xl border border-white/10
                     bg-white/5 backdrop-blur-md
                     px-5 py-4"
        >
          {/* HEADER */}
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-200">
              {e.description}
            </span>
            <span className="text-lg font-bold text-gray-200">
              ₹{e.amount}
            </span>
          </div>

          {/* META */}
          <p className="mb-3 text-xs text-gray-400">
            Paid by <span className="font-medium">{e.payer?.name}</span> •{" "}
            {new Date(e.date).toLocaleDateString()}
          </p>

          {/* SPLITS */}
          <div className="space-y-1">
            {e.splits.map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between
                           rounded-lg bg-white/5 px-3 py-1.5"
              >
                <span className="text-sm text-gray-300">
                  {s.participantId?.name}
                </span>
                <span className="text-sm font-medium text-gray-200">
                  ₹{s.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Ledger;
