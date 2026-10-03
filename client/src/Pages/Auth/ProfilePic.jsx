import { useState } from "react"

function ProfilePic() {

  const [url, setUrl] = useState('');

  function setPicture(imgUrl) {
    setUrl(imgUrl);
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
    },
    {
      id: 7,
      imgUrl: 'images/Blank-User-Image.png'
    }
  ]


  return (
    <div className="flex flex-col justify-center items-center gap-4 border border-gray-200 size-full sm:size-100 p-4 shadow">
      <div className="border size-40 rounded-full p-1">
        <img className="rounded-full" src={url} alt={url.split("/")[2]} />
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
                  src={avatar.imgUrl}
                  alt="" />
              </div>
            )
          })
        }
      </div>
      <div className="h-20 flex flex-col justify-center">
        <button className="bg-orange-400 py-1 px-2 rounded-sm text-white text-[14px] ">Save Avatar</button>
      </div>
    </div>
  )
}

export default ProfilePic