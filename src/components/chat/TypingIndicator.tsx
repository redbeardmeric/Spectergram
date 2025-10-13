import { motion } from "framer-motion";

const TypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="flex justify-start"
    >
      <div className="message-received max-w-xs lg:max-w-md px-4 py-3 rounded-2xl mr-12">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">typing</span>
          <div className="flex space-x-1">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-2 h-2 bg-muted-foreground rounded-full"
                animate={{
                  y: [0, -8, 0],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.2,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;