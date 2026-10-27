import express from 'express'
import { getAllAiChatMessages } from '../../controllers/AiMessages/aiMessages.js';
import userAuthentication from '../../middlewares/Auth/auth.js'

const aiMsgsRouter = express.Router();

// FOR GET ALL AI CHAT MESSAGES API:
aiMsgsRouter.route('/').get(userAuthentication, getAllAiChatMessages);


export default aiMsgsRouter;