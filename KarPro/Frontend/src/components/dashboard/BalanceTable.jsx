import { useGroup } from "../../context/GroupContext";

const BalanceTable = () => {
  const { balances } = useGroup();

  if (!balances || balances.length === 0) {
    return (
      <p className="text-sm text-gray-400 italic">
        No balance data available
      </p>
    );
  }

  return (
    <div
      className="overflow-hidden rounded-2xl
                 border border-white/10
                 bg-white/5 backdrop-blur-md"
    >
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="px-4 py-3 text-left font-semibold tracking-widest text-gray-400">
              NAME
            </th>
            <th className="px-4 py-3 text-left font-semibold tracking-widest text-gray-400">
              STATUS
            </th>
            <th className="px-4 py-3 text-right font-semibold tracking-widest text-gray-400">
              AMOUNT
            </th>
          </tr>
        </thead>

        <tbody>
          {balances.map((b) => {
            const isPositive = b.balance >= 0;
            return (
              <tr
                key={b.participantId || b.name}
                className="border-b border-white/5 last:border-none
                           hover:bg-white/5 transition"
              >
                <td className="px-4 py-3 text-gray-200">
                  {b.name}
                </td>

                <td
                  className={`px-4 py-3 text-sm font-medium ${
                    isPositive ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {isPositive ? "Gets" : "Owes"}
                </td>

                <td className="px-4 py-3 text-right font-semibold text-gray-200">
                  ₹{Math.abs(b.balance)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BalanceTable;
