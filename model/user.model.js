import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    conversations:[
        {
          receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
          },
          messageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation"
          }
        }
    ]
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

export default mongoose.model("User", userSchema); // User
