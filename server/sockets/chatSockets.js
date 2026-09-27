import Conversation from '../models/Conversations/Conversation.js'
import Message from '../models/Messages/Message.js'

// JOINING THE IDENTICAL ID PERSONAL ROOM FOR BOTH USERS:
const joinPersonalRoom = (socket, io) => {
   try {
      socket.on('join-room', async ({ chatUserId }) => {
         // FROM PAYLOAD IN SOCKET AUTHENTICATION FUNCTION:
         const { userId } = socket.user;
         if (!userId) {
            console.log('User id is missing from payload in socket Authentication');
            return;
         }
         // EMPTY ARRAY:
         let members = [];
         // ADD THE LOGGED-IN USER ID AND USER ID TO CHAT WITH:
         members.push(userId, chatUserId);
         let convoMembers = members.sort();
         // CREATE OR UPDATE THE CONVERSATION:
         const conversation = await Conversation.findOneAndUpdate(
            { participants: convoMembers, isGroup: false },
            { $addToSet: { participants: { $each: members } } },
            { upsert: true, returnDocument: 'after', runValidators: true }
         )
         if (!conversation) {
            console.log('Error: Conversation document was not created.')
            return;
         }
         // CONVERTING OBJECTID TO STRING:
         const conversationId = conversation._id.toString();
         // JOINING THE ROOM:
         socket.join(conversationId);
         // SENDING CONVERSATION ROOM ID:
         socket.emit('get-conversationData', { conversationId, chatUserId });
      })
   } catch (error) {
      console.log(error.message);
      return error.message;
   }
}

const saveMessageInDB = (socket, io) => {
   try {
      // EVENT LISTERNER FOR MESSAGE EVENT:
      socket.on("send-message", async ({ message, conversationData }) => {
         // PAYLOAD FROM AUTHENTICATION:
         const { userId } = socket.user;
         // MESSAGE TO SAVE IN DB:
         const messageDoc = await Message.create(
            { conversationId: conversationData.convoId, senderId: userId, messageContent: message }
         )
         if (!messageDoc) {
            console.log('Error: Message document was not saved.')
            return;
         }
         // BROADCAST TO BOTH THE SOCKETS/USERS:
         io.to(conversationData.convoId).emit("receive-message", messageDoc );
      })
   } catch (error) {
      console.log(error.message);
      return error.message;
   }

}



export { joinPersonalRoom, saveMessageInDB }

