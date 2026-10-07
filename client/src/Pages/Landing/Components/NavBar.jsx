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
         <div className="flex items-center gap-1">
            <div className="h-10 w-10">
               <img className="rounded-full size-10" src="images/Sermo-logo-picture.jpg" alt="Sermo logo picture" />
            </div>
            <h1 className='text-cyan-700 text-[min(10vw,30px)] font-extrabold tracking-normal uppercase'>SERMO</h1>
         </div>
         <div className="flex gap-3">
            <button className="bg-white px-4 py-1 border text-cyan-700 border-cyan-700 rounded-2xl hover:text-white hover:bg-cyan-700 transition ease-in duration-200 cursor-pointer" onClick={navigateToLoginPage}>
               LOGIN
            </button>
            <button className="bg-cyan-700 text-white px-4 py-1 rounded-sm cursor-pointer" onClick={navigateToSignUpPage}>
               SIGN UP
            </button>
         </div>
      </header>
   )
}

export default NavBar