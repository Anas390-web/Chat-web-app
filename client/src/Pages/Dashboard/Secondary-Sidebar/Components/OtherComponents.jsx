import { useDispatch, useSelector } from "react-redux";
import { addUsers } from "../../../../Features/contactsSlice.js";
import { ClosePageIcon, CrossIcon } from "../../../../Icons/Icons.jsx";
import { creatAGroup } from "../../../../Features/groupListSlice.js";
import { useRef, useState } from "react";
import { deleteLoginUser } from "../../../../Features/authSlice.js";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SearchIcon } from "../../../../Icons/Icons.jsx";
import { searchUsers, searchGroups } from "../../../../Features/authSlice.js";

// ALL USERS LIST AS DROP DOWN:
function AllUsersList({ users, handleUserChange, handleRemoveUser }) {
   // ACCESSING AUTH STATE:
   const { allUsers } = useSelector((store) => store.auth);

   return (
      <div className="flex flex-wrap">
         <div className='w-full h-fit flex justify-center gap-2 mb-1 px-2'>
            <select
               name="userList"
               value=''
               onChange={handleUserChange}
               className='w-full border border-gray-400 p-1 rounded-md cursor-pointer'>
               <option value="All users">All users</option>
               {
                  allUsers.length > 0 &&
                  allUsers.map((user) => {
                     const deletedUser = String(user.username.split("_")[0])
                     const isUserDeleted = deletedUser === 'deleted'
                     return (
                        <option
                           className='text-black'
                           key={user._id}
                           value={user._id}>{
                              isUserDeleted ?
                                 'Deleted user'
                                 :
                                 user.username
                           }</option>
                     )
                  })
               }
            </select>
         </div>
         <div className="flex w-full gap-2 mb-1 px-2">
            {
               users.map((user) => {
                  return (
                     <div key={user} className="w-11 flex relative">
                        <div className="flex flex-col h-10 justify-center items-center border w-10 rounded-full">
                           <div className="flex">
                              <img className="h-4 w-4 rounded" src="/images/Blank-User-Image.png" alt="Blank User Image" />
                           </div>
                           <p></p>
                        </div>
                        <div onClick={() => handleRemoveUser(user)} className="absolute right-0 cursor-pointer">
                           <ClosePageIcon />
                        </div>
                     </div>
                  )
               })
            }
         </div>
      </div>
   )
}

// BUTTON WHICH SENDS REQUEST TO ADD USERS TO CHAT WITH ON DASHBOARD: 
function AddUsersButton({ users }) {
   const dispatch = useDispatch();
   function handleAddUsers(users) {
      dispatch(addUsers(users));
   }
   return (
      <div className='flex w-full px-2 mb-1'>
         <button
            className='bg-cyan-700 border border-amber-900 flex-1 p-1 rounded-md text-white shadow-2xl shadow-gray-400 cursor-pointer'
            onClick={() => handleAddUsers(users)}>Add User</button>
      </div>
   )
}

// BUTTON WHICH OPENS THE POP-UP TO ADD THE GROUP DETAILS:
function AddToGroupBtn({ openDetailsBox, users }) {
   return (
      <div className='flex w-full px-2 mb-1'>
         <button
            className='bg-cyan-700 border border-amber-900 flex-1 p-1 rounded-md text-white shadow-2xl shadow-gray-400 cursor-pointer'
            onClick={() => openDetailsBox()}
            disabled={users.length < 1}
         >Add users to Group</button>
      </div>
   )
}

// A POP UP TO ADD THE GROUP NAME:
function AddGroupDetails({ closeDetailsBox, users }) {
   const dispatch = useDispatch();
   // ACCESSING ALL USERS FROM AUTH STATE:
   const { allUsers } = useSelector((store) => store.auth);

   // FILTERING THE USERS WHICH ARE SELECTED TO CREATE A GROUP:
   const selectedUsers = allUsers.filter((regUser) => {
      return (users.includes(regUser._id))
   });

   // SAVING THE GROUP DETAILS:
   const [groupDetails, setGroupDetails] = useState({
      groupName: '',
      selectedUsers: []
   });
   function handleChange(e) {
      setGroupDetails((prev) => {
         return {
            ...prev, groupName: e.target.value, selectedUsers: selectedUsers
         }
      });
   }
   function handleSubmit(e) {
      e.preventDefault();
      dispatch(creatAGroup(groupDetails));
      closeDetailsBox();
   }


   return (
      <div
         className="fixed inset-0 bg-white/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
         onClick={(e) => {
            // CLOSE THE POP-UP WHEN CLICKED OUTSIDE OF INNER DIV
            if (e.target === e.currentTarget) {
               closeDetailsBox();
            }
         }}>

         <div className="bg-white border border-gray-200 shadow-2xl w-full max-w-md p-5 flex flex-col justify-center items-center gap-2 relative rounded-lg"
            style={{ width: '100%', maxWidth: '450px' }}>
            <div className="flex w-full">
               <div className="flex flex-1 justify-center">
                  <h2>Add a Name</h2>
               </div>
               <div className="cursor-pointer"
                  onClick={() => closeDetailsBox()}>
                  <CrossIcon />
               </div>
            </div>
            <form onSubmit={handleSubmit} className="w-full">
               <label>
                  <p className="mb-2">Group name:</p>
                  <input
                     className="bg-gray-200 w-full p-2 mb-2"
                     value={groupDetails.groupName}
                     type="text"
                     onChange={handleChange}
                     placeholder="add a name" />
               </label>
               <div>
                  <p>Participants:
                     {
                        selectedUsers.map((user) => {
                           return <span key={user._id} className="mx-1 text-amber-800">{user.username}</span>
                        })
                     }
                  </p>
               </div>
               <div className="flex justify-center p-2">
                  <button
                     className="bg-cyan-400 text-white w-full font-light p-1.5 rounded-md">Create a Group</button>
               </div>
            </form>
         </div>
      </div>
   )
}

function ConfirmDeleteAccount({ closeDeleteBox }) {
   const dispatch = useDispatch();

   // DISPATCH DELETE LOGIN USER ACCOUNT:
   function deleteMyAccount() {
      dispatch(deleteLoginUser());
      closeDeleteBox();
   }

   return (
      <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex justify-center items-center font-inter">

         <div className="flex flex-col items-center z-50 p-3 h-100 sm:h-100 w-full sm:w-100 bg-white rounded-md">

            <div className="w-full flex flex-col justify-center items-center">
               <div className="w-full flex justify-center">
                  <p className="text-2xl text-red-800">Are you sure?</p>
               </div>
               <div className="w-full">
                  <p className="text-blue-600">Notice:</p>
               </div>

               <div className="m-2 p-3 h-40 border border-gray-500 shadow-inner shadow-gray-400 rounded-md">
                  <ul className="text-[12px] font-light list-disc">
                     <li className="">Deleting your account will remove your username, email, password & avatar.</li>
                     <li className="">Your messages to other users will remain!</li>
                  </ul>
               </div>

            </div>

            <div className=" flex justify-center items-center gap-10 flex-1">
               <button
                  className="bg-red-700 text-white w-20 py-1 rounded-sm cursor-pointer"
                  onClick={deleteMyAccount} >
                  Yes
               </button>
               <button
                  className="bg-green-700 text-white w-20 py-1 rounded-sm cursor-pointer"
                  onClick={closeDeleteBox}>Cancel</button>
            </div>
         </div>
      </div>
   )
}

function SearchUser() {
   const dispatch = useDispatch();
   // SEARCH PARAMS:
   const [searchParams, setSearchParams] = useSearchParams();

   // TIMER ID:
   const timerIdRef = useRef(null);
   // USER SEARCHING:
   const isUserSearchingRef = useRef(false);

   // HANDLER FUNCTION TO GET THE SEARCHED VALUE:
   function handleSearchChange(e) {
      const username = e.target.value;

      clearTimeout(timerIdRef.current);
      isUserSearchingRef.current = true;

      setSearchParams(prev => {
         // IF SOMETHING IS TYPED:
         if (username) {
            // SET 'username' as QUERY PARAMETER WITH WHATEVER IS SEARCHED AS VALUE:
            prev.set('username', username);
            return prev;
         } else {
            // IF NO USERNAME IS TYPED, CLEAR THE QUERY PARAMETER:
            prev.delete('username')
         }
      })

      // DISPATCH SEARCH USERS REQUEST WITH 1.5 SECONDS:
      timerIdRef.current = setTimeout(() => {
         if (username) {
            dispatch(searchUsers(username))
            isUserSearchingRef.current = false;
         }
      }, 400)
   }

   function handleSearchSubmit(e) {
      e.preventDefault();
   }
   // GET THE SEARCH PARAMETER NAME:
   const currentUsername = searchParams.get('username') || '';

   return (
      <form onSubmit={handleSearchSubmit} className=" h-10 w-full flex my-1 px-2">
         <input
            className="h-10 text-black bg-gray-300 w-full p-2 rounded-lg"
            value={currentUsername}
            onChange={handleSearchChange}
            type="text"
            placeholder="Search" />
         <div className="bg-cyan-600 w-12 flex items-center justify-center ml-1 border border-white rounded-md">
            <button className="text-white cursor-pointer">
               <SearchIcon />
            </button>
         </div>
      </form>
   )
}

function SearchGroup() {
   const dispatch = useDispatch();
   //1. SEARCH PARAMS:
   const [searchParams, setSearchParams] = useSearchParams();
   // 1.1. GET THE SEARCH PARAMETER VALUE:
   const currentGroupName = searchParams.get('groupName') || '';

   // 2. DISPATCH THE SEARCH GROUPS AFTER THE USER HAS STOPPED TYPING:
   const timerIdRef = useRef(null);
   const isUserSearchingRef = useRef(false);

   // 1.2. HANDLER TO GET SEARCHED GROUP NAME:
   function handleSearchChange(e) {
      const groupName = e.target.value;

      // 2.1. CLEAR ALL THE PREVIOUS TIMER IDS:
      clearTimeout(timerIdRef.current);
      // 2.2. SET USER SEARCHING TO TRUE:
      isUserSearchingRef.current = true;

      // 1.3. SET THE "groupName" AS QUERY SEARCH PARAMETER AND STORE THE SEARCHED VALUE:
      setSearchParams((prev) => {
         if (groupName) {
            prev.set('groupName', groupName)
            return prev;
         } else {
            // DELETE THE "groupName" QUERY PARAM WHEN SEARCH BAR IS EMPTY:
            prev.delete('groupName')
            return prev;

         }
      })

      // 2.3. DISPATCH THE SEARCH GROUPS AFTER USER HAS STOPPED TYPING:
      timerIdRef.current = setTimeout(() => {
         if (groupName) {
            dispatch(searchGroups(groupName));

            // 2.4. SET TO IS USER SEARCHING FALSE WHEN USER HAS STOPPED TYPING:
            isUserSearchingRef.current = false;
         }
      }, 400)
   }

   // 1.4. HANDLER TO SUBMIT THE FORM:
   function handleSearchSubmit(e) {
      e.preventDefault();
   }
   return (
      <form onSubmit={handleSearchSubmit} className=" h-10 w-full flex my-1 px-2">
         <input
            className="h-10 text-black bg-gray-300 w-full p-2 rounded-lg"
            value={currentGroupName}
            onChange={handleSearchChange}
            type="text"
            placeholder="Search" />
         <div className="bg-cyan-600 w-12 flex items-center justify-center ml-1 border border-white rounded-md">
            <button className="text-white cursor-pointer">
               <SearchIcon />
            </button>
         </div>
      </form>
   )
}

export { AllUsersList, AddUsersButton, AddToGroupBtn, AddGroupDetails, SearchUser, SearchGroup, ConfirmDeleteAccount }