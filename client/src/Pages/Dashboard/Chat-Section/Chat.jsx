import { SendIcon } from '../../../Icons/Icons.jsx'
import { useOutletContext } from 'react-router-dom';

function Chat() {
   const { mode } = useOutletContext();
   return (
      <main className="h-full">
         <div className="flex flex-col h-full">
            <div className={`flex-1 overflow-y-auto ${mode === 'dark' ? "bg-[url(/images/Black-Doodle.jpg)] bg-contain bg-center" : "bg-[url(/images/White-Doodle.jpg)] bg-contain bg-center"}`}>
               <div>
                  Chat area
               </div>
            </div>
            <div className="min-h-16 flex items-center px-3 py-2 w-full box-border border border-gray-600 gap-2">
               <input
                  className="h-10 flex-1 min-w-0 px-3 outline-none rounded border border-gray-600"
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