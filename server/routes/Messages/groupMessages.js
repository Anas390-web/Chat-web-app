import express from 'express'
import userAuthentication from '../../middlewares/Auth/auth.js';
import { allGroupMessages } from '../../controllers/Messages/groupMessages.js';

const groupMessagesRouter = express.Router();

groupMessagesRouter.route('/').post(userAuthentication, allGroupMessages)

export default groupMessagesRouter;