import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Starfield particles
    const stars: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
    }> = [];

    // Create stars
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random(),
      });
    }

    let animationId: number;

    function animate() {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars with dynamic colors
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        
        // Get primary color from CSS variable
        const primaryHsl = getComputedStyle(document.documentElement).getPropertyValue('--neon-primary').trim();
        const [h, s, l] = primaryHsl.split(' ').map(v => parseFloat(v));
        
        ctx.fillStyle = `hsla(${h}, ${s}%, ${l}%, ${star.opacity})`;
        ctx.fill();

        // Move stars
        star.y += star.speed;
        star.opacity = Math.sin(Date.now() * 0.001 + star.x) * 0.5 + 0.5;

        // Reset star position
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      animationId = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {/* Canvas starfield */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
      />
      
      {/* Animated nebula gradients */}
      <motion.div
        className="fixed inset-0 z-0 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(ellipse at 20% 30%, rgba(138, 43, 226, 0.15) 0%, transparent 50%)",
            "radial-gradient(ellipse at 80% 70%, rgba(75, 0, 130, 0.15) 0%, transparent 50%)",
            "radial-gradient(ellipse at 50% 50%, rgba(103, 232, 249, 0.1) 0%, transparent 50%)",
            "radial-gradient(ellipse at 20% 30%, rgba(138, 43, 226, 0.15) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      {/* Plasma effect overlay */}
      <motion.div
        className="fixed inset-0 z-0 pointer-events-none opacity-30"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.2) 0%, transparent 50%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </>
  );
}
