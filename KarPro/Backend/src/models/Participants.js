import mongoose from "mongoose";

const participantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Participant", participantSchema);
