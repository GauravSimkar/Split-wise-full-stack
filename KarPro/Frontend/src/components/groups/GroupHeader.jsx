import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import { showSuccess, showError } from "../../utils/toast";
import { useGroup } from "../../context/GroupContext";

const GroupHeader = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { summary, refreshGroup } = useGroup();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(summary?.groupName || "");

  if (!summary) return null;

  const updateName = async () => {
    if (!name.trim()) {
      showError("Group name required");
      return;
    }

    try {
      await api.put(`/groups/${groupId}`, { name });
      showSuccess("Group name updated");
      setEditing(false);
      refreshGroup();
    } catch (err) {
      showError(err.response?.data?.message || "Update failed");
    }
  };

  const deleteGroup = async () => {
    if (!confirm("Delete this group permanently?")) return;

    try {
      await api.delete(`/groups/${groupId}`);
      showSuccess("Group deleted");
      navigate("/groups");
    } catch (err) {
      showError(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div
      className="mb-6 flex items-center justify-between gap-4
                 rounded-2xl border border-white/10
                 bg-white/5 backdrop-blur-md
                 px-5 py-4"
    >
      {/* LEFT SIDE */}
      {editing ? (
        <div className="flex flex-1 items-center gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            className="flex-1 rounded-lg border border-white/20
                       bg-transparent px-3 py-2
                       text-sm focus:outline-none focus:border-white/40"
          />

          <button
            onClick={updateName}
            className="rounded-lg bg-white px-4 py-2
                       text-sm font-semibold text-black
                       hover:bg-gray-200 transition"
          >
            Save
          </button>

          <button
            onClick={() => {
              setEditing(false);
              setName(summary.groupName);
            }}
            className="rounded-lg border border-white/20
                       px-4 py-2 text-sm
                       hover:bg-white/5 transition"
          >
            Cancel
          </button>
        </div>
      ) : (
        <h2 className="text-xl font-bold tracking-tight">
          {summary.groupName}
        </h2>
      )}

      {/* RIGHT SIDE */}
      {!editing && (
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEditing(true)}
            className="rounded-lg px-3 py-1.5
                       text-sm font-medium
                       text-blue-400 hover:text-blue-300
                       hover:bg-blue-500/10 transition"
          >
            Edit
          </button>

          <button
            onClick={deleteGroup}
            className="rounded-lg px-3 py-1.5
                       text-sm font-medium
                       text-red-400 hover:text-red-300
                       hover:bg-red-500/10 transition"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default GroupHeader;
