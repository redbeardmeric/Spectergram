import { useState } from "react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FloatingInputProps {
  id: string;
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: LucideIcon;
  required?: boolean;
  endIcon?: React.ReactNode;
}

export function FloatingInput({
  id,
  type,
  label,
  value,
  onChange,
  icon: Icon,
  required = false,
  endIcon,
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isActive = isFocused || value.length > 0;

  return (
    <div className={`relative ${isActive ? 'input-focused' : ''} ${value ? 'input-filled' : ''}`}>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
        <Input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`pl-10 ${endIcon ? 'pr-10' : ''} glass border-border/50 transition-all duration-300 text-foreground ${
            isFocused ? 'border-primary shadow-[0_0_15px_rgba(168,85,247,0.4)]' : ''
          }`}
          required={required}
        />
        {endIcon && <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">{endIcon}</div>}
        <motion.label
          htmlFor={id}
          className="absolute left-10 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none floating-label origin-left"
          animate={{
            y: isActive ? -32 : -8,
            scale: isActive ? 0.85 : 1,
            color: isFocused ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
          }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.label>
      </div>
    </div>
  );
}
