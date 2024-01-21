import Conversation from "../model/conversation.js";
import User from '../model/user.model.js';
import { StatusCodes } from "http-status-codes";


export function sendMessage(req, res) {
    let newConversation = false; // flag to indicate if the conversation is new
    const filter = { // filter to find the conversation
      $or: [
        {
          "members.sneder": req.user.id,
          "members.receiver": req.params.id,
        },
        {
          "members.sneder": req.params.id,
          "members.receiver": req.user.id,
        },
      ],
    };
  
    const update = { // update to add the new message
      $push: {
        "messages": {
          sneder: req.user.id,
          receiver: req.params.id,
        //   snderName: req.user.username,
        //   receiverName: req.params.username,
          text: req.body.message,
        },
      },
    };
  
    // Check if the conversation exists before pushing new members
    Conversation.findOne(filter) // find the conversation
      .then(async(existingConversation) => { // check if the conversation exists
        
        if (!existingConversation) {
          // If the conversation doesn't exist, add new members
          update.$addToSet = {
            "members": {
              sneder: req.user.id,
              receiver: req.params.id,
            },
          };
          newConversation = true;
        }
        
        // Use findOneAndUpdate to update or create the conversation
        return Conversation.findOneAndUpdate(filter, update, {
          upsert: true,
          new: true,
        });
      })
      .then(async(result) => {
        if (!result) {
          return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Something went wrong" }); // return error response if conversation is not found
        }
        if(newConversation){ // if the conversation is new
            const updateUserConversations = await User.findByIdAndUpdate(req.user.id, { // update the user's conversations
                $push: {
                    conversations: {
                        receiverId: req.params.id,
                        messageId: result._id
                    }
                }
            })
            const updateReceiverConversations = await User.findByIdAndUpdate(req.params.id, { // update the receiver's conversations
                $push: {
                    conversations: {
                        receiverId: req.user.id,
                        messageId: result._id
                    }
                }
            })
        }

         res.status(StatusCodes.OK).json({ message: "Message sent", conversation: result }) ; // return success response
      })
      .catch((err) => {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err }); // return error response
      });
  }

  export function getConversation(req,res){
    const receiverId = req.params.receiver; // extract receiver id from request
    const senderId = req.user.id; // extract sender id from request

    Conversation.findOne({ // find the conversation
      $or:[
        {"members.sneder": senderId, "members.receiver": receiverId},
        {"members.sneder": receiverId, "members.receiver": senderId}
      ]
    }).then((result) => {
        if (!result) { // check if conversation exists
            return res
              .status(StatusCodes.NOT_FOUND)
              .json({ message: "Conversation not found" }); // return error response if conversation is not found
          }
          return res.status(StatusCodes.OK).json(result) // return success response
    }).catch((err) => {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err }); // return error response
    });
  }
  