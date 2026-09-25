import SecondarySideBar from "./Secondary-Sidebar/Secondary-Sidebar.jsx"
import Header from "./Chat-Section/Header.jsx"
import Chat from "./Chat-Section/Chat.jsx";

function Dashboard() {
  return (
    <div className='h-screen flex'>
        <SecondarySideBar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Header />
        <div className="flex-1 min-h-0 flex flex-col">
          <Chat />
        </div>
      </div>
    </div>
  )
}

export default Dashboard;