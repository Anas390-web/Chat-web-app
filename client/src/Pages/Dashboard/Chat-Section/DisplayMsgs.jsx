import { useEffect, useState } from "react";
import { useRef } from "react";
import { useSelector } from "react-redux";


function MsgBubble({ userIdToChatWith }) {
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
                     <div className="flex flex-col w-fit p-2 my-1.5 mr-6 rounded-md bg-orange-200">
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
                           <div className="flex justify-between gap-2">
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

export { MsgBubble }