import Participant from "../models/Participants.js";
import Group from "../models/Group.js";
import Expense from "../models/Expense.js";

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

export const updateParticipantName = async (req, res) => {
  const { participantId } = req.params;
  const { name } = req.body;

  try {
    const participant = await Participant.findById(participantId);
    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    participant.name = name;
    await participant.save();

    res.json(participant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeParticipant = async (req, res) => {
  const { participantId } = req.params;

  try {
    const expenseCount = await Expense.countDocuments({
      $or: [
        { payer: participantId },
        { "splits.participantId": participantId }
      ]
    });

    if (expenseCount > 0) {
      return res.status(400).json({
        message: "Cannot delete participant with linked expenses"
      });
    }

    const participant = await Participant.findByIdAndDelete(participantId);
    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    await Group.findByIdAndUpdate(participant.groupId, {
      $pull: { participants: participantId }
    });

    res.json({ message: "Participant removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
