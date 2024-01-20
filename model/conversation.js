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
    ]
        
    
});

export default mongoose.model("Conversation", conversationSchema);