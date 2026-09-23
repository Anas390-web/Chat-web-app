import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom'
import Sidebar from '../Pages/Dashboard/Static-Sidebar/Sidebar.jsx'
import { getAllUsers } from '../Features/authSlice.js';
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom';
import socket from '../Socket/socket.js'

function DashboardLayout() {
   const dispatch = useDispatch();

   // ACCESSING TOKEN FROM THE STORE:
   const { token } = useSelector((store) => store.auth)
   // SOCKET CONNECTION WITH SERVER:
   const handleConnection = () => {
      console.log('CONNECTED WITH SERVER')
   }
   useEffect(() => {
      if (token) {
         // ATTACHING TOKEN TO SEND TO THE SERVER FOR AUTHENTICATION:
         socket.auth = { token };
         socket.on('connect', handleConnection)

         // CHECK IF SOCKET IS CONNECTED OR NOT:
         if (socket.connected) {
            handleConnection();
         } else {
            socket.connect();
         }
      }
      // CLEANUP FUNCTION:
      return () => {
         // CLEAN UP THE EVENT LISTENER
         socket.off('connect', handleConnection);
         // DISCONNECTION EXISTS ON THE USER SIGNOUT
      }
   }, [token])


   // SWAP SIDEBAR COMPONENTS (CHATS, GROUPS, ARCHIVES) BASED ON THE ID:
   const [componentId, setComponentId] = useState(null);
   function handleSwapComponent(getCompId) {
      setComponentId(getCompId);
   }
   // const { token } = useSelector((store) => store.auth);
   // DARK/LIGHT MODE:
   const [mode, setMode] = useState(
      () => {
         return localStorage.getItem("theme") || 'light' // fallback value
      }
   );

   // THE MOMENT MODE IS CHANGED, CHANGE THE THEME TO MODE:
   useEffect(() => {
      localStorage.setItem("theme", mode)
   }, [mode])

   function handleDarkMode() {
      setMode('dark');
   }
   function handleLightMode() {
      setMode('light');
   }

   // GET THE ARRAY OF ALL THE USERS:
   useEffect(() => {
      if (token) {
         dispatch(getAllUsers(token))
      }
   }, [dispatch, token])
   return (
      <>
         {
            // ONLY MOUNT DASHBOARD IF THE TOKEN IS PRESENT:
            token ?
               <div
                  className={`min-h-dvh overflow-hidden flex ${mode === 'dark' && 'bg-[#111b21] text-gray-200'} ${mode === 'light' && 'bg-[#f1ebe7]'}`}>

                  <Sidebar
                     mode={mode}
                     handleDarkMode={handleDarkMode}
                     handleLightMode={handleLightMode}
                     handleSwapComponent={handleSwapComponent} />
                  <div className='flex-1 min-w-0 h-full'>
                     <Outlet context={{ mode, componentId }} />
                  </div>
               </div>
               :
               <div className='min-h-dvh flex justify-center items-center'>
                  <div className='h-full sm:h-100 w-full sm:w-200 flex flex-col items-center justify-evenly'>
                     <h1 className='font-mono text-red-700 text-6xl'>PAGE NOT FOUND</h1>
                     <div className='flex gap-2 bg-amber-400'>
                        <p>Go back to the Login page!</p>
                        <NavLink
                           to={'/login'}>
                           Login
                        </NavLink>
                     </div>
                  </div>
               </div>
         }
      </>
   )
}

export default DashboardLayout