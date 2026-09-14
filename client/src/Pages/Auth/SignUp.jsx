import { NavLink } from "react-router";

function SignUp() {
  return (
    <div className="h-auto w-full sm:w-120 p-8 flex-col-start justify-between gap-2 shadow-2xl  bg-slate-50">
      <h1 className="text-amber-600">SignUp</h1>
      <form className="flex flex-col gap-4 w-full text-amber-900">
        <label className="flex flex-col gap-1.5 font-medium">
          Username:
          <input
            className="bg-[#F1F1F1] border-b w-full p-1.5 rounded-sm outline-black font-light"
            type="text"
            placeholder="Enter testing username" />
        </label>
        <label className="flex flex-col gap-1.5 font-medium">
          Email:
          <input
            className="bg-[#F1F1F1] border-b w-full p-1.5 rounded-sm outline-black font-light"
            type="text"
            placeholder="Enter testing email" />
        </label>
        <label className="flex flex-col gap-1.5 font-medium">
          Password:
          <input
            className="bg-[#F1F1F1] border-b w-full p-1.5 rounded-sm outline-black font-light"
            type="password"
            placeholder="Enter testing password" />
        </label>
        <label className="flex flex-col gap-1.5 font-medium">
            Confirm Password:
          <input
            className="bg-[#F1F1F1] border-b w-full p-1.5 rounded-sm outline-black font-light"
            type="password"
            placeholder="Enter testing password again" />
        </label>
        <button className="bg-amber-900 text-white p-1.5 rounded-sm cursor-pointer mt-2">SUBMIT</button>
      </form>
      <div className="flex gap-0.5">
        <p>Already registered?</p>
        <NavLink
        to={'/login'}
        >
          Sign-in
        </NavLink>
      </div>
    </div>
  )
}

export default SignUp;