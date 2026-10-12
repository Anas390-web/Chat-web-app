
function Footer() {
  return (
    <footer className="bg-cyan-600 h-12 sm:h-10 flex justify-center items-center">
      <div>
         <p className="text-[14px] text-white">© {new Date().getFullYear()} Sermo. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer