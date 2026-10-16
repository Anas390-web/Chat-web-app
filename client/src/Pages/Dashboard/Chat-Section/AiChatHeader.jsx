

function AiChatHeader() {
   // GET SELECTED USER TO CHAT WITH DATA FROM STORE:

   const SowlBotImage = 'images/Sowl-bot-circle.png'
   return (
      <header className="bg-electric-cyan flex items-center py-4 px-4 shrink-0 w-full border border-gray-600 relative">
         <div className='flex gap-2'>
            <div className='h-10 w-10 border border-gray-600 rounded-full p-0.5 bg-white'>
               <img
                  className="rounded-full"
                  src={SowlBotImage}
                  alt='' />
            </div>
            <div>
               <p className="font-bold">
                  Sowl bot
               </p>
               <div>
                  <p>Online</p>
               </div>
            </div>
         </div>
      </header>
   )
}

export default AiChatHeader;