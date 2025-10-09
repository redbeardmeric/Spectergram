import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

const quotes = [
  "Chat reimagined. Secure. Futuristic. Yours.",
  "The future of chat, powered by you.",
  "Privacy is freedom, encrypted by design.",
  "Your gateway to the next generation of communication.",
  "Where conversations meet cutting-edge AI.",
];

export function RotatingQuotes() {
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-16 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuote}
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center gap-2"
        >
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          <p className="text-sm md:text-base text-center text-muted-foreground font-medium max-w-md">
            {quotes[currentQuote]}
          </p>
          <Sparkles className="h-4 w-4 text-accent animate-pulse" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
