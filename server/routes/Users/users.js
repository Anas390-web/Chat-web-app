import express from 'express'
import { registerUser, loginUser } from '../../controllers/Users/users.js';

const authRouter = express.Router();

authRouter.route('/register').post(registerUser);
authRouter.route('/login').post(loginUser);


export default authRouter