const settings = '/images/settings.png'

function GroupHeader() {
  return (
    <header className="bg-[#FF9B51] flex items-center py-4 px-4 shrink-0 w-full border border-gray-600">
      <div className='flex'>
        <div className='h-10 w-10 border border-gray-600 rounded-full'>
          <img src={settings} alt="" />
        </div>
        <div>
          <p>Name</p>
          <p>Online/Typing</p>
        </div>
      </div>
    </header>
  )
}

export default GroupHeader