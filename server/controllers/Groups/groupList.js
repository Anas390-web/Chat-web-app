import { StatusCodes } from "http-status-codes";
import Conversation from '../../models/Conversations/Conversation.js'

const creatAGroup = async (req, res) => {
   try {
      // FROM THE CLIENT:
      const groupDetails = req.body;
      // FROM USER AUTHENTICATION:
      const { userId } = req.user;

      if(!groupDetails) {
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
         { $addToSet : {participants: {$each: selectedUsersIds}}},
         {
            upsert: true,
            returnDocument: 'after',
            runValidators: true
         }
      )
      // IF GROUP IS NOT CREATED, SEND ERROR:
      if(!group) {
         console.log('Error: Group was not created')
         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            msg: 'INTERNAL_SERVER_ERROR'
         })
      }
      console.log(group);
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


export { creatAGroup }