import { SendIcon } from '../../../../public/icons/Icons.jsx';


function Chat() {
   return (
      <main className="h-full">
         <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
               Chat area
            </div>
            <div className="bg-gray-200 min-h-16 flex items-center px-3 py-2 w-full box-border border border-gray-400 gap-2">
               <input
                  className="bg-white h-10 flex-1 min-w-0 px-3 outline-none rounded border"
                  type="text"
               />
               <div className='h-10 flex justify-center items-center'>
                  <SendIcon />
               </div>

            </div>
         </div>
      </main>
   )
}

export default Chat;