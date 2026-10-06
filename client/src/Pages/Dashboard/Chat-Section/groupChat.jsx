import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { SendIcon } from '../../../Icons/Icons.jsx'
import { useOutletContext } from 'react-router-dom';
import socket from '../../../Socket/socket.js';
import { GroupMsgBubble } from './DisplayMsgs.jsx';
import GroupHeader from './GroupHeader.jsx';
import { addLatestGroupMsg } from '../../../Features/messagesSlice.js';
import { removeGroupId } from '../../../Features/idsSlice.js'

function Group() {
   const dispatch = useDispatch();
   // 1. DE-STRUCTURING MODE FROM THE LAYOUT OUTLET CONTEXT:
   const { mode } = useOutletContext();

   // 2. GET THE GROUP ID FROM THE STORE ON WHICH USER CLICKS TO START CHAT:
   const { groupId } = useSelector((store) => store.ids);

   // 3. TO SEND THE MESSAGE TO THE OTHER USERS:
   const [groupMessage, setGroupMessage] = useState('');

   // 6. BROADCAST USER IS TYPING TO THE GROUP EXCEPT TO SENDER:
   let isTypingRef = useRef(false);
   let timerIdRef = useRef(null);

   // 2.1: TO SAVE KEYSTROKES IN GROUP MESSAGE STATE:
   function handleGroupMessage(e) {
      setGroupMessage(e.target.value);
      
      // 6.1: EMIT THE START TYPING EVENT IF ISTYPING FALSE:
      // CLEAR ANY EXISTING TIMER IDS:
      clearTimeout(timerIdRef.current);
      
      if(!isTypingRef.current){
         socket.emit("sender-typing-in-group", groupId);

         // SET ISTYPING TO TRUE:
         isTypingRef.current = true;
      }

      // 6.2 IF USER PAUSES FOR 2 SECONDS, EMIT STOPPED-TYPING EVENT:
      timerIdRef.current = setTimeout(() => {
         socket.emit("sender-stopped-typing-in-group", groupId);
         // SET IS TYPING TO FALSE AGAIN AFTER 2 SECONDS:
         isTypingRef.current = false;
      }, 2000)
   }
   
   // EMIT SEND-GROUP-MESSAGE EVENT UPON USER CLICKING SEND ICON:
   function handleGroupMessageSubmit(e) {
      e.preventDefault();
      socket.emit('send-group-message', {
         groupMessage,
         groupId
      });
      setGroupMessage('');
   }

   // 4. RECEIVE THE LATEST GROUP MESSAGE AND APPEND IN THE ARRAY OF ALL THE GROUP MESSAGES:
   function handleReceiveGroupMessage(groupMessageDoc) {
      if (groupMessageDoc.conversationId !== groupId) {
         return;
      }
      dispatch(addLatestGroupMsg(groupMessageDoc));
   }
   useEffect(() => {
      // LISTENING TO RECEIVE-GROUP-MESSAGE EVENT FROM SERVER TO RECEIVE THE LATEST MESSAGE:
      socket.on("receive-group-message", handleReceiveGroupMessage);
      return () => {
         socket.off("receive-group-message", handleReceiveGroupMessage);
      }
   }, [dispatch, groupId, socket])

   // 5. HANDLER FUNCTION TO GET OUT OF GROUP CHATS ON KEYDOWN:
   function handleEscape(event) {
      if (event.key === 'Escape') {
         dispatch(removeGroupId());
      }
   }

   useEffect(() => {
      window.addEventListener('keydown', handleEscape)
      return () => {
         window.removeEventListener('keydown', handleEscape)
      }
   }, [dispatch])

   

   

   return (

      <div className='flex flex-col h-full overflow-hidden'>
         <>
            <main className="flex-1 min-h-0 flex flex-col">
               {
                  groupId && groupId.length > 0 ?
                  <div className="flex flex-col h-full">
                        <GroupHeader />
                        <div className={`flex-1 overflow-y-auto ${mode === 'dark' ? "bg-[url(/images/Black-Doodle.jpg)] bg-contain bg-center" : "bg-[url(/images/White-Doodle.jpg)] bg-contain bg-center"}`}>
                           <div>
                              <GroupMsgBubble />
                           </div>
                        </div>
                        <form onSubmit={handleGroupMessageSubmit} className="min-h-16 flex items-center px-3 py-2 w-full box-border border border-gray-600 gap-2">
                           <input
                              className="h-10 flex-1 min-w-0 px-3 outline-none rounded border border-gray-600"
                              type="text"
                              value={groupMessage}
                              onChange={handleGroupMessage}
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
                           <p className='text-3xl text-white bg-amber-800 px-6 py-2 rounded-md'>START A Group</p>
                        </div>
                     </div>
               }
            </main>
         </>
      </div>
   )
}

export default Group;
