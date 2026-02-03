import { useGroup } from "../../context/GroupContext";

const GroupStats = () => {
  const { balances } = useGroup();

  const contributors = balances.filter((b) => b.balance > 0);
  const owers = balances.filter((b) => b.balance < 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <Stat
        title="CONTRIBUTORS"
        subtitle="Gets money"
        list={contributors}
        accent="green"
      />
      <Stat
        title="OWERS"
        subtitle="Pays money"
        list={owers}
        accent="red"
      />
    </div>
  );
};

const Stat = ({ title, subtitle, list, accent }) => {
  const accentMap = {
    green: "from-green-500/20 to-green-500/5 text-green-400",
    red: "from-red-500/20 to-red-500/5 text-red-400",
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl
                 border border-white/10
                 bg-white/5 backdrop-blur-md
                 px-5 py-4"
    >
      {/* Accent gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${accentMap[accent]} opacity-40`}
      />

      <div className="relative">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold tracking-widest text-gray-300">
            {title}
          </h3>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>

        {/* List */}
        {list.length === 0 ? (
          <p className="text-sm text-gray-400 italic">
            None
          </p>
        ) : (
          <ul className="space-y-2">
            {list.map((i) => (
              <li
                key={i.participantId}
                className="flex items-center justify-between
                           rounded-lg bg-white/5 px-3 py-2"
              >
                <span className="text-sm text-gray-200">
                  {i.name}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    accent === "green"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  ₹{Math.abs(i.balance)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GroupStats;
