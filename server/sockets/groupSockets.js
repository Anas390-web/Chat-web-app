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
         const groupChatMessageDoc = await Message.create(
            {
               conversationId: groupId,
               senderId: userId,
               messageContent: groupMessage
            }
         )
         if (!groupChatMessageDoc) {
            console.log('Error while creating a message')
            return;
         }
         // POPULATING THE MESSAGE DOCUMENT WITH THE USERNAME OF SENDER:
         const groupMessageDoc = await groupChatMessageDoc.populate({
            path: 'senderId',
            select: 'username'
         })
         // BROADCAST MESSAGE TO EVERYBODY IN THE GROUP:
         io.to(groupId).emit('receive-group-message', groupMessageDoc);
      } catch (error) {
         console.log('Error occured while creating the group message:', error.message);
         return;
      }
   })
}

function leaveGroupChatRoom(socket, io) {
   socket.on('leave-group-chat-room', async (groupId) => {
      try {
         // LEAVING THE ROOM UPON UNMOUNTING:
         socket.leave(groupId);
      } catch (error) {
         console.log(error.message);
         return;
      }
   })
}

function isUserTypingInGroup(socket) {
   // ON LISTERNING SENDER-TYPING-IN-GROUP EVENT:
   socket.on("sender-typing-in-group", (groupId) => {
      // BROADCAST TO EVERYONE EXCEPT SENDER:
      socket.to(groupId).emit("user-typing-in-group");
   })

   // ON LISTENING SENDER-STOPPED-TYPING-IN-GROUP EVENT:
   socket.on("sender-stopped-typing-in-group", (groupId) => {
      // BROADCAST TO EVERYONE EXCEPT SENDER:
      socket.to(groupId).emit("user-stopped-typing-in-group");
   })

}

export { joinGroupRoom, saveGroupMessageInDB, leaveGroupChatRoom, isUserTypingInGroup }