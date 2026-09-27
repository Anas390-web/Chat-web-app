import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux'
import { SendIcon } from '../../../Icons/Icons.jsx'
import { useOutletContext } from 'react-router-dom';
import socket from '../../../Socket/socket.js';
import { MsgBubble } from './DisplayMsgs.jsx';

function Chat() {
   const dispatch = useDispatch();
   // 1. DE-STRUCTURING MODE FROM THE LAYOUT OUTLET CONTEXT:
   const { mode } = useOutletContext();

   // 2. STATE FOR THE MESSAGES:
   const [message, setMessage] = useState('');
   // 3. TO SAVE CONVERSATION ID FROM THE SERVER:
   const [conversationData, setConversationData] = useState({
      convoId: '',
      chatUserId: ''
   });

   // 3.1: CALLBACK FUNCTION TO BE EXECUTED AFTER LISTENING "GET-CONVERSATIONDATA" EVENT:
   function handleConversationData({ conversationId, chatUserId }) {
      setConversationData((prev) => {
         return ({
            ...prev, convoId: conversationId, chatUserId: chatUserId
         })
      });
   }
   // 3.2 GET THE CONVERSATION ID FROM THE SERVER:
   useEffect(() => {
      socket.on('get-conversationData', handleConversationData)
      return () => {
         socket.off('get-conversationData', handleConversationData)
      }
   }, [])

   // 2.1: EVENT HANDLER: HANDLE CHANGE TO SAVE MESSAGE INPUT:
   function handleChange(e) {
      setMessage(e.target.value);
   }

   // 3.3: EVENT HANDLER: HANDLE SUBMIT EMITTING 'SEND-MESSAGE EVENT:
   function handleMsgSubmit(e) {
      e.preventDefault();

      // CHECK IF ID IS PRESENT OTHERWISE STOP EXECUTION:
      if (!conversationData.convoId) {
         console.log('Conversation id is not saved in state yet');
         return;
      }

      // CHECKT IF MESSAGE IS SAVED IN THE STATE OR NOT OTHER WISE STOP EXECUTION:
      if (message.length < 1) return;

      // EMIT 'SEND-MESSAGE' EVENT WITH PAYLOAD:
      socket.emit('send-message', { message, conversationData })

      // SET INPUT TO EMPTY:
      setMessage('');
   }

   return (
      <main className="h-full">
         {
            conversationData.convoId && conversationData.convoId.length > 0 ?
               <div className="flex flex-col h-full">
                  <div className={`flex-1 overflow-y-auto ${mode === 'dark' ? "bg-[url(/images/Black-Doodle.jpg)] bg-contain bg-center" : "bg-[url(/images/White-Doodle.jpg)] bg-contain bg-center"}`}>
                     <div>
                        <MsgBubble
                           userIdToChatWith={conversationData.chatUserId}
                        />
                     </div>
                  </div>
                  <form onSubmit={handleMsgSubmit} className="min-h-16 flex items-center px-3 py-2 w-full box-border border border-gray-600 gap-2">
                     <input
                        className="h-10 flex-1 min-w-0 px-3 outline-none rounded border border-gray-600"
                        type="text"
                        value={message}
                        onChange={handleChange}
                        placeholder='Write message...'
                     />
                     <div className='h-10 flex justify-center items-center'>
                        <button><SendIcon /></button>
                     </div>

                  </form>
               </div>
               :
               <div className={`flex flex-col justify-center items-center h-full ${mode === 'dark' ? "bg-[url(/images/Black-Doodle.jpg)] bg-contain bg-center" : "bg-[url(/images/White-Doodle.jpg)] bg-contain bg-center"}`}>
                  <div>
                     <img src="/images/Owl.png" alt="Squared face owl drawing" />
                  </div>
                  <div>
                     <p className='text-3xl text-white bg-amber-800 px-6 py-2 rounded-md'>START A CHAT</p>
                  </div>
               </div>
         }
      </main>
   )
}

export default Chat;



{/* <div className="flex flex-col h-full">
            <div className={`flex-1 overflow-y-auto ${mode === 'dark' ? "bg-[url(/images/Black-Doodle.jpg)] bg-contain bg-center" : "bg-[url(/images/White-Doodle.jpg)] bg-contain bg-center"}`}>
               <div>
                  {<SenderMsgBubble />}
               </div>
            </div>
            <form onSubmit={handleMsgSubmit} className="min-h-16 flex items-center px-3 py-2 w-full box-border border border-gray-600 gap-2">
               <input
                  className="h-10 flex-1 min-w-0 px-3 outline-none rounded border border-gray-600"
                  type="text"
                  value={message}
                  onChange={handleChange}
                  placeholder='Write message...'
               />
               <div className='h-10 flex justify-center items-center'>
                  <button><SendIcon /></button>
               </div>

            </form>
         </div> */}