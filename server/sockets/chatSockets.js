import Conversation from '../models/Conversations/Conversation.js'

// JOINING THE IDENTICAL ID PERSONAL ROOM FOR BOTH USERS:
const joinPersonalRoom = (socket, io) => {
   socket.on('join-room', async ({ chatUserId }) => {
      // FROM PAYLOAD IN SOCKET AUTHENTICATION FUNCTION:
      const { userId } = socket.user;
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
      console.log(conversation);
      // CONVERTING OBJECTID TO STRING:
      const conversationId = conversation._id.toString();
      // JOINING THE ROOM:
      socket.join(conversationId);
      // SENDING CONVERSATION ROOM ID:
      socket.emit('get-conversationData', { conversationId, chatUserId });
   })
}

export { joinPersonalRoom }

