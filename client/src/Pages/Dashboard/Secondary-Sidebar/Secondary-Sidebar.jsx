import settings from '../../../public/images/settings.png';


function SecondarySideBar() {
  return (
    <aside className="h-screen w-screen sm:w-80 lg:w-100 flex flex-col justify-start px-2 py-1 font-semibold border">
      <div className="flex flex-col gap-2">
        <div className=" h-16 flex items-center">
          <h1>Bingo</h1>
        </div>
        <div className=" h-10 flex items-center mb-1">
          <h2>Messages (25)</h2>
        </div>
        <div className=" h-10 w-full flex mb-1">
          <input
            className="h-10 bg-gray-200 w-full p-2 rounded-lg"
            type="text"
            placeholder="Search" />
        </div>
        <div className='flex gap-2'>
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