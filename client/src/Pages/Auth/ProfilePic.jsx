import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setAvatarUrl } from '../../Features/authSlice.js'

function ProfilePic() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // SET IMAGE URL:
  const [url, setUrl] = useState('images/Blank-User-Image.png');
  const { token } = useSelector((store) => store.auth);

  function setPicture(imgUrl) {
    setUrl(imgUrl);
  }

  // IF TOKEN IS PRESENT DISPATCH SETAVATARURL THUNK:
  async function saveAvatar() {
    try {
      if (!token) {
        return;
      }
      await dispatch(setAvatarUrl(url)).unwrap();

      navigate('/dashboard')
    } catch (error) {
      console.log(error.message);
      return error.message
    }
  }

  // AVATARS ARRAY:
  const avatars = [
    {
      id: 1,
      imgUrl: 'images/beard-man-avatar.jpg'
    },
    {
      id: 2,
      imgUrl: 'images/african-boy-avatar.jpg'
    },
    {
      id: 3,
      imgUrl: 'images/old-man-avatar.jpg'
    },
    {
      id: 4,
      imgUrl: 'images/brown-hair-women-avatar.jpg'
    },
    {
      id: 5,
      imgUrl: 'images/african-girl-avatar.jpg'
    },
    {
      id: 6,
      imgUrl: 'images/short-hair-girl-avatar.jpg'
    }
  ]


  return (
    <div className="flex flex-col justify-center items-center gap-4 border border-gray-200 size-full sm:size-100 p-4 shadow">
      <div className="border size-40 rounded-full p-1">
        <img className="rounded-full" src={url} alt={url.split("/")[1]} />
      </div>
      <div className="w-full">
        <p className="font-bold">Choose an avatar:</p>
      </div>
      <div className="flex gap-1 w-full">
        {
          avatars &&
          avatars.map((avatar) => {
            return (
              <div
                key={avatar.id}
                className="size-10 rounded-full cursor-pointer"
                onClick={() => setPicture(avatar.imgUrl)}>
                <img
                  className="size-10 rounded-full"
                  src={avatar?.imgUrl}
                  alt={avatar?.imgUrl.split("/")[1]} />
              </div>
            )
          })
        }
      </div>
      <div className="w-full flex justify-center mt-6">
        <button
          className="bg-cyan-600 py-1 px-2 rounded-sm text-white text-[14px] cursor-pointer"
          onClick={saveAvatar}>Save Avatar</button>
      </div>
    </div>
  )
}

export default ProfilePic