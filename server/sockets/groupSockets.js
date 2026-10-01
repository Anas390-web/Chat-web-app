import Conversation from "../models/Conversations/Conversation.js";
import Message from "../models/Messages/Message.js";


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
         console.log('Error while joining the group rooms:', error.message);
         return;
      }
   })
}

function saveGroupMessageInDB(socket, io) {
   socket.on('send-group-message', async ({ groupMessage, groupId }) => {
      try {
         // USER ID FROM TOKEN AUTHENTICAITON FROM SOCKET AUTH:
         const { userId } = socket.user;
         // SAVE THE MESSAGE IN DB:
         const groupMessageDoc = await Message.create(
            {
               conversationId: groupId,
               senderId: userId,
               messageContent: groupMessage
            }
         )
         // BROADCAST MESSAGE TO EVERYBODY IN THE GROUP:
         io.to(groupId).emit('receive-group-message', groupMessageDoc);
      } catch (error) {
         console.log('Error occured while creating the group message:', error.message);
         return;
      }
   })
}

export { joinGroupRoom, saveGroupMessageInDB }