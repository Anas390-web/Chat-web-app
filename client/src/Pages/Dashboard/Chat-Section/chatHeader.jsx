import { useSelector } from "react-redux";

const settings = '/images/settings.png'

function ChatHeader() {
  // GET SELECTED USER TO CHAT WITH DATA FROM STORE:
  const { selectedUserToChatData } = useSelector((store) => store.auth);
  const isUserDeleted = selectedUserToChatData?.username?.split("_")[0] === 'deleted';
  
  return (
    <header className="bg-electric-cyan flex items-center py-4 px-4 shrink-0 w-full border border-gray-600 relative">
      <div className='flex gap-2'>
        <div className='h-10 w-10 border border-gray-600 rounded-full'>
          <img src={settings} alt="" />
        </div>
        <div>
          <p className="font-bold">
            {
              selectedUserToChatData &&
              isUserDeleted ?
              'Deleted_user'
              : selectedUserToChatData?.username
            }
            </p>
          <p>Online/Typing</p>
        </div>
      </div>
    </header>
  )
}

export default ChatHeader