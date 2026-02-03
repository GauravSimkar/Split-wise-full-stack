import api from "./axios";

export const parseExpenseAI = (data) =>
  api.post("/ai/parse-expense", data);


export const getAISummary = (data) =>
  api.post("/ai/group-summary", data);

export const explainSettlementAI = (data) =>
  api.post("/ai/settlement-explain", data);
