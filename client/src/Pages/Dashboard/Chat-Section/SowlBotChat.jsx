import { useOutletContext } from "react-router";
import AiChatHeader from "./AiChatHeader.jsx";
import { AiMsgBubble } from "./DisplayMsgs.jsx";
import { SendIcon } from "../../../Icons/Icons.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import socket from '../../../Socket/socket.js'
import { addLatestAiChatMessage, getAllAiChatMessages } from "../../../Features/aiBotSlice.js";


function SowlBotChat() {
   const dispatch = useDispatch();

   const { mode } = useOutletContext();
   // ACCESS THE LOGGED IN USER ID FROM AI BOT STORE:
   const { aiChatLoggedInUserId } = useSelector((store) => store.aiBot);

   // SEND MESSAGE TO AI:
   const [aiChatMessage, setAiChatMessage] = useState("");
   function handleAiMessageChange(e) {
      setAiChatMessage(e.target.value);
   }
   function handleAiChatMessageSubmit(e) {
      e.preventDefault();
      // EMIT SEND MESSAGE EVENT:
      socket.emit('send-message-to-ai-chat', aiChatMessage);
      // EMPTY THE INPUT:
      setAiChatMessage('');
   }

   // UPON AI CHAT MOUNTING SHOW MESSAGES:
   useEffect(() => {

      // ADD THE LATEST MESSAGE TO THE ALL AI CHAT MESSAGES ARRAY:
      function handleReceiveLatestMsg(aiMessage) {
         dispatch(addLatestAiChatMessage(aiMessage))
      }

      socket.on("receive-latest-msg", handleReceiveLatestMsg);

      // DISPATCH GET ALL AI CHAT MESSAGES SO MESSAGES CAN BE MOUNTED UPON COMPONENT MOUNTING:
      dispatch(getAllAiChatMessages());
      
      return (() => {
         socket.off("receive-latest-msg", handleReceiveLatestMsg);
      })
   }, [dispatch])

   return (
      <div className='flex flex-col h-full overflow-hidden'>
         <main className="flex-1 min-h-0 flex flex-col">

            {
               aiChatLoggedInUserId && aiChatLoggedInUserId.length > 0 ?
                  <div className="flex flex-col h-full">
                     <AiChatHeader />
                     <div className={`flex-1 overflow-y-auto ${mode === 'dark' ? "bg-[url(/images/Black-Doodle.jpg)] bg-contain bg-center" : "bg-[url(/images/White-Doodle.jpg)] bg-contain bg-center"}`}>
                        <div>
                           <AiMsgBubble />
                        </div>
                     </div>

                     <form onSubmit={handleAiChatMessageSubmit} className="min-h-16 flex items-center px-3 py-2 w-full box-border border border-gray-600 gap-2">
                        <input
                           className="h-10 flex-1 min-w-0 px-3 outline-none rounded border border-gray-600"
                           type="text"
                           value={aiChatMessage}
                           onChange={handleAiMessageChange}
                           placeholder='Write message...'
                        />
                        <div className='h-10 flex justify-center items-center'>
                           <button><SendIcon /></button>
                        </div>
                     </form>
                  </div>
                  :
                  <div className={`flex flex-col justify-center items-center h-full ${mode === 'dark' ? "bg-[url(/images/Black-Doodle.jpg)] bg-contain bg-center" : "bg-[url(/images/White-Doodle.jpg)] bg-contain bg-center"}`}>
                     <div className='size-1/2 sm:w-3xl'>
                        <img src="/images/Owl.png" alt="Squared face owl drawing" />
                     </div>
                     <div className='text-[min(4vw,36px)] bg-cyan-800 px-6 rounded-md'>
                        <p className='text-white '>START A CHAT</p>
                     </div>
                  </div>
            }

         </main>
      </div>
   )
}

export default SowlBotChat