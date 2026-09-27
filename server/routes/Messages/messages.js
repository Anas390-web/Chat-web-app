import express from 'express'
import { allMessages } from '../../controllers/Messages/messages.js';
import userAuthentication from '../../middlewares/Auth/auth.js';

const messageRouter = express.Router();

messageRouter.route('/').post(userAuthentication, allMessages)

export default messageRouter;