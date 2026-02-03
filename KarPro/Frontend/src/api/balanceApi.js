import api from "./axios";

export const getBalances = (groupId) =>
  api.get(`/balances/${groupId}`);

export const getSettlementSuggestions = (groupId) =>
  api.get(`/balances/settle/${groupId}`);
