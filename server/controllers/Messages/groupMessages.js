import { StatusCodes } from 'http-status-codes'
import Message from '../../models/Messages/Message.js'

const allGroupMessages = async (req, res) => {
   try {
      // GROUP CONVERSATION ID FROM CLIENT:
      const { groupId } = req.body;
      // IF GROUP ID IS NOT GIVEN, SEND BACK BAD REQUEST ERROR:
      if (!groupId) {
         console.log('Bad Request Error: Group conversation id is not given by the user.');
         return res.status(StatusCodes.BAD_REQUEST).json({
            msg: 'BAD_REQUEST: GROUP CONVERSATION ID IS NOT SENT'
         })
      }
      // FIND ALL THE GROUP CONVERSATION ID MESSAGES:
      const groupMessagesDocs = await Message.find({ conversationId: groupId }).populate({
            path: 'senderId',
            select: 'username'
         })
      
      // IF GROUP MESSAGES WERE NOT FOUND, SEND BACK INTERNAL SERVER ERROR:
      if(!groupMessagesDocs) {
         console.log('Error occurred while finding the Group conversation id messages');
         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            msg: 'INTERNAL_SERVER_ERROR'
         })
      }

      // RESPOND WITH ALL GROUP CONVERSATION ID MESSAGES DOCUMENTS:
      res.status(StatusCodes.OK).json({
         msg: 'Messages found',
         groupMessagesDocs
      })

   } catch (error) {
      console.log('Error occurred while finding group messages ', error.Message);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
         msg: 'INTERNAL_SERVER_ERROR'
      })
   }
}

export { allGroupMessages }