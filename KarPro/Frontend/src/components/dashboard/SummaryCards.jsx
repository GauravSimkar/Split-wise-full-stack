import { useGroup } from "../../context/GroupContext";

const SummaryCards = () => {
  const { summary } = useGroup();
  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <Card
        title="TOTAL SPENT"
        value={summary.totalSpent}
        accent="blue"
      />
      <Card
        title="YOU OWE"
        value={getOwe(summary.balances)}
        accent="red"
      />
      <Card
        title="YOU GET"
        value={getGet(summary.balances)}
        accent="green"
      />
    </div>
  );
};

const getOwe = (balances) =>
  Math.abs(balances.find((b) => b.balance < 0)?.balance || 0);

const getGet = (balances) =>
  balances.find((b) => b.balance > 0)?.balance || 0;

/* ================= CARD ================= */

const accentMap = {
  blue: "from-blue-500/20 to-blue-500/5 text-blue-400",
  red: "from-red-500/20 to-red-500/5 text-red-400",
  green: "from-green-500/20 to-green-500/5 text-green-400",
};

const Card = ({ title, value, accent }) => {
  return (
    <div
      className="relative overflow-hidden rounded-2xl
                 border border-white/10
                 bg-white/5 backdrop-blur-md
                 px-5 py-4"
    >
      {/* Accent glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${accentMap[accent]} opacity-40`}
      />

      <div className="relative">
        <p className="text-xs tracking-widest text-gray-400 mb-2">
          {title}
        </p>
        <p className="text-2xl font-bold">
          ₹{value}
        </p>
      </div>
    </div>
  );
};

export default SummaryCards;
