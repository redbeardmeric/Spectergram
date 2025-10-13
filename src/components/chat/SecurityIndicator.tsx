import { motion } from "framer-motion";
import { Shield, Lock, Zap } from "lucide-react";

export function SecurityIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-full backdrop-blur-sm"
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity
        }}
      >
        <Shield className="w-3.5 h-3.5 text-green-500" />
      </motion.div>
      
      <span className="text-xs font-medium text-green-500">Secure Session Active</span>
      
      <motion.div
        animate={{
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity
        }}
      >
        <Lock className="w-3 h-3 text-green-500/70" />
      </motion.div>
    </motion.div>
  );
}

export function MessageEncryptionBadge() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="inline-flex items-center gap-1 text-xs text-muted-foreground/60"
    >
      <motion.div
        animate={{
          rotate: [0, 360]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <Lock className="w-2.5 h-2.5" />
      </motion.div>
      <span className="text-[10px]">E2E</span>
    </motion.div>
  );
}

export function SecretChatMode({ active }: { active?: boolean }) {
  if (!active) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full backdrop-blur-sm"
    >
      <motion.div
        animate={{
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity
        }}
      >
        <Zap className="w-3.5 h-3.5 text-purple-500" />
      </motion.div>
      
      <span className="text-xs font-medium text-purple-500">Secret Chat</span>
      
      <motion.div
        className="w-1.5 h-1.5 bg-purple-500 rounded-full"
        animate={{
          opacity: [1, 0.3, 1]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity
        }}
      />
    </motion.div>
  );
}
