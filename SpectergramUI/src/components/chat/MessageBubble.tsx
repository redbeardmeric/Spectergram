import { motion } from "framer-motion";
import { Check, CheckCheck, Clock, Sparkles } from "lucide-react";
import type { Message } from "@/pages/Chat";

interface MessageBubbleProps {
  message: Message;
  index: number;
}

export function MessageBubble({ message, index }: MessageBubbleProps) {
  const getMessageStatusIcon = (status?: string) => {
    switch (status) {
      case "sending": return <Clock className="h-3 w-3 text-muted-foreground animate-spin" />;
      case "sent": return <Check className="h-3 w-3 text-muted-foreground" />;
      case "delivered": return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case "read": return <CheckCheck className="h-3 w-3 text-primary" />;
      default: return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
    >
      <motion.div
        className={`
          max-w-xs lg:max-w-md px-4 py-3 rounded-2xl
          ${message.sender === "user" 
            ? "message-sent ml-12 shadow-lg shadow-primary/20" 
            : "message-received mr-12 shadow-lg"
          }
          relative group hover:shadow-xl transition-all duration-300
          backdrop-blur-sm border
          ${message.sender === "user" 
            ? "border-primary/20" 
            : "border-border/50"
          }
        `}
        whileHover={{ scale: 1.02, y: -2 }}
      >
        {/* Subtle gradient overlay for sent messages */}
        {message.sender === "user" && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl pointer-events-none" />
        )}

        <p className="text-sm leading-relaxed relative z-10">{message.content}</p>
        
        <div className="flex items-center justify-between mt-2 relative z-10">
          <div className="flex items-center space-x-2">
            <span className={`text-xs ${
              message.sender === "user" 
                ? "text-message-sent-foreground/70" 
                : "text-muted-foreground"
            }`}>
              {message.timestamp}
            </span>
            
            {message.sender === "user" && getMessageStatusIcon(message.status)}
          </div>
          
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex space-x-1">
              {message.reactions.map((reaction, idx) => (
                <motion.span
                  key={idx}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  className="text-xs cursor-pointer"
                >
                  {reaction}
                </motion.span>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced reaction hover menu */}
        <motion.div
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 
                     opacity-0 group-hover:opacity-100 transition-all duration-200
                     bg-popover/95 border border-border/50 rounded-xl px-3 py-2
                     flex space-x-2 shadow-xl backdrop-blur-lg z-10"
          initial={{ scale: 0.8, opacity: 0, y: 10 }}
          whileHover={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {["👍", "❤️", "😂", "😮", "😢", "🔥", "✨", "🎉"].map((emoji) => (
            <motion.button
              key={emoji}
              className="hover:scale-125 transition-all text-base p-1 rounded-full hover:bg-accent/20"
              onClick={() => console.log("React with", emoji)}
              whileHover={{ scale: 1.3, y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              {emoji}
            </motion.button>
          ))}
        </motion.div>

        {/* AI enhancement indicator for certain messages */}
        {message.content.length > 200 && message.sender === "friend" && (
          <motion.div
            className="absolute -top-2 -right-2 bg-primary/20 backdrop-blur-sm rounded-full p-1 border border-primary/30"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <Sparkles className="h-3 w-3 text-primary" />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
