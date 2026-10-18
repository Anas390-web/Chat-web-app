function formatDocuments(documents) {
   const pageContentArray = documents.map((doc) => {
      return doc.pageContent
   })
   return pageContentArray.join("\n");
}

function formatUserAiChatMessages(msgsArray) {
   const formattedMsgs = msgsArray.map((msg) => {
      if(msg.length % 2 === 0) {
         return `User: ${msg.messageContent}`
      } else {
         return `Ai: ${msg.messageContent}`
      }
   });
   return formattedMsgs;
}

export { formatDocuments, formatUserAiChatMessages };