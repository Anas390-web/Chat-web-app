import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { addUsers } from "../../../../Features/contactsSlice.js";

function AllUsersList({ users, handleUserChange }) {
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
                     <div key={user.userContactId} className="flex flex-col h-10 justify-center items-center border w-10 rounded-full">
                        <div className="flex">
                           <img className="h-4 w-4 rounded" src="/images/Blank-User-Image.png" alt="Blank User Image" />
                        </div>
                        <p></p>
                     </div>
                  )
               })
            }
         </div>
      </div>
   )
}

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

export { AllUsersList, AddUsersButton }