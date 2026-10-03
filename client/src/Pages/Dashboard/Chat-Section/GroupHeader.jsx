import { useSelector } from "react-redux"

const settings = '/images/settings.png'

function GroupHeader() {
  // GET SELECTED GROUP DATA FROM STORE:
  const { selectedGroupToChatData } = useSelector((store) => store.auth);
  // PARTICIPANTS FROM THE DATA:
  const participants = selectedGroupToChatData?.participants;

  return (
    <header className="bg-[#FF9B51] flex items-center py-4 px-4 shrink-0 w-full border border-gray-600">
      <div className='flex gap-1'>
        <div className='h-10 w-10 border border-gray-600 rounded-full'>
          <img src={settings} alt="" />
        </div>
        <div>
          <p className="font-bold text-[20px]">{selectedGroupToChatData.groupName}</p>
          <div className="flex gap-1">
            {
              selectedGroupToChatData && participants &&
              participants.map((groupData) => {
                return (
                  <p key={groupData?._id} className="text-[12px]">{groupData?.username},</p>
                )
              })
            }
          </div>
        </div>
      </div>
    </header>
  )
}

export default GroupHeader