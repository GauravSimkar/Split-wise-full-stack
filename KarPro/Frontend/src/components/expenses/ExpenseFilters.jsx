import { useGroup } from "../../context/GroupContext";

const ExpenseFilters = () => {
  const { setFilters, balances } = useGroup();

  return (
    <div
      className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3
                 rounded-2xl border border-white/10
                 bg-white/5 backdrop-blur-md
                 px-4 py-3"
    >
      {/* Search */}
      <input
        type="text"
        placeholder="Search description"
        className="rounded-lg border border-white/20
                   bg-transparent px-3 py-2 text-sm
                   text-gray-200 placeholder-gray-400
                   focus:outline-none focus:border-white/40"
        onChange={(e) =>
          setFilters((f) => ({ ...f, search: e.target.value }))
        }
      />

      {/* Participant */}
      <select
        className="rounded-lg border border-white/20
                   bg-transparent px-3 py-2 text-sm
                   text-gray-200
                   focus:outline-none focus:border-white/40"
        onChange={(e) =>
          setFilters((f) => ({ ...f, participant: e.target.value }))
        }
      >
        <option value="">All participants</option>
        {balances.map((b) => (
          <option key={b.participantId} value={b.participantId}>
            {b.name}
          </option>
        ))}
      </select>

      {/* Date */}
      <input
        type="date"
        className="rounded-lg border border-white/20
                   bg-transparent px-3 py-2 text-sm
                   text-gray-200
                   focus:outline-none focus:border-white/40"
        onChange={(e) =>
          setFilters((f) => ({
            ...f,
            startDate: e.target.value || undefined,
          }))
        }
      />

      {/* Min Amount */}
      <input
        type="number"
        placeholder="Min ₹"
        className="rounded-lg border border-white/20
                   bg-transparent px-3 py-2 text-sm
                   text-gray-200 placeholder-gray-400
                   focus:outline-none focus:border-white/40"
        onChange={(e) =>
          setFilters((f) => ({ ...f, minAmount: e.target.value }))
        }
      />
    </div>
  );
};

export default ExpenseFilters;
