import { NavLink } from "react-router"

function Login() {
  return (
    <div className="h-auto w-full sm:w-120 p-8 flex-col-start justify-between gap-2 shadow-2xl  bg-slate-50">
      <h1 className="text-blue-500">Login</h1>
      <form className="flex flex-col gap-4 w-full">
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
        <button className="bg-blue-500 text-white p-1.5 rounded-sm cursor-pointer mt-2">LOGIN</button>
      </form>
      <div className="flex gap-0.5">
        <p>No account?</p>
        <NavLink
        to={'/signup'}
        >
          Create an account
        </NavLink>
      </div>
    </div>
  )
}

export default Login