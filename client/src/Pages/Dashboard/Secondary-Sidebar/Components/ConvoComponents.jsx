import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom"
import { useDispatch } from "react-redux";
import { addUsers } from "../../../../Features/contactsSlice.js";
import socket from "../../../../Socket/socket.js";
import { allGroups } from "../../../../Features/groupListSlice.js";


const BlankImage = '/images/Blank-User-Image.png';

function Chats({ users }) {
   const dispatch = useDispatch();
   const { contactList } = useSelector((store) => store.contacts);

   // JOIN THE INDIVIDUAL CHAT ROOM:

   function getUserId(chatUserId) {
      console.log(chatUserId);
      socket.emit('join-room', { chatUserId })
   }

   useEffect(() => {
      dispatch(addUsers(users));
   }, [dispatch])

   const { mode } = useOutletContext();
   return (
      <>
         {
            contactList.map((contact) => {
               return (
                  <div key={contact._id} className={`flex gap-2 m-2 p-2 rounded-md ${mode === 'dark' ? 'border border-gray-600' : 'bg-white'}`}
                     onClick={() => getUserId(contact._id)}>
                     <div className='h-10 w-10 border border-gray-600 rounded-full'>
                        <img src={BlankImage} alt="" />
                     </div>
                     <div className="cursor-pointer">
                        <div>
                           <p>{contact.username}</p>
                        </div>
                        <div>
                           <p className='font-light text-sm'>Latest message from chats</p>
                        </div>
                     </div>
                  </div>
               )
            })
         }
      </>
   )
}

function Groups() {
   const dispatch = useDispatch();
   // DE-STRUCTURE MODE FROM THE OUTLET CONTEXT:
   const { mode } = useOutletContext();

   // ACCESS ALL THE GROUPS WHICH INVOLVES THE LOGGED-IN USER:
   const { allGroupsList } = useSelector((store) => store.groups);

   useEffect(() => {
      dispatch(allGroups());
   }, [dispatch])
   return (
      <>
         {
            allGroupsList.map((group) => {
               return (
                  <div key={group._id} className={`flex gap-2 mx-2 my-2 p-2 rounded-md cursor-pointer ${mode === 'dark' ? 'border border-gray-600' : 'bg-white'}`}>
                     <div className='h-10 w-10 border border-gray-600 rounded-full'>
                        <img src={BlankImage} alt="" />
                     </div>
                     <div>
                        <div>
                           <p>{group.groupName}</p>
                        </div>
                        <div>
                           <p className='font-light text-sm'>Latest message from group chat</p>
                        </div>
                     </div>
                  </div>
               )
            })
         }
      </>
   )
}

function Archives() {
   const { mode } = useOutletContext();
   return (
      <div className={`flex gap-2 mx-2 p-2 rounded-md ${mode === 'dark' ? 'border border-gray-600' : 'bg-white'}`}>
         <div className='h-10 w-10 border border-gray-600 rounded-full'>
            <img src={BlankImage} alt="" />
         </div>
         <div>
            <div>
               <p>User</p>
            </div>
            <div>
               <p className='font-light text-sm'>Latest message from user</p>
            </div>
         </div>
      </div>
   )
}

function Settings() {
   const { mode } = useOutletContext();
   return (
      <div className={`flex gap-2 mx-2 p-2 rounded-md ${mode === 'dark' ? 'border border-gray-600' : 'bg-white'}`}>
         <div className='h-10 w-10 border border-gray-600 rounded-full'>
            <img src={BlankImage} alt="" />
         </div>
         <div>
            <div>
               <p>Settings 1</p>
            </div>
            <div>
            </div>
         </div>
      </div>
   )
}

export { Chats, Groups, Archives, Settings }