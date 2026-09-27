import { useEffect } from "react";
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

   return (
      
      <>

         {
            allMessagesDocs && allMessagesDocs.length > 0 &&
            allMessagesDocs.map((messageDoc) => {
               return messageDoc.senderId !== userIdToChatWith ? (
                  <div key={messageDoc._id} className="flex flex-col items-end">
                     <div key={messageDoc._id} className="flex flex-col w-fit p-2 my-1.5 mr-6 rounded-md bg-orange-200">
                        <div className="text-black">
                           <p>{messageDoc.messageContent}</p>
                        </div>
                        <div className="flex justify-between">
                           <button className="text-[12px] cursor-pointer">Edit</button>
                           <div className="text-[12px]">Time stamp</div>
                        </div>
                     </div>
                  </div>
               )
                  :
                  (
                     <div className="flex flex-col items-start">
                        <div key={messageDoc._id} className="flex flex-col w-fit p-2 my-1.5 ml-6 rounded-md bg-white">
                           <div className="text-black">
                              <p>{messageDoc.messageContent}</p>
                           </div>
                           <div className="flex justify-between">
                              <button className="text-[12px] cursor-pointer">Edit</button>
                              <div className="text-[12px]">Time stamp</div>
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