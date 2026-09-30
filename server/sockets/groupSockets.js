import Conversation from "../models/Conversations/Conversation.js";


const joinGroupRoom = (socket) => {
   socket.on("join-group-room", async () => {
      try {
         const { userId } = socket.user;

         // GET ALL THE GROUPS WHERE THE LOGGED-IN USER IS A PARTICIPANT:
         const groups = await Conversation.find(
            {
               isGroup: true,
               participants: userId
            }
         )
         // IF GROUPS WERE NOT FOUND, SEND BACK ERROR MESSAGE:
         if (groups.length < 1) {
            console.log('Error: Groups were not found');
            return;
         }
         // LOGGED-IN USER JOINING ALL THE GROUPS ROOMS:
         groups.forEach((group) => {
            socket.join((group._id).toString());
         });
      } catch (error) {
         console.log('Error while joining the group rooms:' ,error.message);
         return;
      }
   })
}

export { joinGroupRoom }