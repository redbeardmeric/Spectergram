import { useMsal } from "@azure/msal-react";
import { useNavigate } from "@tanstack/react-router";
import type React from "react";
import { useState } from "react";
import { loginRequest } from "../auth/msalConfig";
import { register } from "../lib/api";

export default function SignupUI() {
	const [form, setForm] = useState({ name: "", email: "", password: "" });
	const [strength, setStrength] = useState({
		label: "",
		color: "",
		gradient: "",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const navigate = useNavigate();
	const { instance } = useMsal();
	const hasMsalClient = Boolean(import.meta.env.VITE_MSAL_CLIENT_ID);

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
				label: "Weak — Try mixing uppercase, lowercase & numbers",
				color: "#ff3b30",
				gradient: "linear-gradient(90deg, #ff3b30, #ff6b6b)",
			};
		if (passed === 3 || passed === 4)
			return {
				label: "Good — Add one special character for stronger protection",
				color: "#ffcc00",
				gradient: "linear-gradient(90deg, #ffd93b, #ffcc00)",
			};
		return {
			label: "Strong — Excellent choice! ✅",
			color: "#34c759",
			gradient: "linear-gradient(90deg, #34c759, #00ff99)",
		};
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
		if (name === "password") setStrength(evaluatePassword(value));
	};

	const handleSignup = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		setSuccess(false);

		try {
			// Register uses username, gmail, password
			await register(form.name, form.email, form.password);
			setSuccess(true);
			// Redirect to login after 2 seconds
			setTimeout(() => {
				navigate({ to: "/login" });
			}, 2000);
		} catch (err: any) {
			setError(err.message || "Registration failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center text-white fade-in">
			<div className="glass p-8 rounded-2xl shadow-lg w-full max-w-sm">
				<h1 className="text-3xl font-bold mb-6 text-center glow">
					Create Account
				</h1>

				{error && (
					<div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-lg mb-4">
						{error}
					</div>
				)}

				{success && (
					<div className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-2 rounded-lg mb-4">
						Account created! Redirecting to login...
					</div>
				)}

				<form onSubmit={handleSignup} className="flex flex-col gap-5">
					<input
						type="text"
						name="name"
						placeholder="Full Name"
						value={form.name}
						onChange={handleChange}
						required
					/>
					<input
						type="email"
						name="email"
						placeholder="Email"
						value={form.email}
						onChange={handleChange}
						required
					/>

					<div className="relative space-y-2">
						<input
							type="password"
							name="password"
							placeholder="Password"
							value={form.password}
							onChange={handleChange}
							required
							style={{
								borderColor: strength.color || "#2a2a2a",
								boxShadow: strength.color && `0 0 12px ${strength.color}88`,
								transition: "all 0.3s ease",
							}}
						/>

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

					<button type="submit" className="mt-3" disabled={loading || success}>
						{loading ? "Creating account..." : "Sign Up"}
					</button>

					{hasMsalClient && (
						/* Entra / Microsoft sign-in (MSAL) */
						<div className="mt-4 text-center">
							<button
								type="button"
								className="mt-2 px-4 py-2 bg-[#61dafb] text-black rounded-lg"
								onClick={async () => {
									try {
										await instance.loginPopup(loginRequest);
									} catch (err) {
										console.error("MSAL signup/login failed", err);
									}
								}}
							>
								Sign in with Microsoft
							</button>
						</div>
					)}
				</form>

				<p className="text-center text-sm text-gray-400 mt-5">
					Already have an account?{" "}
					<a href="/login" className="text-[#61dafb] hover:underline">
						Log in
					</a>
				</p>
			</div>
		</div>
	);
}
