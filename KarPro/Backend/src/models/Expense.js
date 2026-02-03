import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    description: {
      type: String
    },

    date: {
      type: Date,
      default: Date.now
    },

    payer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Participant",
      required: true
    },
    

    splitType: {
      type: String,
      enum: ["equal", "custom", "percentage"],
      required: true
    },

    category: {
  type: String,
  default: "Other"
},

    splits: [
      {
        participantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Participant",
          required: true
        },
        amount: {
          type: Number,
          required: true
        }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);
