import { useDispatch, useSelector } from "react-redux";
import { addUsers } from "../../../../Features/contactsSlice.js";
import { ClosePageIcon, CrossIcon } from "../../../../Icons/Icons.jsx";
import { creatAGroup } from "../../../../Features/groupListSlice.js";
import { useState } from "react";

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
                     return (
                        <option className='text-black' key={user._id} value={user._id}>{user.username}</option>
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
            className='bg-[#FF9B51] border border-amber-900 flex-1 p-1 rounded-md text-white shadow-2xl shadow-gray-400 cursor-pointer'
            onClick={() => handleAddUsers(users)}>Add User</button>
      </div>
   )
}

// BUTTON WHICH OPENS THE POP-UP TO ADD THE GROUP DETAILS:
function AddToGroupBtn({ openDetailsBox, users }) {
   return (
      <div className='flex w-full px-2 mb-1'>
         <button
            className='bg-[#FF9B51] border border-amber-900 flex-1 p-1 rounded-md text-white shadow-2xl shadow-gray-400 cursor-pointer'
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
   const [groupDetails, setGroupDetails]= useState({
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
   function handleSubmit(e){
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
                     className="bg-orange-400 text-white w-full font-light p-1.5 rounded-md">Create a Group</button>
               </div>
            </form>
         </div>
      </div>
   )
}

export { AllUsersList, AddUsersButton, AddToGroupBtn, AddGroupDetails }