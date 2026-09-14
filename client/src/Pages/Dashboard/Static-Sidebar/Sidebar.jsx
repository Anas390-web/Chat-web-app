import Dashboard from '../../../../public/images/Dashboard.png';
import Chats from '../../../../public/images/chats.png';
import Groups from '../../../../public/images/groups.png';
import Settings from '../../../../public/images/settings.png';
import Archives from '../../../../public/images/Archives.png';
import { LightIcon, DarkIcon } from '../../../../public/icons/Icons.jsx'


function Sidebar() {
  return (
    <aside className='h-screen w-24 shrink-0 bg-gray-200 flex flex-col justify-between items-center px-2 py-1 font-semibold'>
      <div className='flex flex-col gap-4'>
        <div className='sidebar-icons'>
          <img className='size-7' src={Dashboard} alt="Dashboard Icon" />
        </div>
        <hr />
        <div className='sidebar-icons'>
          <img className='size-7' src={Chats} alt="Chats Icon" />
          <p>Chats</p>
        </div>
        <div className='sidebar-icons'>
          <img className='size-7' src={Groups} alt="Groups Icon" />
          <p>Groups</p>
        </div>
        <div className='sidebar-icons'>
          <img className='size-7' src={Archives} alt="Archives Icon" />
          <p>Archives</p>
        </div>
        <div className='sidebar-icons'>
          <img className='size-7' src={Settings} alt="Settings Icon" />
          <p>Settings</p>
        </div>
      </div>
      <div className='flex flex-col justify-center items-center gap-4'>
        <div className='sidebar-icons'>
          <p>{<LightIcon />}</p>
        </div>
        <div className='sidebar-icons'>
          <p>{<DarkIcon />}</p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar