import React, { useState } from "react";

export default function SignupUI() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Replace with backend signup API
    console.log("Signing up with:", form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] text-white">
      <div className="bg-[#1a1a1a] p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h1 className="text-3xl font-semibold mb-6 text-center tracking-wide">
          Create Account
        </h1>
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="p-3 rounded-lg bg-[#2a2a2a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#61dafb] transition"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="p-3 rounded-lg bg-[#2a2a2a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#61dafb] transition"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="p-3 rounded-lg bg-[#2a2a2a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#61dafb] transition"
            required
          />
          <button
            type="submit"
            className="mt-2 bg-[#61dafb] text-black font-medium py-2 rounded-lg hover:bg-[#52c0e5] transition-all"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-[#61dafb] hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
