import { useState, MouseEvent } from "react";
import { motion } from "framer-motion";
import { Button, ButtonProps } from "@/components/ui/button";

interface Ripple {
  x: number;
  y: number;
  id: number;
}

export function RippleButton({ children, onClick, className, ...props }: ButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple: Ripple = {
      x,
      y,
      id: Date.now(),
    };

    setRipples([...ripples, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    onClick?.(e);
  };

  return (
    <Button
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/30"
          initial={{
            width: 0,
            height: 0,
            x: ripple.x,
            y: ripple.y,
            opacity: 1,
          }}
          animate={{
            width: 400,
            height: 400,
            x: ripple.x - 200,
            y: ripple.y - 200,
            opacity: 0,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
      <span className="relative z-10">{children}</span>
    </Button>
  );
}
