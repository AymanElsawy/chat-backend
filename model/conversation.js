import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    members: [
        {
            sneder: {
                type:mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            receiver: {
                type:mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }
    ],
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
            isRead: {type:Boolean,default:false},
            createdAt: {type:Date,default:Date.now()}
        }
    ]
        
    
});

export default mongoose.model("Conversation", conversationSchema);