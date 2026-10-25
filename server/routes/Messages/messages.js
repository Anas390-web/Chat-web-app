import express from 'express'
import { allMessages, findLatestChatMessage } from '../../controllers/Messages/messages.js';
import userAuthentication from '../../middlewares/Auth/auth.js';

const messageRouter = express.Router();

messageRouter.route('/').post(userAuthentication, allMessages)
messageRouter.route('/latest').get(userAuthentication, findLatestChatMessage)

export default messageRouter;