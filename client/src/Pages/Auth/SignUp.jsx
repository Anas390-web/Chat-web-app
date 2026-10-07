import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from "react-router";
import { EyeIcon, EyeSlashIcon } from '../../Icons/Icons'
import { registerUser } from "../../Features/authSlice";

function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ACCESSING THE TOKEN FROM THE STORE:
  const { token, error } = useSelector((store) => store.auth);

  // USER FORM DATA:
  const [formdata, setFormdata] = useState({
    username: '',
    email: '',
    password: ''
  })

  function handleChange(e) {
    const { name, value } = e.target;
    setFormdata(prev => {
      return {
        ...prev, [name]: value
      }
    })
  }

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(registerUser(formdata))
    setFormdata({
      username: '',
      email: '',
      password: ''
    });
    setConfirmPassword('');
  }

  // TAKE TO THE PROFILE PIC PAGE WHEN THE USER IS REGISTERED:
  useEffect(() => {
    if (token) {
      navigate('/profilePic')
    }
  }, [navigate, token])

  // TOGGLE PASSWORD VISIBLE OR INVISIBLE:
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  function togglePasswordVisible() {
    setPasswordVisible(!passwordVisible);
  }
  function toggleConfirmPasswordVisible() {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  }

  // HANDLE CONFIRM PASSWORD DISAPPEAR AFTER SUBMISSION OF FORM:
  const [confirmPassword, setConfirmPassword] = useState("");
  function handleChangeConfirmPassword(e) {
    setConfirmPassword(e.target.value)
  }
  return (
    <div className="h-auto w-full sm:w-120 p-8 flex-col-start justify-between gap-2 shadow-2xl  bg-slate-50">
      <h1 className="text-cyan-600">SignUp</h1>
      <form
        onSubmit={handleSubmit} // SEND DATA TO AUTHSLICE
        className="flex flex-col gap-4 w-full text-cyan-900">

        <label className="flex flex-col gap-1.5 font-medium">
          <span>Username:</span>
          <div className="bg-[#F1F1F1] border-b w-full">
            <input
              className="w-full p-1.5 rounded-sm outline-none font-light"
              name="username"
              type="text"
              value={formdata.username}
              onChange={handleChange}
              placeholder="Enter testing username" />
          </div>
          <div>
            {
              error.status === 400 && <p className="text-[12px] text-red-700">Please enter the valid username</p>
            }
            {
              error.status === 409 && error.message === "USERNAME ALREADY EXISTS" && <p className="text-[12px] text-red-700">Username is already taken</p>
            }
          </div>
        </label>

        <label className="flex flex-col gap-1.5 font-medium">
          <span>Email:</span>
          <div className="bg-[#F1F1F1] border-b w-full">
            <input
              className="w-full p-1.5 rounded-sm outline-none font-light"
              name="email"
              type="text"
              value={formdata.email}
              onChange={handleChange}
              placeholder="Enter testing email" />
          </div>
          <div>
            {
              error.status === 400 && <p className="text-[12px] text-red-700">Please enter the valid email</p>
            }
            {
              error.status === 409 && error.message === "EMAIL ALREADY EXISTS" && <p className="text-[12px] text-red-700">Email is already taken</p>
            }
          </div>
        </label>

        <label className="flex flex-col gap-1.5 font-medium">
          <span>Password:</span>
          <div className="flex bg-[#F1F1F1] border-b w-full">
            <input
              className="w-full p-1.5 rounded-sm outline-none font-light"
              name="password"
              type={passwordVisible ? "text" : "password"}
              value={formdata.password}
              onChange={handleChange}
              placeholder="Enter testing password" />
            <div className="flex items-center mr-1 cursor-pointer p-1" onClick={togglePasswordVisible}>
              {passwordVisible ? <EyeSlashIcon /> : <EyeIcon />}
            </div>
          </div>
        </label>

        <label className="flex flex-col gap-1.5 font-medium">
          <span>Confirm Password:</span>
          <div className="flex bg-[#F1F1F1] border-b w-full">
            <input
              className="w-full p-1.5 rounded-sm outline-none font-light"
              value={confirmPassword}
              onChange={handleChangeConfirmPassword}
              type={confirmPasswordVisible ? "text" : "password"}
              placeholder="Enter testing password again" />
            <div className="flex items-center mr-1 cursor-pointer p-1" onClick={toggleConfirmPasswordVisible}>
              {confirmPasswordVisible ? <EyeSlashIcon /> : <EyeIcon />}
            </div>
          </div>
        </label>

        <button className="bg-cyan-900 text-white p-1.5 rounded-sm cursor-pointer mt-2">SUBMIT</button>
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