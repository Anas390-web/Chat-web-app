import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux'
import { SendIcon } from '../../../Icons/Icons.jsx'
import { useNavigate, useOutletContext } from 'react-router-dom';
import socket from '../../../Socket/socket.js';
import { MsgBubble } from './DisplayMsgs.jsx';
import { addLatestMsg, allMessages } from '../../../Features/messagesSlice.js';
import ChatHeader from './chatHeader.jsx';

function Chat() {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   // 1. DE-STRUCTURING MODE FROM THE LAYOUT OUTLET CONTEXT:
   const { mode } = useOutletContext();

   // 2. STATE FOR THE MESSAGES:
   const [message, setMessage] = useState('');
   // 3. TO SAVE CONVERSATION ID FROM THE SERVER:
   const [conversationData, setConversationData] = useState({
      convoId: '',
      chatUserId: '' // USER TO CHAT WITH FROM THE LIST OF CHATS ON DASHBOARD
   });

   // 3.1: CALLBACK FUNCTION TO BE EXECUTED AFTER LISTENING "GET-CONVERSATIONDATA" EVENT:
   function handleConversationData({ conversationId, chatUserId }) {
      setConversationData((prev) => {
         return ({
            ...prev, convoId: conversationId, chatUserId: chatUserId
         })
      });
      if (!conversationData) return;
      // GET ALL MESSAGES:
      dispatch(allMessages({ conversationId, chatUserId }))
   }

   // 3.2 GET THE CONVERSATION ID FROM THE SERVER:
   useEffect(() => {
      socket.on('get-conversationData', handleConversationData)
      return () => {
         socket.off('get-conversationData', handleConversationData)
      }
   }, [])

   // 7. USER TYPING:
   // SAVING IS TYPING VALUE PERSISTANT ACROSS RENDERS:
   let isTypingRef = useRef(false);
   // SAVING TIMER IDS PERSISTANT ACROSS RENDERS:
   let timerIdRef = useRef(null);

   // 2.1: EVENT HANDLER: HANDLE CHANGE TO SAVE MESSAGE INPUT:
   function handleChange(e) {
      // USER PRESSES A KEY, ADD IT IN MESSAGE STATE:
      setMessage(e.target.value);

      // 7.1:
      // CLEARS UP PREVIOUS TIMERS IF ANY:
      clearTimeout(timerIdRef.current);

      // START-TYPING EVENT FIRES IF IS-TYPING IS FALSE: IT REMAINS THIS WAY WHEN THE USER HAS NOT PAUSED FOR 2 SECONDS OR MORE:
      if (!isTypingRef.current) {
         socket.emit('start-typing', conversationData);
         // SET IS-TYPING TO TRUE:
         isTypingRef.current = true;
      }

      // IF USER HAS STOPPED TYPING FOR TWO SECONDS, SET TYPING TO FALSE AND EMIT THE STOP-TYPING EVENT:
      timerIdRef.current = setTimeout(() => {
         socket.emit("stop-typing", conversationData);
         isTypingRef.current = false;
         console.log('stop typing!')
      }, 2000)
   }

   // 7.2 ON USER STARTS AND STOP TYPING EVENTS CHANGE THE STATE:
   const [isUserTyping, setIsUserTyping] = useState(false);

   function handleUserStartsTyping(conversationId) {
      setIsUserTyping(true)
   }
   function handleUserStoppedTyping(conversationId) {
      setIsUserTyping(false)
   }

   // UPON USER TYPING STATE CHANGE:
   useEffect(() => {
      socket.on("user-starts-typing", handleUserStartsTyping)
      socket.on("user-stopped-typing", handleUserStoppedTyping)
      return () => {
         socket.off("user-starts-typing", handleUserStartsTyping);
         socket.off("user-stopped-typing", handleUserStoppedTyping);
      }

   }, [])

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

   // 5. RECEIVE THE LATEST MESSAGE FROM THE SERVER AND SAVE IT TO ALL MESSAGES ARRAY IN MESSAGES STATE OF STORE:
   function handleLatestMsg(messageDoc) {
      // ACTION FROM THE MESSAGE SLICE:
      dispatch(addLatestMsg(messageDoc))
   }

   // 6. ON ESCAPE KEY, CHAT DISAPPEARS:
   function handleEscape(event) {
      if (event.key === 'Escape') {
         setConversationData(prev => {
            return {
               ...prev, convoId: ''
            }
         });
      }
   }

   // 5.1 RECEIVE MESSAGE EVENT UPON MOUNTING:
   useEffect(() => {
      socket.on("receive-message", handleLatestMsg)
      // ESCAPE CHAT ON KEYDOWN:
      window.addEventListener('keydown', handleEscape);
      return () => {
         socket.off("receive-message", handleLatestMsg);
         // REMOVE LISTENER:
         window.removeEventListener('keydown', handleEscape);
      }
   }, [dispatch])

   // MOBILE SCREENS VIEWPORT SIZE:
   const viewPortWidth = window.innerWidth;
   const isMobileScreen = viewPortWidth <= 639;


   return (

      <div className='flex flex-col h-full overflow-hidden'>
         <main className="flex-1 min-h-0 flex flex-col">
            {
               conversationData.convoId && conversationData.convoId.length > 0 ?
                  <div className="flex flex-col h-full">
                     <ChatHeader />
                     <div className={`flex-1 overflow-y-auto ${mode === 'dark' ? "bg-[url(/images/Black-Doodle.jpg)] bg-contain bg-center" : "bg-[url(/images/White-Doodle.jpg)] bg-contain bg-center"}`}>
                        <div>
                           <MsgBubble
                              userIdToChatWith={conversationData.chatUserId}
                           />
                        </div>
                     </div>
                     {
                        <div
                           className={`px-4 transition-all duration-200 ease-in ${isUserTyping
                              ? 'opacity-100 max-h-10 py-1'
                              : 'opacity-30 max-h-0 py-0 overflow-hidden pointer-events-none'
                              }`}
                        >
                           <div className="w-fit bg-cyan-400 text-white text-xs font-semibold px-3 py-1.5 rounded-2xl shadow-sm border border-cyan-600 animate-pulse">
                              Typing...
                           </div>
                        </div>
                     }
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
                     <div className='size-1/2 sm:w-3xl'>
                        <img src="/images/Owl.png" alt="Squared face owl drawing" />
                     </div>
                     <div>
                        <p className='text-3xl text-white bg-cyan-800 px-6 py-2 rounded-md'>START A CHAT</p>
                     </div>
                  </div>
            }
         </main>
      </div>
   )
}

export default Chat;
