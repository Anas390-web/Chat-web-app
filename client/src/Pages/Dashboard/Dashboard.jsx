import SecondarySideBar from "./Secondary-Sidebar/Secondary-Sidebar.jsx"
import Chat from "./Chat-Section/Chat.jsx";
import { useSelector } from "react-redux";
import GroupChat from "./Chat-Section/groupChat.jsx";

function Dashboard() {
  // ACCESSING GROUPID FROM THE STORE:
  const { groupId } = useSelector((store) => store.ids);
  return (
    <div className='h-screen flex'>
      <SecondarySideBar />
      <div className="flex-1 min-w-0 flex flex-col">
        {/* IF USER CLICKS ON THE GROUP, THE GROUP CHAT SHOULD APPEAR */}
        {
          groupId && groupId.length > 0 ?
            <div className="flex-1 min-h-0 flex flex-col">
              <GroupChat />
            </div>
            :
            <div className="flex-1 min-h-0 flex flex-col">
              <Chat />
            </div>
        }
      </div>
    </div>
  )
}

export default Dashboard;