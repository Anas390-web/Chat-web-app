import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom'
import Sidebar from '../Pages/Dashboard/Static-Sidebar/Sidebar.jsx'
import { getAllUsers } from '../Features/authSlice.js';
import { useDispatch, useSelector } from 'react-redux'

function DashboardLayout() {
   const dispatch = useDispatch();
   // DARK/LIGHT MODE:
   const [mode, setMode] = useState(
      () => {
         return localStorage.getItem("theme")
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

   return (
      <div
         className={`min-h-dvh overflow-hidden flex ${mode === 'dark' && 'bg-[#111b21] text-gray-200'} ${mode === 'light' && 'bg-[#f1ebe7]'}`}>

         <Sidebar
            mode={mode}
            handleDarkMode={handleDarkMode}
            handleLightMode={handleLightMode} />
         <div className='flex-1 min-w-0 h-full'>
            <Outlet context={{ mode }} />
         </div>
      </div>
   )
}

export default DashboardLayout