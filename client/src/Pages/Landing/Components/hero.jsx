import PeopleChatting from '../../../public/images/PeopleChatting.jpg';
import { useNavigate } from 'react-router';

function Hero() {
  const navigate = useNavigate();
  function navigateToLoginPage() {
    navigate('/login')
  }
  return (
    <main className="h-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center px-8 md:px-16 py-12">
      <div className="flex flex-col justify-center gap-6 max-w-lg justify-self-end">
        <h1 className="text-amber-950 text-[min(10vw,36px)] md:text-5xl font-extrabold tracking-wide uppercase leading-tight">
          Feeling bored? <br />
          <span className="text-amber-600">Let's chat!</span>
        </h1>

        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>

        <div>
          <button className="bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm px-6 py-3 rounded-full flex items-center gap-2 transition-colors shadow-md cursor-pointer" onClick={navigateToLoginPage}>
            GET STARTED <span>&rarr;</span>
          </button>
        </div>
      </div>

      <div className="flex justify-center items-center mt-8 md:mt-0">
        <img
          src={PeopleChatting}
          alt="Mobile Chat Application Illustration"
          className="w-full max-w-md md:max-w-lg object-contain"
        />
      </div>
    </main>
  );
}


export default Hero
