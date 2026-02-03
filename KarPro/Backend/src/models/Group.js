import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    primaryUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Participant"
      }
    ],
    totalSpent: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("Group", groupSchema);
