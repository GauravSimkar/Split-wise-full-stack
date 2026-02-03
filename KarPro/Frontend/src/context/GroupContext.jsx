import { createContext, useContext, useEffect, useState } from "react";
import { getGroupSummary } from "../api/groupApi";
import { getBalances, getSettlementSuggestions } from "../api/balanceApi";
import { getExpenses } from "../api/expenseApi";

const GroupContext = createContext();
export const useGroup = () => useContext(GroupContext);

export const GroupProvider = ({ groupId, children }) => {
  const [summary, setSummary] = useState(null);
  const [balances, setBalances] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [settlements, setSettlements] = useState([]);

  // 🔥 filters ALWAYS contain groupId
  const [filters, setFilters] = useState({ groupId });

  /* =========================
     KEEP groupId INSIDE FILTERS
  ========================== */
  useEffect(() => {
    if (!groupId) return;
    setFilters((f) => ({ ...f, groupId }));
  }, [groupId]);

  /* =========================
     LOAD SUMMARY / BALANCES / SETTLEMENT
  ========================== */
  useEffect(() => {
    if (!groupId) return;

    const loadCore = async () => {
      const [summaryRes, balanceRes, settlementRes] =
        await Promise.all([
          getGroupSummary(groupId),
          getBalances(groupId),
          getSettlementSuggestions(groupId)
        ]);

      setSummary(summaryRes.data);
      setBalances(balanceRes.data);
      setSettlements(settlementRes.data);
    };

    loadCore();
  }, [groupId]);

  /* =========================
     LOAD EXPENSES (FILTER BASED)
  ========================== */
  useEffect(() => {
    if (!filters.groupId) return;

    getExpenses(filters).then((res) => setExpenses(res.data));
  }, [filters]);

  /* =========================
     MANUAL REFRESH (SAFE)
  ========================== */
  const refreshGroup = async () => {
    if (!groupId) return;

    const [summaryRes, balanceRes, settlementRes, expenseRes] =
      await Promise.all([
        getGroupSummary(groupId),
        getBalances(groupId),
        getSettlementSuggestions(groupId),
        getExpenses(filters) // 🔥 keep current filters
      ]);

    setSummary(summaryRes.data);
    setBalances(balanceRes.data);
    setSettlements(settlementRes.data);
    setExpenses(expenseRes.data);
  };

  /* =========================
     OPTIMISTIC HELPERS
  ========================== */
  const removeExpenseLocally = (expenseId) => {
    setExpenses((prev) => prev.filter((e) => e._id !== expenseId));
  };

  const addExpenseLocally = (expense) => {
    setExpenses((prev) => [expense, ...prev]);
  };

  const updateExpenseLocally = (updated) => {
    setExpenses((prev) =>
      prev.map((e) => (e._id === updated._id ? updated : e))
    );
  };

  return (
    <GroupContext.Provider
      value={{
        summary,
        balances,
        expenses,
        settlements,
        setFilters,
        refreshGroup,
        removeExpenseLocally,
        addExpenseLocally,
        updateExpenseLocally
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};
