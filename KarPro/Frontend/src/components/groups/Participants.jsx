import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { showSuccess, showError } from "../../utils/toast";
import { useGroup } from "../../context/GroupContext";

const Participants = () => {
  const { groupId } = useParams();
  const { refreshGroup } = useGroup();

  const [participants, setParticipants] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const fetchParticipants = async () => {
    try {
      const res = await api.get(`/groups/${groupId}`);
      setParticipants(res.data.participants || []);
    } catch {
      showError("Failed to load participants");
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, [groupId]);

  /* ================= ADD PARTICIPANT ================= */
  const addParticipant = async () => {
    if (!name.trim()) {
      showError("Participant name required");
      return;
    }

    try {
      await api.post(`/groups/${groupId}/participants`, {
        name: name.trim(),
      });

      showSuccess("Participant added");
      setName("");
      fetchParticipants();
      refreshGroup();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to add participant");
    }
  };

  /* ================= UPDATE PARTICIPANT ================= */
  const updateParticipant = async (participantId) => {
    if (!editName.trim()) {
      showError("Name required");
      return;
    }

    try {
      await api.put(`/groups/participants/${participantId}`, {
        name: editName.trim(),
      });

      showSuccess("Participant updated");
      setEditingId(null);
      fetchParticipants();
      refreshGroup();
    } catch (err) {
      showError(err.response?.data?.message || "Update failed");
    }
  };

  /* ================= REMOVE PARTICIPANT ================= */
  const removeParticipant = async (participantId) => {
    if (!confirm("Remove participant?")) return;

    try {
      await api.delete(`/groups/${groupId}/participants/${participantId}`);

      showSuccess("Participant removed");
      fetchParticipants();
      refreshGroup();
    } catch (err) {
      showError(
        err.response?.data?.message || "Failed to remove participant"
      );
    }
  };

  return (
    <div
      className="rounded-2xl border border-white/10
                 bg-white/5 backdrop-blur-md
                 px-5 py-4"
    >
      <h3 className="mb-4 text-sm font-semibold tracking-widest text-gray-300">
        PARTICIPANTS
      </h3>

      {/* ADD PARTICIPANT */}
      <div className="mb-5 flex gap-2">
        <input
          className="flex-1 rounded-lg border border-white/20
                     bg-transparent px-3 py-2 text-sm
                     focus:outline-none focus:border-white/40"
          placeholder="Participant name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={addParticipant}
          className="rounded-lg bg-white px-4 py-2
                     text-sm font-semibold text-black
                     hover:bg-gray-200 transition"
        >
          Add
        </button>
      </div>

      {/* PARTICIPANTS LIST */}
      {participants.length === 0 ? (
        <p className="text-sm italic text-gray-400">
          No participants
        </p>
      ) : (
        <ul className="space-y-2">
          {participants.map((p) => (
            <li
              key={p._id}
              className="flex items-center justify-between
                         rounded-lg bg-white/5 px-3 py-2"
            >
              {/* Name / Edit input */}
              {editingId === p._id ? (
                <input
                  className="mr-2 flex-1 rounded-md border border-white/20
                             bg-transparent px-2 py-1 text-sm
                             focus:outline-none focus:border-white/40"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  autoFocus
                />
              ) : (
                <span className="text-sm text-gray-200">
                  {p.name}
                </span>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {editingId === p._id ? (
                  <>
                    <button
                      onClick={() => updateParticipant(p._id)}
                      className="rounded-md px-2 py-1 text-xs
                                 font-medium text-green-400
                                 hover:bg-green-500/10 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="rounded-md px-2 py-1 text-xs
                                 hover:bg-white/10 transition"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingId(p._id);
                        setEditName(p.name);
                      }}
                      className="rounded-md px-2 py-1 text-xs
                                 font-medium text-blue-400
                                 hover:bg-blue-500/10 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeParticipant(p._id)}
                      className="rounded-md px-2 py-1 text-xs
                                 font-medium text-red-400
                                 hover:bg-red-500/10 transition"
                    >
                      Remove
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Participants;
