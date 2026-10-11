import express from 'express'
import { registerUser, loginUser, getAllUsers, getUserToChatWithData, getSelectedGroupData, setAvatarUrl, getLoggedInUserData, updateUsernameAndAvatar, searchUsers, searchGroups, deleteLoginUser } from '../../controllers/Users/users.js';
import userAuthentication from '../../middlewares/Auth/auth.js';

const authRouter = express.Router();

// TO REGISTER THE USER:
authRouter.route('/register').post(registerUser);
// TO LOG-IN THE USER:
authRouter.route('/login').post(loginUser);
// TO UPDATE THE USER AVATAR:
authRouter.route('/profile').put(userAuthentication, setAvatarUrl);
// TO GET ALL THE USERS:
authRouter.route('/').get(userAuthentication, getAllUsers);
// TO GET THE SEARCHED USERS BY CLIENT:
authRouter.route('/searchUsers').get(userAuthentication, searchUsers);
// TO GET THE SEARCHED GROUPS BY CLIENT:
authRouter.route('/searchGroups').get(userAuthentication, searchGroups);
// TO GET THE LOGGED IN USER DATA:
authRouter.route('/loggedInUserData').get(userAuthentication, getLoggedInUserData);
// TO GET THE SELECTED USER TO CHAT WITH DATA:
authRouter.route('/:userToChatWithId').get(userAuthentication, getUserToChatWithData);
// TO GET THE SELECTED GROUP TO CHAT IN DATA:
authRouter.route('/groups/:selectedGroupId').get(userAuthentication, getSelectedGroupData);
// TO UPDATE THE USER PROFILE:
authRouter.route('/settings').put(userAuthentication, updateUsernameAndAvatar);
// TO UPDATE LOGGED-IN USER WITH DELETED STATUS AND INFO:
authRouter.route('/deleteMe').delete(userAuthentication, deleteLoginUser);


export default authRouter