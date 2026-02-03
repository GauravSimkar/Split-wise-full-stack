import api from "./axios";

export const getGroupSummary = (groupId) =>
  api.get(`/groups/${groupId}/summary`);
