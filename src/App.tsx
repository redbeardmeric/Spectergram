// src/App.tsx
import React from "react";
import { Link } from "@tanstack/react-router";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d0d0d] text-white text-center">
      <h1 className="text-5xl font-bold mb-6">Spectergram</h1>
      <p className="text-gray-400 mb-10">
        Connect securely. Chat privately. Experience simplicity.
      </p>

      <div className="flex gap-6">
        <Link
          to="/login"
          className="bg-[#61dafb] text-black px-6 py-2 rounded-lg hover:bg-[#52c0e5] transition"
        >
          Log In
        </Link>
        <Link
          to="/signup"
          className="border border-[#61dafb] px-6 py-2 rounded-lg text-[#61dafb] hover:bg-[#1a1a1a] transition"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
