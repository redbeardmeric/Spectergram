import { useState } from "react";
import { motion } from "framer-motion";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div
      className={`min-h-screen flex items-center justify-center 
        bg-gradient-to-br ${
          isSignUp
            ? "from-cyan-500 via-blue-600 to-purple-800"
            : "from-gray-900 via-slate-800 to-black"
        } text-white transition-all duration-700`}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20"
      >
        <h1 className="text-3xl font-bold text-center mb-6 tracking-wide">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h1>

        <form className="flex flex-col gap-4">
          {isSignUp && (
            <input
              type="text"
              placeholder="Full Name"
              className="p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <input
            type="password"
            placeholder="Password"
            className="p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="mt-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded-lg shadow-lg"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </motion.button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-300">
          {isSignUp ? "Already have an account?" : "Don’t have an account?"}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-cyan-400 hover:underline ml-1"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
