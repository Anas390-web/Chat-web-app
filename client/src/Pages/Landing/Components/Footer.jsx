
function Footer() {
  return (
    <footer className="bg-cyan-800 p-7 sm:h-10 flex justify-center items-center">
      <div className="flex flex-col justify-center items-center">
         <p className="text-[14px] text-white font-bold">© {new Date().getFullYear()} Sermo. All rights reserved.</p>
         <p className="text-[14px] text-white">Sermo is a portfolio project created for demonstration purposes.</p>
      </div>
    </footer>
  )
}

export default Footer