// import { Link } from '@tanstack/react-router'

// export default function Header() {
//   return (
//     <header className="p-2 flex gap-2 bg-white text-black justify-between">
//       <nav className="flex flex-row">
//         <div className="px-2 font-bold">
//           <Link to="/">Home</Link>
//         </div>
//       </nav>
//     </header>
//   )
// }

import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="p-4 bg-black/70 backdrop-blur-md text-white flex items-center justify-between border-b border-white/10 shadow-lg">
      {/* 🌐 Left side - App name / logo */}
      <h1 className="text-xl font-bold tracking-wide">
        <Link to="/" className="hover:text-cyan-400 transition-colors duration-300">
          Spectergram
        </Link>
      </h1>

      {/* 🧭 Right side - Navigation */}
      <nav className="flex gap-6 text-sm">
        <Link
          to="/"
          className="hover:text-cyan-400 transition-colors duration-300"
        >
          Home
        </Link>

        <Link
          to="/auth"
          className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-white font-semibold transition-all duration-300 shadow-md hover:shadow-cyan-400/30"
        >
          Sign In / Sign Up
        </Link>
      </nav>
    </header>
  );
}

