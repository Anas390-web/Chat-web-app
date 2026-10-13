import { useOutletContext } from "react-router";


function SowlBotChat() {
   const { mode } = useOutletContext();
   let a = true;
   return (
      <div className='flex flex-col h-full overflow-hidden'>
         <main className="flex-1 min-h-0 flex flex-col">
            {
               a ?
                  <div className="flex flex-col h-full">
                     <ChatHeader />
                     <div className={`flex-1 overflow-y-auto ${mode === 'dark' ? "bg-[url(/images/Black-Doodle.jpg)] bg-contain bg-center" : "bg-[url(/images/White-Doodle.jpg)] bg-contain bg-center"}`}>
                        <div>
                           <MsgBubble

                           />
                        </div>
                     </div>

                     <form className="min-h-16 flex items-center px-3 py-2 w-full box-border border border-gray-600 gap-2">
                        <input
                           className="h-10 flex-1 min-w-0 px-3 outline-none rounded border border-gray-600"
                           type="text"
                           placeholder='Write message...'
                        />
                        <div className='h-10 flex justify-center items-center'>
                           <button><SendIcon /></button>
                        </div>

                     </form>
                  </div>
                  :
                  <div className={`flex flex-col justify-center items-center h-full ${mode === 'dark' ? "bg-[url(/images/Black-Doodle.jpg)] bg-contain bg-center" : "bg-[url(/images/White-Doodle.jpg)] bg-contain bg-center"}`}>
                     <div className='size-1/2 sm:w-3xl'>
                        <img src="/images/Owl.png" alt="Squared face owl drawing" />
                     </div>
                     <div className='text-[min(4vw,36px)] bg-cyan-800 px-6 rounded-md'>
                        <p className='text-white '>START A CHAT</p>
                     </div>
                  </div>
            }
         </main>
      </div>
   )
}

export default SowlBotChat