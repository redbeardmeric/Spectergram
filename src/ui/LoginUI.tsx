import React, { useState } from "react";

export default function LoginUI() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Replace with backend call
    console.log("Logging in with:", { email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] text-white">
      <div className="bg-[#1a1a1a] p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h1 className="text-3xl font-semibold mb-6 text-center tracking-wide">
          Spectergram
        </h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="p-3 rounded-lg bg-[#2a2a2a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#61dafb] transition"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="p-3 rounded-lg bg-[#2a2a2a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#61dafb] transition"
            required
          />
          <button
            type="submit"
            className="mt-2 bg-[#61dafb] text-black font-medium py-2 rounded-lg hover:bg-[#52c0e5] transition-all"
          >
            Log In
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          Don’t have an account?{" "}
          <a href="/signup" className="text-[#61dafb] hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
