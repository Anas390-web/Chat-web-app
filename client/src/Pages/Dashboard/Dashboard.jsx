import SecondarySideBar from "./Secondary-Sidebar/Secondary-Sidebar.jsx"

function Dashboard() {
  return (
    <div className='h-screen grid grid-cols-2'>
        <SecondarySideBar />
      <div>
        Dashboard
      </div>
    </div>
  )
}

export default Dashboard