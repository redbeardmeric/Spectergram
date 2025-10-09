import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function AIIndicator() {
  return (
    <motion.div
      className="flex items-center gap-2 px-4 py-2 glass rounded-full"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2 }}
    >
      <motion.div
        className="relative"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="h-2 w-2 rounded-full bg-primary" />
        <motion.div
          className="absolute inset-0 h-2 w-2 rounded-full bg-primary"
          animate={{
            opacity: [0.7, 0, 0.7],
            scale: [1, 2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
      <span className="text-xs text-muted-foreground font-medium">AI Assistant Online</span>
    </motion.div>
  );
}
