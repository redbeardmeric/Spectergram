import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Lock, Eye, EyeOff, User, Chrome, KeyRound, Moon, Sun, Sparkles, Fingerprint, Zap } from "lucide-react";
import { ThreeBackground } from "@/components/auth/ThreeBackground";
import { FloatingInput } from "@/components/auth/FloatingInput";

import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { RippleButton } from "@/components/auth/RippleButton";
import { ParallaxContainer } from "@/components/auth/ParallaxContainer";
import { AnimatedBackground } from "@/components/auth/AnimatedBackground";
import { RotatingQuotes } from "@/components/auth/RotatingQuotes";
import { HologramOrb } from "@/components/auth/HologramOrb";
import { AIIndicator } from "@/components/auth/AIIndicator";

// Inline Lottie animation data for hologram effect
const hologramAnimation = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 90,
  w: 500,
  h: 500,
  nm: "Hologram",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Circle",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [100] }, { t: 90, s: [0] }] },
        r: { a: 1, k: [{ t: 0, s: [0] }, { t: 90, s: [360] }] },
        p: { a: 0, k: [250, 250, 0] },
        s: { a: 1, k: [{ t: 0, s: [50, 50, 100] }, { t: 90, s: [150, 150, 100] }] },
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "el",
              p: { a: 0, k: [0, 0] },
              s: { a: 0, k: [200, 200] },
            },
            {
              ty: "st",
              c: { a: 0, k: [0.66, 0.33, 0.97, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 3 },
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
            },
          ],
        },
      ],
    },
  ],
};

const Auth = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  
  const [greeting, setGreeting] = useState("");
  
  const [signinData, setSigninData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Swipe gesture for tab switching
  const x = useMotionValue(0);
  const xInput = [-100, 0, 100];
  const opacity = useTransform(x, xInput, [0.5, 1, 0.5]);

  // Set time-based greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning 🌅");
    else if (hour < 18) setGreeting("Good Afternoon ☀️");
    else setGreeting("Good Evening 🌙");
  }, []);


  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ["#a855f7", "#67e8f9", "#ec4899"];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const handleSignin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign in:", signinData);
    navigate("/chat");
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    console.log("Sign up:", signupData);
    triggerConfetti();
    setTimeout(() => navigate("/chat"), 1500);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.x > 100) {
      setActiveTab("signin");
    } else if (info.offset.x < -100) {
      setActiveTab("signup");
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
      {/* Layered animated backgrounds */}
      <ThreeBackground />
      <AnimatedBackground />
      
      {/* Dynamic gradient background for dark mode */}
      <motion.div 
        className="absolute inset-0 z-0"
        animate={{
          background: isDarkMode 
            ? [
                "linear-gradient(135deg, hsl(220, 30%, 8%) 0%, hsl(260, 40%, 12%) 50%, hsl(200, 50%, 15%) 100%)",
                "linear-gradient(135deg, hsl(260, 40%, 10%) 0%, hsl(220, 30%, 8%) 50%, hsl(280, 35%, 12%) 100%)",
                "linear-gradient(135deg, hsl(200, 50%, 12%) 0%, hsl(280, 35%, 10%) 50%, hsl(220, 30%, 8%) 100%)",
                "linear-gradient(135deg, hsl(220, 30%, 8%) 0%, hsl(260, 40%, 12%) 50%, hsl(200, 50%, 15%) 100%)",
              ]
            : [
                "linear-gradient(135deg, hsl(0, 0%, 100%) 0%, hsl(210, 20%, 98%) 100%)",
              ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      {/* Enhanced gradient overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(234_89%_74%_/_0.15)_0%,transparent_60%)] z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(194_98%_71%_/_0.15)_0%,transparent_60%)] z-0" />

      {/* Theme toggle */}
      <motion.button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 glass rounded-full z-20 neon-glow"
        whileHover={{ scale: 1.1, rotate: 180 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <motion.div
          initial={false}
          animate={{ rotate: isDarkMode ? 0 : 180, scale: isDarkMode ? 1 : 1.2 }}
          transition={{ duration: 0.3 }}
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </motion.div>
      </motion.button>

      {/* Split-screen layout */}
      <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center p-4 lg:p-8 gap-8 relative z-10">
        
        {/* Left side - Simplified welcome section (hidden on mobile) */}
        <motion.div 
          className="hidden lg:flex flex-col items-center justify-center flex-1 space-y-8"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="text-center space-y-6 max-w-lg px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {/* Dynamic greeting */}
            <motion.div className="space-y-3">
              <motion.h2 
                className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ["0%", "100%", "0%"],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: "200%" }}
              >
                Welcome to the Future{" "}
                <motion.span
                  animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  className="inline-block origin-bottom-right"
                >
                  ✨
                </motion.span>
              </motion.h2>
              <motion.p 
                className="text-lg md:text-xl text-muted-foreground font-medium"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Your next-generation AI-powered communication platform
              </motion.p>
            </motion.div>

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <RotatingQuotes />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right side - Auth form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md lg:flex-1 lg:max-w-lg"
        >
          {/* Mobile greeting (shown only on mobile) */}
          <motion.div 
            className="lg:hidden text-center mb-8 space-y-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Welcome to the Future ✨
            </h2>
            <p className="text-sm text-muted-foreground">
              Your next-gen communication platform
            </p>
          </motion.div>

          <Card className="glass neon-border border-0 shadow-2xl shadow-primary/20 backdrop-blur-xl overflow-hidden">
            <CardContent className="p-8">
              {/* Header with theme picker */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="space-y-4 mb-8"
              >
                <motion.div className="flex items-center justify-center gap-2">
                  <motion.h1 
                    className="text-4xl font-bold text-center bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
                    animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    style={{ backgroundSize: "200%" }}
                  >
                    Welcome
                  </motion.h1>
                  <motion.div
                    animate={{ 
                      rotate: 360,
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-6 w-6 text-primary" />
                  </motion.div>
                </motion.div>
                
                {/* Subtitle */}
                <motion.p
                  className="text-center text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Your secure AI-powered chat experience
                </motion.p>
              </motion.div>

              {/* Enhanced tab system with smooth transitions */}
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-2 glass neon-border p-1 rounded-lg relative overflow-hidden">
                  <motion.div
                    className="absolute inset-y-1 w-[calc(50%-4px)] bg-gradient-to-r from-primary to-accent rounded-md shadow-[0_0_20px_rgba(168,85,247,0.6)]"
                    animate={{
                      x: activeTab === "signin" ? 2 : "calc(100% + 4px)",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                  <motion.button
                    onClick={() => setActiveTab("signin")}
                    className={`py-3 px-4 rounded-md transition-all duration-300 relative z-10 font-medium ${
                      activeTab === "signin"
                        ? "text-white"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign In
                  </motion.button>
                  <motion.button
                    onClick={() => setActiveTab("signup")}
                    className={`py-3 px-4 rounded-md transition-all duration-300 relative z-10 font-medium ${
                      activeTab === "signup"
                        ? "text-white"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign Up
                  </motion.button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {/* Sign In Form */}
                {activeTab === "signin" && (
                  <motion.form
                    key="signin"
                    onSubmit={handleSignin}
                    className="space-y-6"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={handleDragEnd}
                    style={{ x, opacity }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FloatingInput
                      id="signin-email"
                      type="email"
                      label="Email"
                      value={signinData.email}
                      onChange={(e) => setSigninData({ ...signinData, email: e.target.value })}
                      icon={Mail}
                      required
                    />

                    <FloatingInput
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      label="Password"
                      value={signinData.password}
                      onChange={(e) => setSigninData({ ...signinData, password: e.target.value })}
                      icon={Lock}
                      required
                      endIcon={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      }
                    />

                    <RippleButton
                      type="submit"
                      className="w-full gradient-button text-white font-semibold shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] transition-all duration-300"
                      size="lg"
                    >
                      <motion.span
                        className="flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.05 }}
                      >
                        Sign In
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </motion.span>
                    </RippleButton>

                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border/50" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card/50 px-2 text-muted-foreground backdrop-blur-sm">Or continue with</span>
                      </div>
                    </div>

                    {/* Round glowing social login icons */}
                    <div className="grid grid-cols-4 gap-3">
                      <motion.button
                        type="button"
                        className="aspect-square rounded-full glass neon-border flex items-center justify-center hover-neon-pulse group"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Chrome className="h-5 w-5 text-primary group-hover:text-accent transition-colors" />
                      </motion.button>
                      <motion.button
                        type="button"
                        className="aspect-square rounded-full glass neon-border flex items-center justify-center hover-neon-pulse group"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <KeyRound className="h-5 w-5 text-primary group-hover:text-accent transition-colors" />
                      </motion.button>
                      <motion.button
                        type="button"
                        className="aspect-square rounded-full glass neon-border flex items-center justify-center hover-neon-pulse group"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Zap className="h-5 w-5 text-primary group-hover:text-accent transition-colors" />
                      </motion.button>
                      <motion.button
                        type="button"
                        className="aspect-square rounded-full glass neon-border flex items-center justify-center hover-neon-pulse group"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Fingerprint className="h-5 w-5 text-primary group-hover:text-accent transition-colors" />
                      </motion.button>
                    </div>
                  </motion.form>
                )}

                {/* Sign Up Form */}
                {activeTab === "signup" && (
                  <motion.form
                    key="signup"
                    onSubmit={handleSignup}
                    className="space-y-6"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={handleDragEnd}
                    style={{ x, opacity }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FloatingInput
                      id="signup-name"
                      type="text"
                      label="Full Name"
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      icon={User}
                      required
                    />

                    <FloatingInput
                      id="signup-email"
                      type="email"
                      label="Email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      icon={Mail}
                      required
                    />

                    <div className="space-y-2">
                      <FloatingInput
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        label="Password"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        icon={Lock}
                        required
                        endIcon={
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        }
                      />
                      <AnimatePresence>
                        {signupData.password && (
                          <PasswordStrengthIndicator password={signupData.password} />
                        )}
                      </AnimatePresence>
                    </div>

                    <FloatingInput
                      id="signup-confirm"
                      type={showConfirmPassword ? "text" : "password"}
                      label="Confirm Password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      icon={Lock}
                      required
                      endIcon={
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      }
                    />

                    <RippleButton
                      type="submit"
                      className="w-full gradient-button text-white font-semibold shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] transition-all duration-300"
                      size="lg"
                    >
                      <motion.span
                        className="flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.05 }}
                      >
                        Create Account
                        <motion.span
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          ✨
                        </motion.span>
                      </motion.span>
                    </RippleButton>

                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border/50" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card/50 px-2 text-muted-foreground backdrop-blur-sm">Or continue with</span>
                      </div>
                    </div>

                    {/* Round glowing social login icons */}
                    <div className="grid grid-cols-4 gap-3">
                      <motion.button
                        type="button"
                        className="aspect-square rounded-full glass neon-border flex items-center justify-center hover-neon-pulse group"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Chrome className="h-5 w-5 text-primary group-hover:text-accent transition-colors" />
                      </motion.button>
                      <motion.button
                        type="button"
                        className="aspect-square rounded-full glass neon-border flex items-center justify-center hover-neon-pulse group"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <KeyRound className="h-5 w-5 text-primary group-hover:text-accent transition-colors" />
                      </motion.button>
                      <motion.button
                        type="button"
                        className="aspect-square rounded-full glass neon-border flex items-center justify-center hover-neon-pulse group"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Zap className="h-5 w-5 text-primary group-hover:text-accent transition-colors" />
                      </motion.button>
                      <motion.button
                        type="button"
                        className="aspect-square rounded-full glass neon-border flex items-center justify-center hover-neon-pulse group"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Fingerprint className="h-5 w-5 text-primary group-hover:text-accent transition-colors" />
                      </motion.button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Swipe hint */}
              <motion.p
                className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <span>👆 Swipe to switch forms</span>
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
