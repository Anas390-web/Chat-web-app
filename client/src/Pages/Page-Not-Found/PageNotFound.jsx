import { NavLink } from "react-router-dom"


function PageNotFound() {
   return (
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
   )
}

export default PageNotFound