


function showAiChat(socket, io) {
   socket.on("show-ai-chat", () => {
      try {
         // DE-STRUCTURE THE USER ID FROM SOCKET AUTH:
         const { userId } = socket.user;
         // EMIT THE EVENT TO SEND THE USER ID, SO BASED ON USER ID THEY CAN RENDER THEIR CHAT:
         socket.emit("get-logged-in-user-id", userId);
         
      } catch (error) {
         console.log('ERROR WHILE LISTENING TO THE SHOW-AI-CHAT- EVENT:' ,error.message);
         return
      }
   })
}

export { showAiChat };