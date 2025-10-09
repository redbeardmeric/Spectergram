import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const checks = [
    { label: "At least 8 characters", test: password.length >= 8, emoji: "📏" },
    { label: "Contains uppercase & lowercase", test: /[a-z]/.test(password) && /[A-Z]/.test(password), emoji: "🔤" },
    { label: "Contains a number", test: /[0-9]/.test(password), emoji: "🔢" },
    { label: "Contains special character", test: /[^a-zA-Z0-9]/.test(password), emoji: "🔐" },
  ];

  const strength = checks.filter(c => c.test).length;
  const strengthText = ["Weak", "Fair", "Good", "Strong"][strength - 1] || "Weak";
  const strengthEmoji = ["😟", "😐", "🙂", "🤩"][strength - 1] || "😟";

  const strengthColor = 
    strength === 1 ? "from-red-500 to-red-600" :
    strength === 2 ? "from-orange-500 to-orange-600" :
    strength === 3 ? "from-yellow-500 to-yellow-600" : 
    "from-green-500 to-green-600";

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="space-y-3 mt-3"
    >
      {/* Strength bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Password Strength</span>
          <span className="flex items-center gap-1 font-medium">
            {strengthText} {strengthEmoji}
          </span>
        </div>
        <div className="flex gap-1 h-2">
          {[1, 2, 3, 4].map((level) => (
            <motion.div
              key={level}
              className={`flex-1 rounded-full transition-all duration-300 ${
                strength >= level 
                  ? `bg-gradient-to-r ${strengthColor}` 
                  : 'bg-muted'
              }`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: level * 0.1 }}
            />
          ))}
        </div>
      </div>

      {/* Requirements checklist */}
      <div className="space-y-1.5 text-xs">
        {checks.map((check, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-2 ${
              check.test ? "text-green-500" : "text-muted-foreground"
            }`}
          >
            {check.test ? (
              <Check className="h-3 w-3" />
            ) : (
              <X className="h-3 w-3" />
            )}
            <span>{check.emoji} {check.label}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
