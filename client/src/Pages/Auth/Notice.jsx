



function Notice({closeNotice}) {
   return (
      <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex justify-center items-center font-inter">

         <div className="flex flex-col items-center z-50 p-3 h-100 sm:h-100 w-full sm:w-100 bg-white rounded-md">

            <div className="w-full flex-1 flex flex-col justify-center items-center">
               <div className="w-full">
                  <p className="text-blue-600">Notice before moving on:</p>
               </div>

               <div className="m-2 p-3 flex-1 border border-gray-500 shadow-inner shadow-gray-400 rounded-md">
                  <ul className="flex flex-col gap-2 text-[12px] font-light list-disc">
                     <li className="">
                        Deleting your account permanently removes your username, email, password and avatar from our servers.
                     </li>
                     <li className="">
                        Any messages sent prior to account deletion will remain in group and direct chat histories so other users do not lose conversation context.
                     </li>
                     <li className="">
                        Upon account deletion, all past messages will be unlinked from your identity and attributed to "Deleted User".
                     </li>
                  </ul>
               </div>

            </div>

            <div className=" flex justify-center items-center gap-10">
               <button
                  onClick={closeNotice}
                  className="border border-blue-600 text-blue-600 w-20 py-1 rounded-sm cursor-pointer"
               >
                  Accept
               </button>
            </div>
         </div>
      </div>
   )
}

export default Notice