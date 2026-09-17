import { LightIcon, DarkIcon } from '../../../Icons/Icons'

// IMAGES FROM ROOT PUBLIC FOLDER:
const Dashboard = '/images/Dashboard.png';
const Chats = '/images/chats.png';
const Groups = '/images/groups.png';
const Settings = '/images/settings.png';
const Archives = '/images/Archives.png';

const WhiteDashboard = '/images/White-dashboard.png'
const WhiteChats = '/images/White-chats.png'
const WhiteGroups = '/images/White-groups.png'
const WhiteArchives = '/images/White-archives.png'
const WhiteSettings = '/images/White-settings.png'


function Sidebar({ mode, handleLightMode, handleDarkMode }) {
  return (
    <aside className='bg-[#FF9B51]  h-screen w-24 shrink-0 flex flex-col justify-between items-center px-2 py-1 font-semibold'>
      <div className='flex flex-col gap-4'>
        <div className={mode === 'dark' ? 'dark-sidebar-icons' : 'sidebar-icons'}>
          <img className='size-7' src={mode === 'dark' ? WhiteDashboard : Dashboard} alt="Dashboard Icon" />
        </div>
        <hr />
        <div className={mode === 'dark' ? 'dark-sidebar-icons' : 'sidebar-icons'}>
          <img className='size-7' src={mode === 'dark' ? WhiteChats : Chats} alt="Chats Icon" />
          <p>Chats</p>
        </div>
        <div className={mode === 'dark' ? 'dark-sidebar-icons' : 'sidebar-icons'}>
          <img className='size-7' src={mode === 'dark' ? WhiteGroups : Groups} alt="Groups Icon" />
          <p>Groups</p>
        </div>
        <div className={mode === 'dark' ? 'dark-sidebar-icons' : 'sidebar-icons'}>
          <img className='size-7' src={mode === 'dark' ? WhiteArchives : Archives} alt="Archives Icon" />
          <p>Archives</p>
        </div>
        <div className={mode === 'dark' ? 'dark-sidebar-icons' : 'sidebar-icons'}>
          <img className='size-7' src={mode === 'dark' ? WhiteSettings : Settings} alt="Settings Icon" />
          <p>Settings</p>
        </div>
      </div>
      <div className='flex flex-col justify-center items-center gap-4'>
        <div className={mode === 'dark' ? 'dark-sidebar-icons' : 'sidebar-icons'} onClick={() => handleLightMode()}>
          <p>{<LightIcon />}</p>
        </div>
        <div className={mode === 'dark' ? 'dark-sidebar-icons' : 'sidebar-icons'} onClick={() => handleDarkMode()}>
          <p>{<DarkIcon />}</p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar