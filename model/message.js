import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation"
    },
    sender: {
       String
    },
    receiver: {
       String
    },
    messages:[
        {
            text: String,
            sender: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            receiver: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            snederName: String,
            receiverName: String,
            isRead: {type:Boolean,default:false},
            createdAt: {type:Date,default:Date.now()}
        }
    ]
});

export default mongoose.model("Message", messageSchema);