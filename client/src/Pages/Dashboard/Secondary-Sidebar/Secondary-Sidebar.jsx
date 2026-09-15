import { KebabMenuIcon } from '../../../Icons/Icons.jsx';
const settings = '/images/settings.png';


function SecondarySideBar() {
  return (
    <aside className="bg-gray-100 h-screen w-full sm:w-70 lg:w-100 flex flex-col justify-start font-semibold border">
      <div className="flex flex-col gap-2">
        <div className="bg-purple-300 h-20 flex items-center justify-between px-4 shrink-0">
          <h1 className='tracking-wide uppercase'>chatty</h1>
          <div>
            <KebabMenuIcon />
          </div>
        </div>
        <div className="h-10 flex items-center mb-1 px-2">
          <h2>Messages (25)</h2>
        </div>
        <div className=" h-10 w-full flex mb-1 px-2">
          <input
            className="h-10 bg-white w-full p-2 rounded-lg"
            type="text"
            placeholder="Search" />
        </div>
        <div className='flex gap-2 px-2'>
          <div className='h-10 w-10 border rounded-full'>
            <img src={settings} alt="" />
          </div>
          <div>
            <div>
              <p>Ali Haider</p>
            </div>
            <div>
              <p className='font-light text-sm'>Latest message from chats</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default SecondarySideBar;