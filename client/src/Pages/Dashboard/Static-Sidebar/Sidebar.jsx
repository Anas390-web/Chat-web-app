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


function Sidebar({ mode, handleLightMode, handleDarkMode, handleSwapComponent }) {
  const barIcons = [
    {
      id: 1,
      title: 'Chats',
      src: mode === 'dark' ? WhiteChats : Chats,
    },
    {
      id: 2,
      title: 'Groups',
      src: mode === 'dark' ? WhiteGroups : Groups,
    },
    {
      id: 3,
      title: 'Archives',
      src: mode === 'dark' ? WhiteArchives : Archives,
    },
    {
      id: 4,
      title: 'Settings',
      src: mode === 'dark' ? WhiteSettings : Settings,
    }
  ]

  return (
    <aside className='bg-[#FF9B51]  h-screen w-24 shrink-0 flex flex-col justify-between items-center px-2 py-1 font-semibold'>
      <div className='flex flex-col gap-4'>
        {/* DASHBOARD ICON */}
        <div className={mode === 'dark' ? 'dark-sidebar-icons' : 'sidebar-icons'}>
          <img className='size-7' src={mode === 'dark' ? WhiteDashboard : Dashboard} alt="Dashboard Icon" />
        </div>
        <hr />
        {/* BAR ICONS */}
        {
          barIcons.map((barIcon) => {
            return (
              <div key={barIcon.id} onClick={() => handleSwapComponent(barIcon.id)} className={mode === 'dark' ? 'dark-sidebar-icons' : 'sidebar-icons'}>
                <img className='size-7' src={barIcon.src} alt="Chats Icon" />
                <p>{barIcon.title}</p>
              </div>
            )
          })
        }
      </div>
      {/* LIGHT AND DARK MODE ICONS */}
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