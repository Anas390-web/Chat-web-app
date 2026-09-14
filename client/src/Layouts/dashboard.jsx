import { Outlet } from 'react-router-dom'
import Sidebar from '../Pages/Dashboard/Static-Sidebar/Sidebar.jsx'

function DashboardLayout() {
   return (
      <div className='min-h-dvh overflow-hidden flex'>
         <Sidebar />
         <div className='flex-1 min-w-0 h-full'>
            <Outlet />
         </div>
      </div>
   )
}

export default DashboardLayout