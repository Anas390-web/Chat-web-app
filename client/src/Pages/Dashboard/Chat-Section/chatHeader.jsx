import { useSelector } from "react-redux";


function ChatHeader() {
  // GET SELECTED USER TO CHAT WITH DATA FROM STORE:
  const { selectedUserToChatData, onlineUsers } = useSelector((store) => store.auth);
  const isUserDeleted = selectedUserToChatData?.username?.split("_")[0] === 'deleted';

  const blankImage = 'images/Blank-User-Image.png'
  return (
    <header className="bg-electric-cyan flex items-center py-4 px-4 shrink-0 w-full border border-gray-600 relative">
      <div className='flex gap-2'>
        <div className='h-10 w-10 border border-gray-600 rounded-full p-0.5 bg-white'>
          <img
            className="rounded-full"
            src={
              selectedUserToChatData?.userAvatarUrl !== null ?
                selectedUserToChatData?.userAvatarUrl
                :
                blankImage
            } alt={
              selectedUserToChatData?.userAvatarUrl !== null ?
                selectedUserToChatData?.userAvatarUrl
                :
                blankImage
            } />
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
          <div>
            {
              onlineUsers && selectedUserToChatData &&
              <p
                className={`transition-all duration-1000 ease-in ${onlineUsers.includes(selectedUserToChatData?._id) ?
                    'opacity-100 max-h-6' : 'opacity-100 max-h-6 overflow-hidden'
                  }`}
              >
                {
                  onlineUsers.includes(selectedUserToChatData?._id) ? 'Online' : 'Offline'
                }
              </p>
            }
          </div>
        </div>
      </div>
    </header>
  )
}

export default ChatHeader