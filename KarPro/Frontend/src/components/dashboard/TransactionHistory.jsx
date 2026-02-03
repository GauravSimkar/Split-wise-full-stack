import { useGroup } from "../../context/GroupContext";

const TransactionHistory = () => {
  const { expenses, setFilters } = useGroup();

  return (
    <div>
      <input
        placeholder="Search"
        onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
        className="border p-2 mb-2"
      />

      {expenses.map(e => (
        <div key={e._id} className="border p-2 mb-1">
          ₹{e.amount} – {e.description}
        </div>
      ))}
    </div>
  );
};

export default TransactionHistory;
