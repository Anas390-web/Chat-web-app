import AiConversation from '../../models/AiConversation/AiConversation.js'
import AiMessage from '../../models/AiMessages/AiMessages.js'
import { StatusCodes } from 'http-status-codes'

// GET ALL AI CHAT MESSAGES API CALLBACK:
const getAllAiChatMessages = async (req, res) => {
   try {
      // DE-STRUCTURE THE USER ID FROM USER AUTH:
      const { userId } = req.user;

      // FIND THE CONVERSATION THAT USER IS INVOLVED IN:
      const aiChatConversation = await AiConversation.findOne(
         { senderId: userId }
      )

      // IF THERE IS NO EXISTING CONVERSATION:
      if(aiChatConversation.length < 1) {
         return res.status(StatusCodes.BAD_REQUEST).json({
            msg: 'NO CONVERSATION WITH THIS USER ID EXISTS'
         })
      }

      // FIND ALL THE AI CHAT MESSAGES:
      const allAiChatMessages = await AiMessage.find(
         {
            aiConversationId: aiChatConversation._id
         }
      );
      
      // IF THERE ARE NO EXISTING MESSAGES:
      if (allAiChatMessages.length < 1) {
         return res.status(StatusCodes.NOT_FOUND).json({
            msg: 'NO MESSAGES FOUND'
         })
      };
      
      // RESPOND WITH ALL THE MESSAGES:
      res.status(StatusCodes.OK).json({
         msg: 'MESSAGES FOUND',
         allAiChatMessages
      })
   } catch (error) {
      console.log('ERROR OCCURED DURING GETTING ALL AI CHAT MESSAGES:', error.message);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
         msg: 'INTERNAL_SERVER_ERROR'
      })
   }
}

export { getAllAiChatMessages }