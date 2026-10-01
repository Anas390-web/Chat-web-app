import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { SendIcon } from '../../../Icons/Icons.jsx'
import { useOutletContext } from 'react-router-dom';
import socket from '../../../Socket/socket.js';
import { GroupMsgBubble } from './DisplayMsgs.jsx';
import GroupHeader from './GroupHeader.jsx';
import { addLatestGroupMsg } from '../../../Features/messagesSlice.js';

function Group() {
   const dispatch = useDispatch();
   // 1. DE-STRUCTURING MODE FROM THE LAYOUT OUTLET CONTEXT:
   const { mode } = useOutletContext();

   // 2. GET THE GROUP ID FROM THE STORE ON WHICH USER CLICKS TO START CHAT:
   const { groupId } = useSelector((store) => store.ids);


   // TO SEND THE MESSAGE TO THE OTHER USERS:
   const [groupMessage, setGroupMessage] = useState('');
   function handleGroupMessage(e) {
      setGroupMessage(e.target.value);
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

   // RECEIVE ALL THE GROUP MESSAGES UPON USER CLICKED GROUP MOUNTING:
   function handleReceiveGroupMessage(groupMessageDoc) {
      if (!groupMessageDoc && !groupMessageDoc.messageContent.length < 1) {
         return;
      }
      if (!groupMessageDoc.conversationId === groupId) {
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
   }, [dispatch])
   return (

      <div className='flex flex-col h-full overflow-hidden'>
         <GroupHeader />
         <main className="flex-1 min-h-0 flex flex-col">
            {
               groupId && groupId.length > 0 ?
                  <div className="flex flex-col h-full">
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
      </div>
   )
}

export default Group;
