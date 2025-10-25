import type React from "react";
import { useState } from "react";

export default function LoginUI() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [strength, setStrength] = useState({
		label: "",
		color: "",
		gradient: "",
	});
	const [showPassword, setShowPassword] = useState(false);

	const evaluatePassword = (pwd: string) => {
		const conditions = [
			/[A-Z]/.test(pwd),
			/[a-z]/.test(pwd),
			/[0-9]/.test(pwd),
			/[^A-Za-z0-9]/.test(pwd),
			pwd.length >= 8,
		];
		const passed = conditions.filter(Boolean).length;

		if (pwd.length === 0) return { label: "", color: "", gradient: "none" };
		if (passed <= 2)
			return {
				label: "Weak — try mixing uppercase, lowercase & numbers",
				color: "#ff3b30",
				gradient: "linear-gradient(90deg, #ff3b30, #ff6b6b)",
			};
		if (passed === 3 || passed === 4)
			return {
				label: "Good — add one special character for extra security",
				color: "#ffcc00",
				gradient: "linear-gradient(90deg, #ffd93b, #ffcc00)",
			};
		return {
			label: "Strong — Excellent password ✅",
			color: "#34c759",
			gradient: "linear-gradient(90deg, #34c759, #00ff99)",
		};
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		if (name === "email") setEmail(value);
		if (name === "password") {
			setPassword(value);
			setStrength(evaluatePassword(value));
		}
	};

	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Logging in with:", { email, password });
	};

	return (
		<div className="min-h-screen flex items-center justify-center text-white fade-in">
			<div className="glass p-8 rounded-2xl shadow-lg w-full max-w-sm">
				<h1 className="text-3xl font-bold mb-6 text-center glow">
					Spectergram
				</h1>

				<form onSubmit={handleLogin} className="flex flex-col gap-5">
					<input
						type="email"
						name="email"
						placeholder="Email"
						value={email}
						onChange={handleChange}
						required
					/>

					<div className="relative space-y-2">
						<div className="relative">
							<input
								type={showPassword ? "text" : "password"}
								name="password"
								placeholder="Password"
								value={password}
								onChange={handleChange}
								required
								style={{
									borderColor: strength.color || "#2a2a2a",
									boxShadow: strength.color && `0 0 12px ${strength.color}88`,
									transition: "all 0.3s ease",
								}}
							/>
							{/* 👁 Eye toggle */}
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400 hover:text-white"
							>
								{showPassword ? "🙈" : "👁"}
							</button>
						</div>

						{strength.label && (
							<>
								<div
									className="h-2 rounded-full transition-all duration-500 strength-bar"
									style={{
										background: strength.gradient,
										width: strength.label.includes("Weak")
											? "33%"
											: strength.label.includes("Good")
												? "66%"
												: "100%",
										boxShadow: `0 0 8px ${strength.color}`,
									}}
								/>
								<p
									className="text-sm mt-1 italic"
									style={{
										color: strength.color,
										textShadow: `0 0 10px ${strength.color}66`,
										transition: "color 0.3s ease",
									}}
								>
									{strength.label}
								</p>
							</>
						)}
					</div>

					<button type="submit" className="mt-3">
						Log In
					</button>
				</form>

				<p className="text-center text-sm text-gray-400 mt-5">
					Don’t have an account?{" "}
					<a href="/signup" className="text-[#61dafb] hover:underline">
						Sign up
					</a>
				</p>
			</div>
		</div>
	);
}
