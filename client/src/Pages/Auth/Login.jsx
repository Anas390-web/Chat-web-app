import { NavLink } from "react-router-dom"
import { useDispatch } from 'react-redux'
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../Features/authSlice.js"
import { useState, useEffect } from "react";


function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ACCESS ERROR STATE FROM AUTH STORE:
  const { error } = useSelector((store) => store.auth);

  // IF TOKEN IS PRESENT, NAVIGATE TO DASHBOARD:
  const store = useSelector((store) => store.auth)
  const { token } = store;
  useEffect(() => {
    if (token) {
      navigate('/dashboard')
    }
  }, [token, navigate])

  // USER FORM HANDLING:
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // EVENT HANDLERS:
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => {
      return ({
        ...prev, [name]: value
      })
    })
  }

  // DISPATCH THE LOGIN USER ASYNC THUNK API REQUEST:
  function handleSubmit(e) {
    e.preventDefault();
    dispatch(loginUser(formData));
  }

  return (
    <div className="h-auto w-full sm:w-120 p-8 flex-col-start justify-between gap-2 shadow-2xl  bg-slate-50">
      <h1 className="text-cyan-600">Login</h1>
      <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
        <label className="flex flex-col text-cyan-900 gap-1.5 font-medium">
          <p>Email:</p>
          <div className="bg-[#F1F1F1] border-b w-full">
            <input
              className="w-full p-1.5 rounded-sm outline-none font-light"
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter testing email" />
          </div>
          {/* SHOW EMAIL IS INCORRECT IF THERE IS AN ERROR: */}
          {
            error.status === 400 &&
            <div>
              <p className="text-red-700 text-[12px]">Email is incorrect</p>
            </div>
          }
        </label>
        <label className="flex flex-col text-cyan-900 gap-1.5 font-medium">
          <p>Password:</p>
          <div className="bg-[#F1F1F1] border-b w-full">
            <input
              className="w-full p-1.5 rounded-sm outline-none font-light"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter testing password" />
          </div>
          {/* SHOW PASSWORD IS INCORRECT IF THERE IS AN ERROR: */}
          {
            error.status === 401 &&
            <div>
              <p className="text-red-700 text-[12px]">Password is incorrect</p>
            </div>
          }
        </label>
        <button className="text-white bg-cyan-900 p-1.5 rounded-sm cursor-pointer mt-2">LOGIN</button>
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