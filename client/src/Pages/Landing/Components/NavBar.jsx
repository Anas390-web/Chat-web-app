import { useNavigate } from "react-router"

function NavBar() {
   const navigate = useNavigate();
   function navigateToLoginPage() {
      navigate('/login');
   }
   function navigateToSignUpPage() {
      navigate('/signup');
   }
   return (
      <header className="h-20 flex items-center justify-between px-8 sm:px-16">
         <h1 className='text-amber-600 text-[min(10vw,30px)] font-extrabold tracking-normal uppercase'>Chatty</h1>
         <div className="flex gap-3">
            <button className="bg-white px-4 py-1 border text-amber-700 border-amber-700 rounded-2xl hover:text-white hover:bg-amber-700 transition ease-in duration-200 cursor-pointer" onClick={navigateToLoginPage}>
               LOGIN
            </button>
            <button className="bg-amber-700 text-white px-4 py-1 rounded-sm cursor-pointer" onClick={navigateToSignUpPage}>
               SIGN UP
            </button>
         </div>
      </header>
   )
}

export default NavBar