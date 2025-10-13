import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, CheckCheck, Clock, MoreVertical, Reply, Smile } from "lucide-react";
import { MessageEncryptionBadge } from "./SecurityIndicator";
import type { Message } from "@/pages/Chat";
import { useState } from "react";

interface FloatingMessageProps {
  message: Message;
  index: number;
  senderAvatar?: string;
  senderName?: string;
  isGrouped?: boolean;
}

export function FloatingMessage({ 
  message, 
  index, 
  senderAvatar, 
  senderName,
  isGrouped = false 
}: FloatingMessageProps) {
  const [showActions, setShowActions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "sending": return <Clock className="h-3 w-3 animate-spin opacity-50" />;
      case "sent": return <Check className="h-3 w-3 opacity-50" />;
      case "delivered": return <CheckCheck className="h-3 w-3 opacity-50" />;
      case "read": return <CheckCheck className="h-3 w-3 text-primary" />;
      default: return null;
    }
  };

  const reactions = ["❤️", "😂", "👍", "🔥", "😮", "😢"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 25 }}
      className={`flex gap-3 group relative ${
        message.sender === "user" ? "flex-row-reverse" : "flex-row"
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar (only show for friend messages if not grouped) */}
      {message.sender === "friend" && !isGrouped && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex-shrink-0"
        >
          <Avatar className="h-8 w-8 ring-2 ring-border/50">
            <AvatarImage src={senderAvatar} alt={senderName} />
            <AvatarFallback>{senderName?.[0] || "?"}</AvatarFallback>
          </Avatar>
        </motion.div>
      )}

      {message.sender === "friend" && isGrouped && (
        <div className="w-8 flex-shrink-0" />
      )}

      {/* Message Card */}
      <div className={`flex flex-col ${message.sender === "user" ? "items-end" : "items-start"} max-w-[70%]`}>
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          className={`
            relative px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm
            ${
              message.sender === "user"
                ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-br-sm"
                : "bg-card border border-border/50 rounded-bl-sm"
            }
          `}
        >
          {/* Message content */}
          <p className="text-sm leading-relaxed break-words">{message.content}</p>

          {/* Timestamp and status */}
          <div className={`flex items-center gap-2 mt-2 ${
            message.sender === "user" ? "justify-end" : "justify-start"
          }`}>
            <MessageEncryptionBadge />
            <span className="text-xs opacity-60">{message.timestamp}</span>
            {message.sender === "user" && getStatusIcon(message.status)}
          </div>

          {/* Existing reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="absolute -bottom-2 right-4 flex gap-1">
              {message.reactions.map((reaction, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.3 }}
                  className="bg-card border border-border/50 rounded-full px-2 py-0.5 text-xs shadow-md"
                >
                  {reaction}
                </motion.div>
              ))}
            </div>
          )}

          {/* Quick actions on hover */}
          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                className={`absolute -top-12 ${
                  message.sender === "user" ? "right-0" : "left-0"
                } flex gap-1 bg-popover/95 backdrop-blur-xl border border-border/50 rounded-xl px-2 py-1.5 shadow-xl`}
              >
                <motion.button
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowReactions(!showReactions)}
                  className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                >
                  <Smile className="h-4 w-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                >
                  <Reply className="h-4 w-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                >
                  <MoreVertical className="h-4 w-4" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reaction picker */}
          <AnimatePresence>
            {showReactions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`absolute -top-20 ${
                  message.sender === "user" ? "right-0" : "left-0"
                } flex gap-1 bg-popover/95 backdrop-blur-xl border border-border/50 rounded-xl px-3 py-2 shadow-xl`}
              >
                {reactions.map((emoji) => (
                  <motion.button
                    key={emoji}
                    whileHover={{ scale: 1.3, y: -4 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      console.log("React with", emoji);
                      setShowReactions(false);
                    }}
                    className="text-lg hover:bg-muted rounded-lg p-1 transition-colors"
                  >
                    {emoji}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
