import express from 'express'
import { registerUser } from '../../controllers/Users/users.js';

const authRouter = express.Router();

authRouter.route('/register').post(registerUser);


export default authRouter