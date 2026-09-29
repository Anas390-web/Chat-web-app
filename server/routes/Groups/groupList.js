import express from 'express';
import userAuthentication from '../../middlewares/Auth/auth.js'
import { creatAGroup, allGroups } from '../../controllers/Groups/groupList.js';

const groupsRouter = express.Router();

groupsRouter.route('/').post(userAuthentication, creatAGroup)
groupsRouter.route('/').get(userAuthentication, allGroups)

export default groupsRouter;