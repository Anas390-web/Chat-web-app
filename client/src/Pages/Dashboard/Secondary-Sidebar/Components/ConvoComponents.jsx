import { useOutletContext } from "react-router-dom"
const BlankImage = '/images/Blank-User-Image.png';

function Chats() {
   const { mode } = useOutletContext();
   return (
      <div className={`flex gap-2 mx-2 p-2 rounded-md ${mode === 'dark' ? 'border border-gray-600' : 'bg-white'}`}>
         <div className='h-10 w-10 border border-gray-600 rounded-full'>
            <img src={BlankImage} alt="" />
         </div>
         <div>
            <div>
               <p>Ali Haider</p>
            </div>
            <div>
               <p className='font-light text-sm'>Latest message from chats</p>
            </div>
         </div>
      </div>
   )
}

function Groups() {
   const { mode } = useOutletContext();
   return (
      <div className={`flex gap-2 mx-2 p-2 rounded-md ${mode === 'dark' ? 'border border-gray-600' : 'bg-white'}`}>
         <div className='h-10 w-10 border border-gray-600 rounded-full'>
            <img src={BlankImage} alt="" />
         </div>
         <div>
            <div>
               <p>Group 1</p>
            </div>
            <div>
               <p className='font-light text-sm'>Latest message from group chat</p>
            </div>
         </div>
      </div>
   )
}

function Archives() {
   const { mode } = useOutletContext();
   return (
      <div className={`flex gap-2 mx-2 p-2 rounded-md ${mode === 'dark' ? 'border border-gray-600' : 'bg-white'}`}>
         <div className='h-10 w-10 border border-gray-600 rounded-full'>
            <img src={BlankImage} alt="" />
         </div>
         <div>
            <div>
               <p>User</p>
            </div>
            <div>
               <p className='font-light text-sm'>Latest message from user</p>
            </div>
         </div>
      </div>
   )
}

function Settings() {
   const { mode } = useOutletContext();
   return (
      <div className={`flex gap-2 mx-2 p-2 rounded-md ${mode === 'dark' ? 'border border-gray-600' : 'bg-white'}`}>
         <div className='h-10 w-10 border border-gray-600 rounded-full'>
            <img src={BlankImage} alt="" />
         </div>
         <div>
            <div>
               <p>Settings 1</p>
            </div>
            <div>
            </div>
         </div>
      </div>
   )
}

export { Chats, Groups, Archives, Settings }