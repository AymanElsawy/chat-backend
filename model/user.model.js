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
    chatList:[
        {
          receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
          },
          messageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
          }
        }
    ]
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

export default mongoose.model("User", userSchema); // User
