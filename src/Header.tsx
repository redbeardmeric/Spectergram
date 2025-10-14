import { Link } from "@tanstack/react-router"

export default function Header() {
  return (
    <header className="h-16 flex justify-between items-center px-6 bg-[#101522] border-b border-cyan-500/20 shadow-md">
      <h1 className="text-2xl font-bold text-cyan-400">Spectergram</h1>
      <nav className="flex gap-6 text-gray-300">
        <Link to="/" className="hover:text-cyan-300 transition-colors">
          Home
        </Link>
        <Link to="/chat" className="hover:text-cyan-300 transition-colors">
          Chat
        </Link>
        <Link to="/profile" className="hover:text-cyan-300 transition-colors">
          Profile
        </Link>
      </nav>
    </header>
  )
}
