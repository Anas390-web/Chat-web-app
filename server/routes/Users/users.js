import express from 'express'
import { registerUser, loginUser, getAllUsers, getUserToChatWithData, getSelectedGroupData, setAvatarUrl, getLoggedInUserData, updateUsernameAndAvatar, deleteLoginUser } from '../../controllers/Users/users.js';
import userAuthentication from '../../middlewares/Auth/auth.js';

const authRouter = express.Router();

authRouter.route('/register').post(registerUser);
authRouter.route('/login').post(loginUser);
authRouter.route('/profile').put(userAuthentication, setAvatarUrl);
authRouter.route('/').get(userAuthentication, getAllUsers);
authRouter.route('/loggedInUserData').get(userAuthentication, getLoggedInUserData);
authRouter.route('/:userToChatWithId').get(userAuthentication, getUserToChatWithData);
authRouter.route('/groups/:selectedGroupId').get(userAuthentication, getSelectedGroupData);
authRouter.route('/settings').put(userAuthentication, updateUsernameAndAvatar);
authRouter.route('/deleteMe').delete(userAuthentication, deleteLoginUser);


export default authRouter