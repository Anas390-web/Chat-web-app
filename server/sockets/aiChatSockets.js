import AiConversation from '../models/AiConversation/AiConversation.js'
import AiMessage from '../models/AiMessages/AiMessages.js'


// TO SEND BACK THE USER ID, TO SHOW THE AI CHAT BY CLICKING ON THE AI CHAT CARD:
function showAiChat(socket, io) {
   socket.on("show-ai-chat", () => {
      try {
         // DE-STRUCTURE THE USER ID FROM SOCKET AUTH:
         const { userId } = socket.user;
         // EMIT THE EVENT TO SEND THE USER ID, SO BASED ON USER ID THEY CAN RENDER THEIR CHAT:
         socket.emit("get-logged-in-user-id", userId);

      } catch (error) {
         console.log('ERROR WHILE LISTENING TO THE SHOW-AI-CHAT- EVENT:', error.message);
         return
      }
   })
}

function saveAiChatUserMsg_And_JoinAiRoom(socket, io) {
   socket.on("send-message-to-ai-chat", async (aiChatMessage) => {
      try {
         // DE-STRUCTURE THE USER ID FROM THE SOCKET AUTH:
         const { userId } = socket.user;
         // FIND OR CREATE THE AI CONVERSATION AND USER WHERE THIS USER ID EXISTS:
         const aiConversation = await AiConversation.findOneAndUpdate(
            { senderId: userId, chatType: 'ai' },
            {},
            { upsert: true, returnDocument: 'after', runValidators: true }
         )
         
         if (!aiConversation) {
            console.log('Ai conversation with this userId does not exist');
            return;
         }

         // CREATE THE MESSAGE:
         const aiMessage = await AiMessage.create(
            {
               aiConversationId: aiConversation._id,
               senderId: userId,
               messageContent: aiChatMessage
            }
         )

         // IF MESSAGE IS NOT CREATED/NULL, LOG AN ERROR AND STOP EXECUTION:
         if(!aiMessage) {
            console.log('User chat message with Ai was not created. Error!');
            return;
         }

         // CONVERT AI CONVERSATION ID FROM OBJECT ID TO STRING:
         const aiConvoId = (aiConversation._id).toString();

         // LEAVE PREVIOUS ROOMS BEFORE JOINING THE ROOM:
         for(const room of socket.rooms) {
            if(room !== socket.id) {
               socket.leave(room)
            }
         }
         // SOCKET JOINS THE AI CONVERSATION ID ROOM:
         socket.join(aiConvoId);

         // EMIT THE RECEIVE MESSAGE EVENT:
         socket.emit("receive-latest-msg", aiMessage);
      } catch (error) {
         console.log('ERROR OCCURRED WHILE CREATING AI CONVERSATION AND USER MESSAGE WITH AI IN DB' ,error.message);
         return;
      }
   })
}

export { showAiChat, saveAiChatUserMsg_And_JoinAiRoom };
