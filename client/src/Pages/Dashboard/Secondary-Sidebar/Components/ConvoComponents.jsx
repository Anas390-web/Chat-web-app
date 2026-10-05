import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom"
import { useDispatch } from "react-redux";
import { addUsers } from "../../../../Features/contactsSlice.js";
import socket from "../../../../Socket/socket.js";
import { allGroups } from "../../../../Features/groupListSlice.js";
import { getPersonalChatId, getGroupId } from "../../../../Features/idsSlice.js";
import { allGroupMessages } from "../../../../Features/messagesSlice.js";
import { getSelectedGroupData, getUserToChatWithData, getLoggedInUserData, updateUsernameAndAvatar } from "../../../../Features/authSlice.js";


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
                        <img
                           className="rounded-full p-0.5"
                           src={contact.userAvatarUrl} alt="" />
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
   const dispatch = useDispatch();

   // ACCESSING THE AVATAR AND USERNAME FROM STORE:
   const { username, loggedInUserId, userAvatar } = useSelector((store) => store.auth);

   // ACCESSING THE TOKEN FROM LOCAL STORAGE:
   const token = localStorage.getItem("accessToken");

   // SHOW EDITING OPTIONS:
   const [showEditing, setShowEditing] = useState(false);
   function showEditingOptions() {
      setShowEditing(true);
   }
   function hideEditingOptions() {
      setShowEditing(false);
      setAvatarUrl('');
   }

   // UPON SETTINGS COMPONENT MOUNTING GET LOGGED IN USER DETAILS:
   useEffect(() => {
      if (!token) {
         return;
      }
      dispatch(getLoggedInUserData());
   }, [dispatch])

   // CHANGE USERNAME:
   const [name, setName] = useState('');
   function handleChange(e) {
      setName(e.target.value);
   }

   // CHANGE THE AVATAR STATE:
   const [avatarUrl, setAvatarUrl] = useState('');
   function changeAvatar(url) {
      setAvatarUrl(url);
   }

   async function handleUsernameAndAvatarChange(e) {
      e.preventDefault();
      try {
         if (!name && !avatarUrl) return;
         await dispatch(updateUsernameAndAvatar({ name, avatarUrl })).unwrap();
         setName('');
      } catch (error) {
         console.log('Error while updating the profile:', error.message);
         return error;
      }
   }

   // AVATARS ARRAY:
   const avatars = [
      {
         id: 1,
         imgUrl: 'images/beard-man-avatar.jpg'
      },
      {
         id: 2,
         imgUrl: 'images/african-boy-avatar.jpg'
      },
      {
         id: 3,
         imgUrl: 'images/old-man-avatar.jpg'
      },
      {
         id: 4,
         imgUrl: 'images/brown-hair-women-avatar.jpg'
      },
      {
         id: 5,
         imgUrl: 'images/african-girl-avatar.jpg'
      },
      {
         id: 6,
         imgUrl: 'images/short-hair-girl-avatar.jpg'
      },
      {
         id: 7,
         imgUrl: 'images/Blank-User-Image.png'
      }
   ]
   return (
      <div className={`flex flex-col items-center gap-4 mx-2 p-2 rounded-md ${mode === 'dark' ? 'border border-gray-600' : 'bg-white'}`}>
         <div className="flex flex-col w-full p-2 items-center gap-4 border border-gray-200 shadow">
            <div className='size-15 sm:size-20 border border-gray-600 p-1 rounded-full'>
               <img
                  className="rounded-full"
                  src={
                     avatarUrl ?
                        avatarUrl
                        :
                        userAvatar.userAvatarUrl
                  } alt="" />
            </div>
            <div>
               { username }
            </div>
            <div className="bg-amber-600 text-white rounded-sm">
               <button
                  className="px-2 py-0.5 font-light cursor-pointer text-[13px] shadow"
                  onClick={showEditingOptions}>Edit Profile</button>
            </div>
         </div>
         {
            showEditing &&
            <div className="w-full">
               <form onSubmit={handleUsernameAndAvatarChange} className="flex flex-col gap-4">
                  <label>
                     <p>Change name:</p>
                     <input
                        className="w-full bg-gray-300 p-2 mt-2 rounded-sm text-[14px]"
                        value={name}
                        onChange={handleChange}
                        type="text"
                        placeholder="edit name" />
                  </label>
                  <label>
                     <p>Change Avatar:</p>
                     <div className="flex flex-wrap gap-2 mt-2">
                        {
                           avatars &&
                           avatars.map((avatar) => {
                              return (
                                 <div
                                    key={avatar.id}
                                    className="size-10 bg-gray-400 rounded-full"
                                    onClick={() => changeAvatar(avatar.imgUrl)}>
                                    <img
                                       className="rounded-full cursor-pointer"
                                       src={avatar.imgUrl} alt="" />
                                 </div>
                              )
                           })
                        }
                     </div>
                  </label>
                  <button
                     className="bg-amber-600 text-white text-[14px] font-light py-1 rounded-sm shadow cursor-pointer mb-2">Confirm Changes</button>
               </form>
               <div className="w-full">
                  <button
                     className="w-full border border-red-600 text-red-800 text-[14px] font-medium py-1 rounded-sm shadow cursor-pointer"
                     onClick={hideEditingOptions}>Cancel Changes</button>
               </div>
            </div>
         }
      </div>
   )
}

export { Chats, Groups, Archives, Settings }