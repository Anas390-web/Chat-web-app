import { StatusCodes } from "http-status-codes";
import Conversation from '../../models/Conversations/Conversation.js'

// TO CREATE A GROUP IN DB:
const creatAGroup = async (req, res) => {
   try {
      // FROM THE CLIENT:
      const groupDetails = req.body;
      // FROM USER AUTHENTICATION:
      const { userId } = req.user;

      if (!groupDetails) {
         return res.status(StatusCodes.BAD_REQUEST).json({
            msg: 'Error: No group details were found. Try again!'
         })
      }

      // TO ONLY HAVE THE SELECTED USERS IDS ARRAY:
      const selectedUsers = groupDetails.selectedUsers;
      const selectedUsersIds = selectedUsers.map((user) => {
         return user._id;
      });
      // ADD THE ADMIN USER ID:
      selectedUsersIds.push(userId);

      // CREATING AND UPDATING A GROUP
      const group = await Conversation.findOneAndUpdate(
         {
            admin: userId,
            groupName: groupDetails.groupName,
            isGroup: true
         },
         { $addToSet: { participants: { $each: selectedUsersIds } } },
         {
            upsert: true,
            returnDocument: 'after',
            runValidators: true
         }
      )
      // IF GROUP IS NOT CREATED, SEND ERROR:
      if (!group) {
         console.log('Error: Group was not created')
         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            msg: 'INTERNAL_SERVER_ERROR'
         })
      }
      // RESPOND BACK TO THE REQUEST:
      res.status(StatusCodes.CREATED).json({
         msg: 'Group was created successfully'
      })
   } catch (error) {
      console.log(error.message);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
         msg: 'INTERNAL_SERVER_ERROR'
      })
   }
}

// TO FIND ALL THE GROUPS WHICH INVOLVES THE LOGGED-IN USER AND SEND BACK TO THE USER:
const allGroups = async (req, res) => {
   try {
      // FROM USER AUTHETICATION:
      const { userId } = req.user;
      // FIND ALL THE GROUPS AND POPULATE THE PARTICIPANTS WITH THEIR USERNAME:
      const groups = await Conversation.find(
         {
            isGroup: true,
            participants: userId
         }
      ).populate({
         path: 'participants',
         select: 'username'
      })
      // RESPOND WITH ERROR IF GROUPS WERE NOT FOUND:
      if (groups.length < 1) {
         console.log('Error: Groups were not found');
         return res.status(StatusCodes.BAD_REQUEST).json({
            msg: 'ERROR: NO GROUPS FOUND'
         })
      }
      // RESPONSE TO THE REQUEST WITH THE GROUPS ARRAY IN WHICH USE IS INVOLVED:
      res.status(StatusCodes.OK).json({
         msg: 'OK',
         groups
      })
   } catch (error) {
      console.log(error.message);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
         msg: 'INTERNAL_SERVER_ERROR'
      })
   }
}

export { creatAGroup, allGroups }