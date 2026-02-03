import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "../api/axios";
import { showSuccess, showError } from "../utils/toast";

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const fetchGroups = async () => {
    try {
      const res = await axios.get("/groups");
      setGroups(res.data);
    } catch {
      showError("Failed to load groups");
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const createGroup = async () => {
    if (!name.trim()) {
      showError("Group name required");
      return;
    }

    try {
      const res = await axios.post("/groups", {
        name,
        participants: [],
      });

      showSuccess("Group created");
      setName("");
      navigate(`/groups/${res.data._id}`);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to create group");
    }
  };

  return (
    <div className="min-h-screen pt-24 px-6">
      <div className="max-w-xl mx-auto">

        {/* Heading */}
        <h2 className="text-2xl font-bold mb-8">Your Groups</h2>

        {/* Create Group */}
        <div className="flex gap-2 mb-12">
          <input
            className="flex-1 rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-black"
            placeholder="New group name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            onClick={createGroup}
            className="rounded-lg bg-black text-white px-4 font-semibold hover:scale-105 transition"
          >
            Create
          </button>
        </div>

        {/* GROUP LIST — YOYO SCROLL */}
        {groups.length === 0 ? (
          <p className="text-gray-500">No groups yet</p>
        ) : (
          <ul className="space-y-4">
            {groups.map((g) => (
              <motion.li
                key={g._id}

                /* 👇 YOYO SCROLL MAGIC */
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{
                  once: false, // 👈 upar jao = hide, niche = show
                  amount: 0.3,
                }}
                transition={{
                  duration: 0.45,
                  ease: "easeOut",
                }}

                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() => navigate(`/groups/${g._id}`)}
                className="cursor-pointer rounded-xl border p-4 transition"
              >
                <div className="font-semibold text-lg">{g.name}</div>
                <div className="text-sm text-gray-500 mt-1">
                  Total Spent: ₹{g.totalSpent || 0}
                </div>
              </motion.li>
            ))}
          </ul>
        )}

        {/* Spacer so scroll definitely works */}
        <div className="h-40" />
      </div>
    </div>
  );
};

export default Groups;
