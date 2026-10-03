import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom"
import { useDispatch } from "react-redux";
import { addUsers } from "../../../../Features/contactsSlice.js";
import socket from "../../../../Socket/socket.js";
import { allGroups } from "../../../../Features/groupListSlice.js";
import { getPersonalChatId, getGroupId } from "../../../../Features/idsSlice.js";
import { allGroupMessages } from "../../../../Features/messagesSlice.js";
import { getSelectedGroupData, getUserToChatWithData } from "../../../../Features/authSlice.js";


const BlankImage = '/images/Blank-User-Image.png';

function Chats({ users }) {
   const dispatch = useDispatch();
   const { contactList } = useSelector((store) => store.contacts);

   // USER CLICKS ON THE CHAT AND IT BECOMES DARKER THAN OTHERS:
   const [selectedChatId, setSelectedChatId] = useState('');

   // WHEN USER CLICKS ON ONE OF LISTED CHATS, DISPATCH THE ACTION TO SAVE THE PERSONAL CHAT ID IN IDS SLICE:

   function getUserId(chatUserId) {
      dispatch(getPersonalChatId(chatUserId));

      // CHANGE SELECTED CHAT COLOR:
      setSelectedChatId(chatUserId);

      // JOIN THE INDIVIDUAL CHAT ROOM:
      socket.emit('join-room', { chatUserId })

      // FOR CHAT HEADER INFO:
      dispatch(getUserToChatWithData(chatUserId));
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
                  <div key={contact._id} className={`flex gap-2 m-2 p-2 rounded-md shadow shadow-gray-700
                     ${mode === 'dark' ? 'border border-gray-600' : ' border-orange-700'}
                     ${selectedChatId === contact._id ? 'bg-blue-200 text-black' : ''}`}

                     onClick={() => getUserId(contact._id)}>
                     <div className='h-10 w-10 border border-gray-600 rounded-full'>
                        <img src={BlankImage} alt="" />
                     </div>
                     <div className="cursor-pointer">
                        <div>
                           <p>{contact.username}</p>
                           <div></div>
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

   // ACCESS GROUP ID FROM STORE:
   const { groupId } = useSelector((store) => store.ids);

   useEffect(() => {
      dispatch(allGroups());
      // EMITTING JOIN-GROUP-ROOM EVENT UPON GROUPS COMPONENT MOUNTING:
      socket.emit('join-group-room')
      return () => {
         // LEAVE THE GROUP CHAT ROOM UPON UNMOUNTING:
         socket.emit('leave-group-chat-room', groupId);
      }
   }, [dispatch])

   // WHEN USER CLICKS ON THE GROUP, DISPATCHING TO SAVE THE GROUP ID IN THE IDS STATE AND TO GET ALL THE MESSAGES OF THAT GROUP ID:
   function handleGroup(groupId) {
      // GET GROUP ID TO SAVE IN THE IDS STATE:
      dispatch(getGroupId(groupId))
      // DISPATCH TO GET ALL THE GROUP MESSAGES:
      dispatch(allGroupMessages({ groupId }));
      // DISPATCH TO GET SELECTED GROUP DATA TO CHAT IN:
      dispatch(getSelectedGroupData(groupId));
   }

   return (
      <>
         {
            allGroupsList.map((group) => {
               return (
                  <div key={group._id} className={`flex gap-2 mx-2 my-2 p-2 rounded-md cursor-pointer ${mode === 'dark' ? 'border border-gray-600' : 'bg-white'}`}>
                     <div className='h-10 w-10 border border-gray-600 rounded-full'>
                        <img src={BlankImage} alt="" />
                     </div>
                     <div onClick={() => handleGroup(group._id)}>
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
               <p>User</p>
            </div>
            <div>
               <p className='font-light text-sm'>Latest message from user</p>
            </div>
         </div>
      </div>
   )
}

export { Chats, Groups, Archives, Settings }