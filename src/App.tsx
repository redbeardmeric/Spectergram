import { Link } from "@tanstack/react-router";

export default function App() {
	// Generate unique IDs for floating dots
	const floatingDots = Array.from({ length: 8 }, () => crypto.randomUUID());

	return (
		<div className="relative min-h-screen flex flex-col items-center justify-center text-white overflow-hidden">
			{/* Animated gradient background */}
			<div className="absolute inset-0 bg-gradient-to-br from-[#0d0d0d] via-[#111827] to-[#0a0a0a] animate-gradientMove" />

			{/* Floating particles */}
			<div className="absolute inset-0 overflow-hidden">
				{floatingDots.map((id) => (
					<span key={id} className="floating-dot" />
				))}
			</div>

			{/* Main Content */}
			<div className="relative text-center z-10 fade-in">
				<h1 className="text-6xl font-bold mb-6 text-[#61dafb] animate-glow">
					Spectergram
				</h1>
				<p className="text-gray-400 mb-10 text-lg tracking-wide">
					Connect securely. Chat privately. Experience simplicity.
				</p>

				<div className="flex gap-6 justify-center">
					<Link
						to="/login"
						className="relative bg-[#61dafb] text-black px-8 py-3 rounded-lg font-medium transition-all overflow-hidden hover:scale-105 hover:shadow-[0_0_25px_#61dafb]"
					>
						<span className="relative z-10">Log In</span>
						<span className="btn-sweep" />
					</Link>
					<Link
						to="/signup"
						className="relative border border-[#61dafb] px-8 py-3 rounded-lg text-[#61dafb] font-medium overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_25px_#61dafb]"
					>
						<span className="relative z-10">Sign Up</span>
						<span className="btn-sweep" />
					</Link>
				</div>
			</div>
		</div>
	);
}
