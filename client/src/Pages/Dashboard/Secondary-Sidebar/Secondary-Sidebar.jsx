import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { KebabMenuIcon } from '../../../Icons/Icons.jsx';
import { signOut } from '../../../Features/authSlice.js';
import { Chats, Groups, Archives, Settings } from './Components/Components.jsx';

function SecondarySideBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // ACCESSING AUTH STATE:
  const { allUsers } = useSelector((store) => store.auth);
  // ACCESSING THE DARK/LIGHT MODE & COMPONENTID FROM DAYSHBOARD LAYOUT:
  const { mode, componentId } = useOutletContext();
  // TOGGLE KEBAB MENU OPEN:
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  // COMPONENTS ARRAY:
  const components = [
    {
      id: 1,
      component: <Chats />
    },
    {
      id: 2,
      component: <Groups />
    },
    {
      id: 3,
      component: <Archives />
    },
    {
      id: 4,
      component: <Settings />
    },
  ]

  // SIGN OUT THE USER:
  function handleSignOut() {
    dispatch(signOut());
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate('/login');
    }
  }
  return (
    <aside className="h-screen w-full sm:w-70 lg:w-100 flex flex-col justify-start font-semibold border border-gray-600">
      <div className="flex flex-col gap-2">
        <div className="bg-[#FF9B51] border-b border-gray-600 h-20 flex items-center justify-between px-4 shrink-0 relative">
          <h1 className='text-white tracking-wide uppercase'>chatty</h1>

          <div className='cursor-pointer relative' onClick={toggleMenu}>
            <KebabMenuIcon />
            {
              isMenuOpen &&
              <div className='flex flex-col bg-white w-40 mt-2 absolute right-0'>
                <button className='text-left text-red-500 flex-1 min-w-0 p-2 mx-1 border-b hover:bg-gray-100 cursor-pointer'>Delete user</button>
                <button
                  onClick={handleSignOut}
                  className='text-left flex-1 min-w-0 p-2 mx-1 border-b hover:bg-gray-100 cursor-pointer'
                >Sign Out</button>
              </div>
            }
          </div>
        </div>

        <div className="h-10 flex items-center mb-1 px-2">
          <h2 className={mode === 'dark' ? 'text-white' : 'text-black'}>Messages (25)</h2>
        </div>
        <div className='h-10 flex items-center mb-1 px-2'>
          <select className='flex-1 border border-gray-400 p-1 rounded-md cursor-pointer'>
            <option value="All users">All users</option>
            {
              allUsers.length > 0 &&
              allUsers.map((user) => {
                return (
                  <option className='text-black' key={user._id} value={user.username}>{user.username}</option>
                )
              })
            }
          </select>
        </div>
        <div className='flex w-full px-2 mb-1'>
          <button className='bg-[#FF9B51] border border-amber-900 flex-1 p-1 rounded-md text-white shadow-2xl shadow-gray-400 cursor-pointer'>Add User</button>
        </div>
        <div className=" h-10 w-full flex mb-1 px-2">
          <input
            className="h-10 text-black bg-gray-300 w-full p-2 rounded-lg"
            type="text"
            placeholder="Search" />
        </div>
        {
          components.map((barComponent) => {
            
            return barComponent.id === componentId && (
              <div key={barComponent.id}>
                {barComponent.component}
              </div>
            )
          })
        }
      </div>
    </aside>
  )
}

export default SecondarySideBar;