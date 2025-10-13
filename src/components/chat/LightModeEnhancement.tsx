import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function LightModeEnhancement() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    
    return () => observer.disconnect();
  }, []);

  if (isDark) return null;

  return (
    <>
      {/* Light mode animated gradient background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(circle at 20% 30%, hsl(263 70% 95% / 0.4) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 70%, hsl(194 98% 95% / 0.4) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 50%, hsl(280 70% 95% / 0.4) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 30%, hsl(263 70% 95% / 0.4) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, -60, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <motion.div
        className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-gradient-to-br from-purple-300/30 to-pink-300/30 blur-2xl"
        animate={{
          x: [0, 60, 0],
          y: [0, -40, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </>
  );
}
