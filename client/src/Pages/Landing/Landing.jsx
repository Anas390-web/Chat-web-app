import Footer from './Components/Footer';
import Hero from './Components/hero';
import NavBar from './Components/NavBar';


function Landing() {
   return (
      <div className="h-screen w-full flex flex-col">
         <NavBar />
         <Hero />
         <Footer />
      </div>
   )
}

export default Landing