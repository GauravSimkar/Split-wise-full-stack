import Group from "../models/Group.js";
import Participant from "../models/Participants.js";
import Expense from "../models/Expense.js";

/**
 * CREATE GROUP
 */
export const createGroup = async (req, res) => {
  const { name, participants = [] } = req.body;

  try {
    if (participants.length > 3) {
      return res
        .status(400)
        .json({ message: "Max 3 participants allowed" });
    }

    const group = await Group.create({
      name,
      primaryUser: req.user._id,
      totalSpent: 0
    });

    const participantDocs = await Participant.insertMany(
      participants.map((p) => ({
        name: p.name,
        avatar: p.avatar,
        groupId: group._id
      }))
    );

    group.participants = participantDocs.map((p) => p._id);
    await group.save();

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL GROUPS OF LOGGED-IN USER
 */
export const getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      primaryUser: req.user._id
    });

    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET SINGLE GROUP + PARTICIPANTS
 */
export const getGroupById = async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const participants = await Participant.find({ groupId });

    res.json({
      ...group.toObject(),
      participants
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE GROUP NAME
 */
export const updateGroupName = async (req, res) => {
  const { groupId } = req.params;
  const { name } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.primaryUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    group.name = name;
    await group.save();

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ADD PARTICIPANT
 */
export const addParticipant = async (req, res) => {
  const { groupId } = req.params;
  const { name } = req.body;

  try {
    const group = await Group.findById(groupId).populate("participants");
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.participants.length >= 3) {
      return res
        .status(400)
        .json({ message: "Max 3 participants allowed" });
    }

    const duplicate = group.participants.find(
      (p) => p.name.toLowerCase() === name.toLowerCase()
    );
    if (duplicate) {
      return res
        .status(400)
        .json({ message: "Participant already exists" });
    }

    const participant = await Participant.create({
      name,
      groupId
    });

    group.participants.push(participant._id);
    await group.save();

    res.status(201).json(participant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * REMOVE PARTICIPANT (WITH SAFETY)
 */
export const removeParticipant = async (req, res) => {
  const { groupId, participantId } = req.params;

  try {
    // 🔴 check if participant used in ANY expense
    const expenseCount = await Expense.countDocuments({
      $or: [
        { payer: participantId },
        { "splits.participantId": participantId }
      ]
    });

    if (expenseCount > 0) {
      return res.status(400).json({
        message:
          "Cannot remove participant. This participant is linked to existing expenses."
      });
    }

    // remove participant
    await Participant.findByIdAndDelete(participantId);

    // remove reference from group
    await Group.findByIdAndUpdate(groupId, {
      $pull: { participants: participantId }
    });

    res.json({ message: "Participant removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * DELETE GROUP (CASCADE)
 */
export const deleteGroup = async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.primaryUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Expense.deleteMany({ groupId });
    await Participant.deleteMany({ groupId });
    await Group.findByIdAndDelete(groupId);

    res.json({ message: "Group deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GROUP SUMMARY (TOTAL + BALANCES)
 */
export const getGroupSummary = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const participants = await Participant.find({ groupId });
    const expenses = await Expense.find({ groupId });

    const balancesMap = {};
    participants.forEach((p) => {
      balancesMap[p._id.toString()] = {
        participantId: p._id,
        name: p.name,
        balance: 0
      };
    });

    expenses.forEach((expense) => {
      if (!expense || !expense.amount) return;

      if (
        expense.payer &&
        balancesMap[expense.payer.toString()]
      ) {
        balancesMap[expense.payer.toString()].balance += expense.amount;
      }

      if (Array.isArray(expense.splits)) {
        expense.splits.forEach((s) => {
          if (
            s.participantId &&
            balancesMap[s.participantId.toString()]
          ) {
            balancesMap[s.participantId.toString()].balance -=
              s.amount || 0;
          }
        });
      }
    });

    res.json({
      groupId: group._id,
      groupName: group.name,
      totalSpent: group.totalSpent || 0,
      balances: Object.values(balancesMap)
    });
  } catch (error) {
    console.error("❌ GROUP SUMMARY ERROR:", error);
    res.status(500).json({
      message: "Internal Server Error in group summary"
    });
  }
};

// UPDATE PARTICIPANT NAME
export const updateParticipant = async (req, res) => {
  const { participantId } = req.params;
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Name is required" });
  }

  try {
    const participant = await Participant.findById(participantId);
    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    participant.name = name.trim();
    await participant.save();

    res.json(participant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
