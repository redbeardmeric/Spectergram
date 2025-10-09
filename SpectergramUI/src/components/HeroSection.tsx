import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, Eye, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const encryptedText = "█████████████";
const decryptedText = "SPECTERGRAM";

export function HeroSection() {
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [displayText, setDisplayText] = useState(encryptedText);
  const navigate = useNavigate();

  useEffect(() => {
    // Start decryption animation after 1 second
    const decryptTimer = setTimeout(() => {
      setIsDecrypted(true);
      
      // Animate character by character decryption
      let currentIndex = 0;
      const decryptInterval = setInterval(() => {
        if (currentIndex <= decryptedText.length) {
          setDisplayText(
            decryptedText.slice(0, currentIndex) + 
            encryptedText.slice(currentIndex)
          );
          currentIndex++;
        } else {
          clearInterval(decryptInterval);
        }
      }, 80);
    }, 1000);

    return () => clearTimeout(decryptTimer);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, hsl(var(--primary)) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, hsl(var(--accent)) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 80%, hsl(var(--primary)) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, hsl(var(--primary)) 0%, transparent 50%)",
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Orbiting Ring */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/10"
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Logo/Brand */}
          <motion.div
            className="mb-8 flex items-center justify-center gap-3"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 20px hsl(var(--primary) / 0.4)",
                  "0 0 40px hsl(var(--primary) / 0.6)",
                  "0 0 20px hsl(var(--primary) / 0.4)",
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="rounded-full bg-primary/10 p-4"
            >
              <Shield className="h-12 w-12 text-primary" />
            </motion.div>
          </motion.div>

          {/* Encrypted Reveal Title */}
          <motion.h1
            className="mb-6 text-6xl font-bold uppercase tracking-wider md:text-8xl"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.span
              animate={{
                textShadow: [
                  "0 0 20px hsl(var(--primary) / 0.5)",
                  "0 0 40px hsl(var(--accent) / 0.6)",
                  "0 0 20px hsl(var(--primary) / 0.5)",
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {displayText}
            </motion.span>
          </motion.h1>

          {/* Tagline */}
          <AnimatePresence>
            {isDecrypted && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 text-xl text-muted-foreground md:text-2xl"
              >
                Conversations Beyond Surveillance
              </motion.p>
            )}
          </AnimatePresence>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mb-12 flex flex-wrap items-center justify-center gap-4"
          >
            {[
              { icon: Lock, text: "End-to-End Encrypted" },
              { icon: Eye, text: "Zero Knowledge" },
              { icon: Zap, text: "Real-Time Secure" },
            ].map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 + index * 0.1 }}
                className="flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-2 backdrop-blur-sm"
              >
                <feature.icon className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <AnimatePresence>
            {isDecrypted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 }}
                className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
              >
                <Button
                  size="lg"
                  onClick={() => navigate("/signup")}
                  className="group relative overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{ opacity: 0.3 }}
                  />
                  <span className="relative">Get Started</span>
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/login")}
                  className="border-border bg-background/50 backdrop-blur-sm hover:bg-accent/10"
                >
                  Sign In
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Holographic Shimmer Effect */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          animate={{
            background: [
              "linear-gradient(90deg, transparent 0%, hsl(var(--primary) / 0.05) 50%, transparent 100%)",
              "linear-gradient(90deg, transparent 0%, hsl(var(--accent) / 0.05) 50%, transparent 100%)",
            ],
            backgroundPosition: ["-200% 0", "200% 0"],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            backgroundSize: "200% 100%",
          }}
        />
      </div>
    </div>
  );
}
