import { StatusCodes } from "http-status-codes";
import Message from "../../models/Messages/Message.js";
import Conversation from '../../models/Conversations/Conversation.js'

const allMessages = async (req, res) => {
   try {
      const conversationData = req.body;
      if (!conversationData) {
         res.status(StatusCodes.BAD_REQUEST).json({
            msg: 'Bad Request Error: No conversation data was given'
         })
      }
      const allMessagesDocs = await Message.find(
         { conversationId: conversationData.conversationId }
      ).populate({
         path: 'senderId',
         select: 'username'
      })
      if (!allMessagesDocs) {
         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            msg: 'Internal server error'
         })
      }
      res.status(StatusCodes.OK).json({
         allMessagesDocs
      })
   } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
         msg: 'Internal server error'
      })
   }
}

// THIS GETS ALL THE MESSAGES BUT IN DESCENDING ORDER OF TIMESTAMPS SO LATEST MESSAGE GETS SORTED OUT:
const findLatestChatMessage = async (req, res) => {
   try {
      // DE-STRUCTURE FROM USER AUTHENTICATION:
      const { userId } = req.user;

      // FIND CONVERSATION IDS WHERE THE LOG-IN USER IS A PARTICIPANT:
      const conversationIds = await Conversation.find(
         {
            isGroup: false,
            participants: userId
         }
      ).select("_id");

      // GET ALL THE MESSAGES WITH DESCENDING ORDER OF CREATED AT TIME STAMP OF THE CONVERSATION IDS WHERE USER IS A PARTICIPANT:
      const messages = await Message.find(
         { conversationId: { $in: conversationIds } }
      ).sort({ createdAt: -1 }).select("-seenBy -updatedAt");
      
      // IF NO MESSAGE FOUND, SEND BACK ERROR:
      if(messages.length < 1) {
         return res.status(StatusCodes.NOT_FOUND).json({
            msg: 'NO MESSAGE FOUND'
         })
      }
      // SEND BACK THE MESSAGES ARRAY WITH DESCENDING ORDER OF CREATED AT TIME STAMP:
      res.status(StatusCodes.OK).json({
         msg: 'MESSAGES FOUND',
         messages
      })

   } catch (error) {
      console.log('ERROR OCCURRED DURING FINDING MESSAGES:', error.message)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
         msg: 'INTERNAL_SERVER_ERROR'
      })
   }
}

export { allMessages, findLatestChatMessage }