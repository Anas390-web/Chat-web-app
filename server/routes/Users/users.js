import express from 'express'
import { registerUser, loginUser, getAllUsers } from '../../controllers/Users/users.js';
import userAuthentication from '../../middlewares/Auth/auth.js';

const authRouter = express.Router();

authRouter.route('/register').post(registerUser);
authRouter.route('/login').post(loginUser);
authRouter.route('/').get(userAuthentication, getAllUsers);


export default authRouter