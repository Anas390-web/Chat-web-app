import express from 'express';
import userAuthentication from '../../middlewares/Auth/auth.js'
import { creatAGroup } from '../../controllers/Groups/groupList.js';

const groupsRouter = express.Router();

groupsRouter.route('/').post(userAuthentication, creatAGroup)

export default groupsRouter;