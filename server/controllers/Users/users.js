import { BadRequestError, UnauthenticatedError } from '../../errors/customApiErrors.js';
import { StatusCodes } from 'http-status-codes'
import User from '../../models/Users/User.js'

const registerUser = async (req, res) => {
   try {
      const { username, email, password } = req.body;
      // IF ANY USER DATA IS NOT PRESENT, THROW AN ERROR:
      if (!username || !email || !password) {
         return res.status(StatusCodes.BAD_REQUEST).json({
            msg: 'Please provide username, email and password'
         })
      }
      // SAVE USER DATA TO DB:
      const user = await User.create({
         username,
         email,
         password
      })
      // CREATE THE JWT TOKEN:
      const token = user.createJwt();
      if (!token) {
         console.log('Token is not created')
      }
      // RESPONDING TO REQUEST:
      res.status(StatusCodes.CREATED).json({
         msg: 'User is created',
         username: user.username,
         token
      })

   } catch (error) {
      console.log(error.message);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
         msg: 'Internal server error, Please try again later'
      })
   }
}

const loginUser = async (req, res) => {
   try {
      const { email, password } = req.body;
      if (!email || !password) {
         return res.status(StatusCodes.BAD_REQUEST).json({
            msg: 'Please provide email and password'
         })
      }
      // FIND THE USER FROM DB
      const user = await User.findOne({ email })
      if (!user) {
         console.log('User does not exist');
         return res.status(StatusCodes.BAD_REQUEST).json({
            msg: 'Invalid credentials'
         })
      }
      // VERIFY PASSWORD:
      const isPasswordCorrect = await user.comparePassword(password);
      if (!isPasswordCorrect) {
         return res.status(StatusCodes.UNAUTHORIZED).json({
            msg: 'Invalid credentials'
         })
      }
      // CREATION OF TOKEN:
      const token = user.createJwt();

      // RESPOND THE API REQUEST WITH THE TOKEN:
      res.status(StatusCodes.OK).json({
         user: {
            username: user.username,
            email: user.email
         },
         token
      })
   } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
         msg: 'Internal server error'
      })
   }
}

// SEND BACK ALL USERS TO BE LISTED IN THE DASHBOARD:
const getAllUsers = async (req, res) => {
   try {
      // FIND ALL THE USER FROM THE DB:
      const allUsers = await User.find({}).select('username email');
      if (!allUsers) {
         console.log('Users does not exist!');
         return res.status(StatusCodes.NOT_FOUND).json({
            msg: 'Users do not exist'
         })
      }
      res.status(StatusCodes.OK).json({
         allUsers
      })
      // RESPOND WITH ALL THE USERS WITH ONLY THEIR USERNAME
   } catch (error) {
      console.log(error.message);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
         msg: 'Internal server error'
      })
   }
}

export { registerUser, loginUser, getAllUsers }