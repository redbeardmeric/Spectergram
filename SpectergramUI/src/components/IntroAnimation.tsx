import { motion, AnimatePresence } from "framer-motion";
import { Shield, Sparkles, Lock } from "lucide-react";
import { useEffect, useState } from "react";

interface IntroAnimationProps {
  onComplete: () => void;
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 500);
    const timer2 = setTimeout(() => setStep(2), 1800);
    const timer3 = setTimeout(() => setStep(3), 3200);
    const timer4 = setTimeout(() => onComplete(), 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--primary) / 0.1) 50%, hsl(var(--background)) 100%)"
        }}
      >
        {/* Animated particles background */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/30 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: [0, 0.8, 0],
                scale: [0, 1.5, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10 text-center space-y-8">
          {/* Logo formation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={step >= 1 ? { scale: 1, rotate: 0 } : {}}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative mx-auto"
          >
            <div className="relative w-32 h-32 mx-auto">
              {/* Outer ring */}
              <motion.div
                className="absolute inset-0 border-4 border-primary/30 rounded-full"
                animate={{
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity }
                }}
              />
              
              {/* Middle ring */}
              <motion.div
                className="absolute inset-2 border-2 border-accent/40 rounded-full"
                animate={{
                  rotate: -360,
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  rotate: { duration: 6, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2.5, repeat: Infinity, delay: 0.5 }
                }}
              />

              {/* Center icon */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              >
                <Shield className="w-16 h-16 text-primary" />
                <motion.div
                  className="absolute"
                  animate={{
                    scale: [0.8, 1.2, 0.8],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity
                  }}
                >
                  <Sparkles className="w-8 h-8 text-accent" />
                </motion.div>
              </motion.div>

              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 bg-primary/20 rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity
                }}
              />
            </div>
          </motion.div>

          {/* Brand name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={step >= 1 ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Spectergram
            </h1>
          </motion.div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={step >= 2 ? { opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-3"
          >
            <motion.div
              className="flex items-center justify-center gap-2 text-muted-foreground"
              animate={{
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            >
              <Lock className="w-4 h-4" />
              <span className="text-sm font-medium">End-to-End Encrypted</span>
            </motion.div>
            
            <p className="text-xl text-foreground/80 font-light max-w-md mx-auto">
              Privacy. Precision. Peace of Mind.
            </p>
          </motion.div>

          {/* Light trail effect */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={step >= 3 ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="h-px w-64 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent"
          />
        </div>

        {/* Corner accents */}
        {[
          { top: "10%", left: "10%", delay: 0 },
          { top: "10%", right: "10%", delay: 0.2 },
          { bottom: "10%", left: "10%", delay: 0.4 },
          { bottom: "10%", right: "10%", delay: 0.6 }
        ].map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-16 h-16"
            style={pos}
            initial={{ opacity: 0, scale: 0 }}
            animate={step >= 2 ? { opacity: 0.3, scale: 1 } : {}}
            transition={{ delay: pos.delay }}
          >
            <div className="w-full h-full border-l-2 border-t-2 border-primary/30" />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
