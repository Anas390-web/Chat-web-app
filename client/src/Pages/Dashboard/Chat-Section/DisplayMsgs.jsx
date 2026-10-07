import { useEffect, useState } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";


function MsgBubble({ userIdToChatWith }) {
   const dispatch = useDispatch();
   // 4. ALL MESSAGES DOCS FROM THE STORE:
   const { allMessagesDocs } = useSelector((store) => store.messages);
   // SCROLL TO LATEST MESSAGE:
   const messageRef = useRef(null);
   // EVENT HANDLER:
   function handleScroll() {
      messageRef.current?.scrollIntoView({ behavior: 'smooth' })
   }

   // TRIGGERS WHEN ALL MESSAGES DOCS STATE CHANGES:
   useEffect(() => {
      handleScroll();
   }, [allMessagesDocs])

   // FORMAT TIME:
   function formatTime(isoString) {
      const time = new Date(isoString).toLocaleTimeString([], {
         hour: '2-digit',
         minute: '2-digit',
         hour12: true
      })
      return time;
   }

   // COLORED NAME:
   const colors = ["text-red-400", "text-blue-400", "text-green-400", "text-orange-400", "text-violet-400", "text-indigo-400", "text-yellow-400", "text-pink-400"]
   function randomColorName() {
      const randomNum = Math.floor(Math.random() * 8)
      const randomColor = colors[randomNum];
      console.log(randomColor);
      return randomColor;
   }

   const [color, setColor] = useState('')
   useEffect(() => {
      setColor(randomColorName());
   }, [])

   return (

      <>
         {
            allMessagesDocs && allMessagesDocs.length > 0 &&
            allMessagesDocs.map((messageDoc) => {

               return messageDoc.senderId._id !== userIdToChatWith ? (
                  <div key={messageDoc._id} className="flex flex-col items-end">
                     <div className="flex flex-col w-fit p-2 my-1.5 mr-6 rounded-md bg-cyan-100 text-black">
                        <div>
                           <p className="font-bold">You</p>
                           <p>{messageDoc.messageContent}</p>
                        </div>
                        <div className="flex justify-between gap-2">
                           <button className="text-[12px] cursor-pointer">Edit</button>
                           <div className="text-[12px]">{formatTime(messageDoc.createdAt
                           )}</div>
                        </div>
                     </div>
                  </div>
               )
                  :
                  (
                     <div key={messageDoc._id} className="flex flex-col items-start">
                        <div className="flex flex-col w-fit p-2 my-1.5 ml-6 rounded-md bg-white">
                           <div className="text-black">
                              <p className={`${color} font-bold`}>{messageDoc?.senderId?.username}</p>
                              <p>{messageDoc.messageContent}</p>
                           </div>
                           <div className="flex justify-between gap-2 text-black">
                              <button className="text-[12px] cursor-pointer">Edit</button>
                              <div className="text-[12px]">{formatTime(messageDoc.createdAt)}</div>
                           </div>
                        </div>
                     </div>
                  )
            })
         }
         <div ref={messageRef}></div>
      </>
   )
}

function GroupMsgBubble() {

   // ACCESS ALL GROUP MESSAGES DOCUMENTS FROM THE STORE:
   const { allGroupMessagesDocs } = useSelector((store) => store.messages);

   // ACCESS THE USERID FROM THE STORE:
   const { loggedInUserId } = useSelector((store) => store.auth);

   // BROWSE DOWN TO LATEST MESSAGE:
   const messageRef = useRef();

   function handleScroll() {
      return messageRef.current?.scrollIntoView({ behavior: 'smooth' })
   }

   useEffect(() => {
      handleScroll();
   }, [allGroupMessagesDocs])

   // CONVERTING TIME ZONES:
   function formatTime(isoString) {
      const time = new Date(isoString).toLocaleTimeString([], {
         hour: '2-digit',
         minute: '2-digit',
         hour12: true
      })
      return time;
   }

   // COLORED NAME:
   const colors = ["text-red-400", "text-blue-400", "text-green-400", "text-orange-400", "text-violet-400", "text-indigo-400", "text-yellow-400", "text-pink-400"]
   function randomColorName() {
      const randomNum = Math.floor(Math.random() * 8)
      const randomColor = colors[randomNum];
      return randomColor;
   }

   const [color, setColor] = useState('')
   useEffect(() => {
      setColor(randomColorName());
   }, [])

   return (
      <>
         {
            allGroupMessagesDocs && allGroupMessagesDocs.length > 0 &&
            allGroupMessagesDocs.map((groupMsgDoc) => {

               // CONVERTING USERNAME TO STRING FOR A SAFER SIDE:
               const username = String(groupMsgDoc?.senderId?.username);
               // CONVERTING MESSAGE SENDER IF TO STRING:
               const msgSenderId = String(groupMsgDoc?.senderId?._id || groupMsgDoc?.senderId);

               // CHECKING IF THE SENDER ID MATCHES THE LOGGED IN STRING USER ID
               const isSenderId = msgSenderId === String(loggedInUserId);

               return isSenderId ? (

                  <div key={groupMsgDoc._id} className="flex flex-col items-end">
                     <div className="flex flex-col w-fit p-2 my-1.5 mr-6 rounded-md bg-cyan-100">
                        <div className="text-black">
                           <p className="font-bold">You</p>
                           <p>{groupMsgDoc.messageContent}</p>
                        </div>
                        <div className="flex justify-between gap-2">
                           <button className="text-[12px] cursor-pointer">Edit</button>
                           <div className="text-[12px]">
                              <p>{formatTime(groupMsgDoc?.createdAt)}</p>
                           </div>
                        </div>
                     </div>
                  </div>
               )
                  :
                  (
                     <div key={groupMsgDoc._id} className="flex flex-col items-start">
                        <div className="flex flex-col w-fit p-2 my-1.5 ml-6 rounded-md bg-white">
                           <div className="text-black">
                              <p className={`${color} font-bold`}>{username}</p>
                              <p>{groupMsgDoc.messageContent}</p>
                           </div>
                           <div className="flex justify-between gap-2 text-black">
                              <button className="text-[12px] cursor-pointer">Edit</button>
                              <div className="text-[12px]">
                                 <p className="text-black">{formatTime(groupMsgDoc?.createdAt)}</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  )
            })
         }


         <div ref={messageRef}></div>
      </>
   )
}

export { MsgBubble, GroupMsgBubble }