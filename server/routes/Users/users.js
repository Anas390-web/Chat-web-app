import express from 'express'
import { registerUser, loginUser, getAllUsers, getUserToChatWithData, getSelectedGroupData, setAvatarUrl } from '../../controllers/Users/users.js';
import userAuthentication from '../../middlewares/Auth/auth.js';

const authRouter = express.Router();

authRouter.route('/register').post(registerUser);
authRouter.route('/login').post(loginUser);
authRouter.route('/profile').put(userAuthentication, setAvatarUrl);
authRouter.route('/').get(userAuthentication, getAllUsers);
authRouter.route('/:userToChatWithId').get(userAuthentication, getUserToChatWithData);
authRouter.route('/groups/:selectedGroupId').get(userAuthentication, getSelectedGroupData);


export default authRouter