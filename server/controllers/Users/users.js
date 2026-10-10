import { BadRequestError, UnauthenticatedError } from '../../errors/customApiErrors.js';
import { StatusCodes } from 'http-status-codes'
import User from '../../models/Users/User.js'
import Conversation from '../../models/Conversations/Conversation.js'

const registerUser = async (req, res) => {
   try {
      const { username, email, password } = req.body;
      // IF ANY USER DATA IS NOT PRESENT, THROW AN ERROR:
      if (!username || !email || !password) {
         return res.status(StatusCodes.BAD_REQUEST).json({
            msg: 'Please provide username, email and password'
         })
      }
      // FIND USER IF IT ALREADY EXISTS:
      const existingUser = await User.findOne(
         {
            $or: [
               { username: username },
               { email: email }
            ]
         }
      )
      // IF USERNAME IS ALREADY TAKEN, SEND BACK ERROR:
      if (existingUser) {
         if (existingUser.username === username) {
            return res.status(StatusCodes.CONFLICT).json({
               msg: 'USERNAME ALREADY EXISTS'
            })
         }
      }
      // IF EMAIL IS ALREADY TAKEN, SEND BACK ERROR:
      if (existingUser) {
         if (existingUser.email === email) {
            return res.status(StatusCodes.CONFLICT).json({
               msg: 'EMAIL ALREADY EXISTS'
            })
         }
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
      const user = await User.findOne({ email });

      // CHECK IF USER DOES NOT EXIST OR DELETED:
      if (!user || user.accountStatus === 'deletedUser' || user.isDeleted === true) {
         console.log('User does not exist');
         return res.status(StatusCodes.UNAUTHORIZED).json({
            msg: 'INVALID CREDENTIALS'
         })
      };

      // CHECK IF USER IN NOT DELETED:
      if (!user.password) {
         res.status(StatusCodes.UNAUTHORIZED).json({
            msg: 'INVALID CREDENTIALS'
         })
      }
      // VERIFY PASSWORD:
      const isPasswordCorrect = await user.comparePassword(password);
      if (!isPasswordCorrect) {
         return res.status(StatusCodes.UNAUTHORIZED).json({
            msg: 'INVALID CREDENTIALS'
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
      // DE-STRUCTURE USER ID FROM THE AUTHENTICATION PAYLOAD:
      const { userId } = req.user;
      // FIND ALL THE USER FROM THE DB:
      const allUsers = await User.find({}).select('username email');
      if (!allUsers) {
         console.log('Users does not exist!');
         return res.status(StatusCodes.NOT_FOUND).json({
            msg: 'Users do not exist'
         })
      }
      // SEND BACK THE ALL THE USERS EXCEPT YOURSELF:
      const allUsersExceptCurrent = allUsers.filter((user) => {
         const isUserDeleted = user.username.split("_")[0] !== 'deleted'
         return String(user._id) !== userId && isUserDeleted;
      })

      res.status(StatusCodes.OK).json({
         allUsersExceptCurrent
      })
      // RESPOND WITH ALL THE USERS WITH ONLY THEIR USERNAME
   } catch (error) {
      console.log(error.message);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
         msg: 'Internal server error'
      })
   }
}

// SEND BACK THE SELECTED USER TO CHAT WITH DATA:
const getUserToChatWithData = async (req, res) => {
   try {
      // DE-STRUCTURE USER TO CHAT WITH ID FROM THE ROUTE PARAMS:
      const { userToChatWithId } = req.params;
      // IF CHAT USER ID NOT GIVEN, SEND BACK BAD REQUEST ERROR:
      if (!userToChatWithId) {
         console.log('Error: Chat user id is not given.')
         return res.status(StatusCodes.BAD_REQUEST).json({
            msg: 'BAD REQUEST ERROR: Please provide the chat user Id'
         })
      }
      // FIND THE REQUESTED USER DATA:
      const userToChatWith = await User.findOne(
         {
            _id: userToChatWithId
         }
      ).select("-password -accountStatus");

      // IF REQUESTED USER DOES NOT EXIST:
      if (!userToChatWith) {
         console.log('Requested user does not exist');
         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            msg: 'THIS USER DOES NOT EXIST'
         })
      }
      // FINAL RESPONSE TO THE CLIENT WITH THE REQUESTED USER WITHOUT PASSWORD:
      res.status(StatusCodes.OK).json({
         chatUserData: userToChatWith
      })

   } catch (error) {
      console.log('Error occured in server while finding the requested user data:', error.message)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
         msg: 'INTERNAL_SERVER_ERROR'
      })
   }
}

// SEND BACK THE SELECTED GROUP DATA:
const getSelectedGroupData = async (req, res) => {
   try {
      // DE-STRUCTURE SELECTED GROUP TO CHAT IN ID FROM THE ROUTE PARAMS:
      const { selectedGroupId } = req.params;
      // IF CHAT USER ID NOT GIVEN, SEND BACK BAD REQUEST ERROR:
      if (!selectedGroupId) {
         console.log('Error: Selected group id is not given.')
         return res.status(StatusCodes.BAD_REQUEST).json({
            msg: 'BAD REQUEST ERROR: Please provide the selected group id'
         })
      }
      // FIND THE REQUESTED USER DATA:
      const selectedGroupData = await Conversation.findOne(
         {
            _id: selectedGroupId
         }
      );

      // IF REQUESTED GROUP DOES NOT EXIST:
      if (!selectedGroupData) {
         console.log('Requested group does not exist');
         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            msg: 'THIS GROUP DOES NOT EXIST'
         })
      }

      // POPULATING THE GROUP DATA:
      await selectedGroupData.populate({
         path: 'participants admin',
         select: 'username'
      })

      // FINAL RESPONSE TO THE CLIENT WITH THE REQUESTED USER WITHOUT PASSWORD:
      res.status(StatusCodes.OK).json({
         selectedGroupData
      })

   } catch (error) {
      console.log('Error occured in server while finding the requested group data:', error.message)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
         msg: 'INTERNAL_SERVER_ERROR'
      })
   }
}

const setAvatarUrl = async (req, res) => {
   try {
      // DE-STRUCTURE USER ID FROM USER AUTHENTICATION:
      const { userId } = req.user;
      if (!userId || userId.length < 1) {
         console.log('Error: User Id in invalid');
         return res.status(StatusCodes.UNAUTHORIZED).json({
            msg: 'UNAUTHORIZED: Provide a valid Id'
         })
      }
      // DE-STRUCTURE AVATAR URL FROM CLIENT:
      const { avatarUrl } = req.body;
      if (!avatarUrl || avatarUrl.length < 1) {
         return res.status(StatusCodes.BAD_REQUEST).json({
            msg: 'BAD_REQUEST ERROR: Please provide avatar url!'
         })
      }
      // FIND THE USER:
      const userAvatar = await User.findOneAndUpdate(
         { _id: userId },
         { $set: { userAvatarUrl: avatarUrl } },
         { returnDocument: 'after', runValidators: true }
      ).select("userAvatarUrl")
      if (!userAvatar || userAvatar.userAvatarUrl === null) {
         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            msg: 'Problem occurred while updating the user avatar, try again later'
         })
      }
      res.status(StatusCodes.OK).json({
         msg: 'Avatar updated',
         userAvatar
      })
   } catch (error) {
      console.log('Error occurred while updating the user Avatar', error.message)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
         msg: 'INTERNAL_SERVER_ERROR'
      })
   }
}

const getLoggedInUserData = async (req, res) => {
   try {
      // DE-STRUCTURE USER ID FROM USER AUTHENTICATION:
      const { userId } = req.user;

      // FIND THE LOGGED IN USER DATA:
      const userData = await User.findOne(
         { _id: userId }
      ).select("username userAvatarUrl")

      // IF IT DOES NOT EXIST, SEND BACK ERROR:
      if (!userData) {
         return res.status(StatusCodes.BAD_REQUEST).json({
            msg: 'ERROR: USER DOES NOT EXIST'
         })
      }

      // FINAL RESPONSE WITH USER DATA:
      res.status(StatusCodes.OK).json({
         msg: 'USER FOUND',
         userData
      })
   } catch (error) {
      console.log('Error while finding the login user:', error.message);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
         msg: 'INTERNAL_SERVER_ERROR'
      })
   }
}

const updateUsernameAndAvatar = async (req, res) => {
   try {
      // DE-STRUCTURE USER ID FROM USER AUTHENTICATION:
      const { userId } = req.user;
      // DATA FROM CLIENT REQUEST BODY:
      const userData = req.body;
      const updateData = {};
      if (userData.name) {
         updateData.username = userData.name;
      }
      if (userData.avatarUrl) {
         updateData.userAvatarUrl = userData.avatarUrl;
      }
      // UPDATE THE USER DATA:
      const updatedUserData = await User.findOneAndUpdate(
         { _id: userId },
         {
            $set: updateData
         },
         { returnDocument: 'after', runValidators: true }
      ).select("username userAvatarUrl");

      console.log(updatedUserData);
      // IF IT DOES NOT EXIST, SEND BACK ERROR:
      if (!updatedUserData) {
         return res.status(StatusCodes.BAD_REQUEST).json({
            msg: 'ERROR: USER DOES NOT EXIST'
         })
      }

      // FINAL RESPONSE WITH USER DATA:
      res.status(StatusCodes.OK).json({
         msg: 'USER UPDATED',
         updatedUserData
      })

   } catch (error) {
      console.log('Error while updating the user data:', error.message);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
         msg: 'INTERNAL_SERVER_ERROR'
      })
   }
}

const deleteLoginUser = async (req, res) => {
   try {
      // DE-STRUCTURE USER ID FROM USER AUTHENTICATION:
      const { userId } = req.user;
      console.log(userId);
      // UPDATE THE LOGIN USER ACCOUNT FIELD WITH DELETED OR NULL VALUES:
      const deletedAccount = await User.findOneAndUpdate(
         {
            _id: userId
         },
         {
            $set: {
               username: `deleted_user_${userId}`,
               email: `deleted_user_${userId}@deleted.com`,
               password: null,
               userAvatarUrl: null,
               accountStatus: 'deletedUser',
               isDeleted: true
            }
         },
         {
            returnDocument: 'after', runValidators: false
         }
      )

      // LOG AN ERROR IF ACCOUNT WAS NOT DELETED:
      if (!deletedAccount) {
         console.log('COULD NOT DELETE LOGGED-IN USER ACCOUNT');
         return;
      }

      // SEND BACK THE FINAL RESPONSE WITH MSG OF THE REMOVAL OF USER:
      res.status(StatusCodes.OK).json({
         msg: 'USER HAS BEEN REMOVED'
      })

   } catch (error) {
      console.log('ERROR OCCURED DURING THE REMOVAL OF USER ACCOUNT INFORMATION:', error.message);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
         msg: 'INTERNAL_SERVER_ERROR'
      })
   }
}

export { registerUser, loginUser, getAllUsers, getUserToChatWithData, getSelectedGroupData, setAvatarUrl, getLoggedInUserData, updateUsernameAndAvatar, deleteLoginUser }