import { StatusCodes } from "http-status-codes";
import Message from "../../models/Messages/Message.js";

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
      )
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

export { allMessages }