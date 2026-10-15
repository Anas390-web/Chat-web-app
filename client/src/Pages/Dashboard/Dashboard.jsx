import SecondarySideBar from "./Secondary-Sidebar/Secondary-Sidebar.jsx"
import Chat from "./Chat-Section/Chat.jsx";
import { useDispatch, useSelector } from "react-redux";
import GroupChat from "./Chat-Section/groupChat.jsx";
import { useEffect } from "react";
import socket from "../../Socket/socket.js";
import { setAiChatLoggedInUserId } from "../../Features/aiBotSlice.js";
import SowlBotChat from "./Chat-Section/SowlBotChat.jsx";

function Dashboard() {
  const dispatch = useDispatch();
  // ACCESSING GROUPID FROM THE STORE:
  const { groupId } = useSelector((store) => store.ids);

  // ACCESSING THE AI CHAT LOGGED IN USER ID FROM AI BOT STORE:
  const { aiChatLoggedInUserId } = useSelector((store) => store.aiBot);

  // LISTENING TO AN EVENT EMITTED BY THE SHOW-AI-CHAT EVENT LISTENER:
  useEffect(() => {
    function handleGetLoggedInUserId(userId) {
      dispatch(setAiChatLoggedInUserId(userId));
    }

    socket.on("get-logged-in-user-id", handleGetLoggedInUserId);

    return () => {
      socket.off("get-logged-in-user-id", handleGetLoggedInUserId);

    }
  }, [dispatch])
  return (
    <div className='h-screen flex'>
      <SecondarySideBar />
      <div className="flex-1 min-w-0 flex flex-col">
        {
          aiChatLoggedInUserId && aiChatLoggedInUserId.length > 0 ? (
            <div className="flex-1 min-h-0 flex flex-col">
              <SowlBotChat />
            </div>
          )
            :
            groupId && groupId.length > 0 ? (
              <div className="flex-1 min-h-0 flex flex-col">
                <GroupChat />
              </div>
            )
              :
              (
                <div className="flex-1 min-h-0 flex flex-col">
                  <Chat />
                </div>
              )
        }

      </div>
    </div>
  )
}

export default Dashboard;