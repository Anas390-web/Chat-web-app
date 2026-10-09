import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { KebabMenuIcon } from '../../../Icons/Icons.jsx';
import { signOut } from '../../../Features/authSlice.js';
import { Chats, Groups, Settings } from './Components/ConvoComponents.jsx';
import { AddUsersButton, AllUsersList, AddToGroupBtn, AddGroupDetails, ConfirmDeleteAccount } from './Components/OtherComponents.jsx';
import socket from '../../../Socket/socket.js';
import { handleScreen } from '../../../Features/screenSlice.js'

// FROM DASHBOARD
function SecondarySideBar() {
   const dispatch = useDispatch();
   const navigate = useNavigate();

   // ACCESSING THE DARK/LIGHT MODE & COMPONENTID FROM DAYSHBOARD LAYOUT:
   const { mode, componentId } = useOutletContext();

   // ACCESSING THE USER TO CHAT WITH DATA FROM AUTH STORE:
   const { selectedUserToChatData, selectedGroupToChatData } = useSelector((store) => store.auth);
   // SELECTED USERS STATE FROM USERS LIST:
   const [users, setUsers] = useState([]);

   function handleUserChange(e) {
      const value = e.target.value;
      if (!value || value === 'All users') return;
      setUsers((prev) => {
         // CHECK FOR NO DUPLICATION:
         if (prev.includes(value)) return prev;
         return [
            ...prev, value
         ]
      });
   };

   // TO REMOVE THE SELECTED USERS ON CLICKING THE CLOSE ICON:
   function handleRemoveUser(userId) {
      const newUsers = users.filter((user) => {
         return user !== userId
      })
      setUsers(newUsers);
   }
   // TOGGLE KEBAB MENU OPEN:
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   function toggleMenu() {
      setIsMenuOpen(!isMenuOpen);
   }

   // COMPONENTS ARRAY:
   const components = [
      {
         id: 1,
         component: <Chats
            users={users} />
      },
      {
         id: 2,
         component: <Groups />
      },
      {
         id: 4,
         component: <Settings />
      },
   ]

   // SIGN OUT THE USER:
   function handleSignOut() {
      // WHEN USER SIGN OUT THE SESSION, CLOSE THE CONNECTION:
      socket.disconnect();
      dispatch(signOut());
      // NAVIGATION TO LOGIN PAGE:
      const token = localStorage.getItem("accessToken")
      if (!token) {
         navigate('/login');
      }
   }

   // OPEN THE GROUP DETAILS BOX TO ADD A NAME:
   const [openDetails, setOpenDetails] = useState(false)
   function openDetailsBox() {
      setOpenDetails(true);
   }
   function closeDetailsBox() {
      setOpenDetails(false);
   }

   const [isDeleteBoxOpen, setIisDeleteBoxOpen] = useState(false);

   function openDeleteBox() {
      setIisDeleteBoxOpen(true);
   }
   function closeDeleteBox() {
      setIisDeleteBoxOpen(false);
   }

   // IF USER CLICKS ON ONE OF THE CHATS AND SCREEN IS MOBILE SCREEN, CHAT TAKES FULL WIDTH:

   useEffect(() => {
      function handleResize() {
         // IT STAYS FALSE ON EVERY VIEWPORT CHANGE EXCEPT 639 OR LESS SO REACT IGNORES THE RE-RENDERING FOR THE SAME VALUES AND ONLY SHOWS TRUE IF IT HITS 639.

         dispatch(handleScreen(window.innerWidth <= 639));
      }
      // WINDOW RESIZING LISTENER:
      window.addEventListener("resize", handleResize);
      return () => {
         window.removeEventListener("resize", handleResize);
      }
   }, [])

   const { isMobileScreen } = useSelector((store) => store.screen);

   return (
      <aside className={`h-screen overflow-hidden sm:w-70 lg:w-100 flex flex-col justify-start font-semibold border border-gray-600 shadow ${isMobileScreen && selectedUserToChatData._id || selectedGroupToChatData?._id ? 'w-0' : 'w-full'}`}>

         <>
            <div className="bg-electric-cyan border-b border-gray-600 h-20 flex items-center justify-between px-4 shrink-0 relative">

               <div className='flex gap-1.5 items-center'>
                  <div className='w-12 h-12'>
                     <img className='size-12 rounded-full' src="images/Sermo-logo-picture.jpg" alt="Sermo app logo" />
                  </div>

                  <h1 className='text-white tracking-wide text-[40px] font-cherry-bomb-one'>Sermo</h1>
               </div>


               <div className='cursor-pointer relative' onClick={toggleMenu}>
                  <KebabMenuIcon />
                  {
                     isMenuOpen &&
                     <div className='flex flex-col bg-white w-40 mt-2 absolute right-0'>
                        <button
                           className='text-left text-red-500 flex-1 min-w-0 p-2 mx-1 border-b hover:bg-gray-100 cursor-pointer'
                           onClick={openDeleteBox}>Delete account</button>
                        <button
                           onClick={handleSignOut}
                           className='text-left flex-1 min-w-0 p-2 mx-1 border-b hover:bg-gray-100 cursor-pointer'
                        >Sign Out</button>
                     </div>
                  }
               </div>
            </div>

            <div className="h-10 flex items-center mb-1 px-2">
               <h2 className={mode === 'dark' ? 'text-white' : 'text-black'}>Messages</h2>
            </div>
            <AllUsersList
               users={users}
               handleUserChange={handleUserChange}
               handleRemoveUser={handleRemoveUser} />
            {
               componentId === 1 ?
                  <AddUsersButton users={users} />
                  :
                  <AddToGroupBtn
                     users={users}
                     openDetailsBox={openDetailsBox} />
            }
            <div className=" h-10 w-full flex mb-1 px-2">
               <input
                  className="h-10 text-black bg-gray-300 w-full p-2 rounded-lg"
                  type="text"
                  placeholder="Search" />
            </div>
            {
               openDetails && users.length > 1 &&
               <AddGroupDetails
                  users={users}
                  closeDetailsBox={closeDetailsBox} />
            }
            {
               isDeleteBoxOpen &&
               <ConfirmDeleteAccount
                  closeDeleteBox={closeDeleteBox} />
            }
            {
               components.map((barComponent) => {

                  return barComponent.id === componentId && (
                     <div
                        key={barComponent.id}
                        className='h-full flex flex-col min-h-0 overflow-hidden' >
                        {barComponent.component}
                     </div>
                  )
               })
            }

         </>



      </aside>
   )
}

export default SecondarySideBar;