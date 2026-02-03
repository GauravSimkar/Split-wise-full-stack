import { useGroup } from "../../context/GroupContext";

const GroupContributions = () => {
  const { balances } = useGroup();

  if (!balances || balances.length === 0) {
    return (
      <p className="text-sm italic text-gray-400">
        No contributions yet
      </p>
    );
  }

  return (
    <div
      className="rounded-2xl border border-white/10
                 bg-white/5 backdrop-blur-md
                 px-5 py-4"
    >
      <h3 className="mb-4 text-sm font-semibold tracking-widest text-gray-300">
        CONTRIBUTIONS
      </h3>

      <ul className="space-y-2">
        {balances.map((b) => {
          const isPositive = b.balance >= 0;

          return (
            <li
              key={b.participantId}
              className="flex items-center justify-between
                         rounded-lg bg-white/5 px-3 py-2
                         hover:bg-white/10 transition"
            >
              <span className="text-sm text-gray-200">
                {b.name}
              </span>

              <span
                className={`text-sm font-semibold ${
                  isPositive
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {isPositive ? "Gets" : "Owes"} ₹
                {Math.abs(b.balance)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default GroupContributions;
