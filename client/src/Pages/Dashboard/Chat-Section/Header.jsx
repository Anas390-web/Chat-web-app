const settings = '/images/settings.png'

function Header() {
  return (
    <header className="h-20 bg-blue-200 flex items-center px-4 shrink-0 w-full">
      <div className='flex'>
        <div className='h-10 w-10 border rounded-full'>
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

export default Header