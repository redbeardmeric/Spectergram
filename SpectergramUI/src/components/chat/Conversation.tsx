import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MessageComposer from "./MessageComposer";
import AIFeatures from "./AIFeatures";
import TypingIndicator from "./TypingIndicator";
import SettingsModal from "./Settings";
import { EnhancedHeader } from "./EnhancedHeader";
import { MessageBubble } from "./MessageBubble";
import { FloatingParticles } from "./FloatingParticles";
import { LightModeEnhancement } from "./LightModeEnhancement";
import { Sparkles } from "lucide-react";
import type { Friend, Message } from "@/pages/Chat";

interface ConversationProps {
  friend: Friend | null;
  messages: Message[];
  onSendMessage: (content: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const Conversation = ({ friend, messages, onSendMessage, isDarkMode, onToggleTheme }: ConversationProps) => {
  const [isTyping, setIsTyping] = useState(false);
  const [showAISummary, setShowAISummary] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [smartReplies] = useState([
    "Sounds great! 👍",
    "Let me think about it",
    "Sure, when works for you?"
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!friend) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Select a conversation
            </h3>
            <p className="text-muted-foreground">
              Choose a friend to start chatting with premium AI features
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background relative overflow-hidden">
      {/* Enhanced backgrounds */}
      <FloatingParticles />
      <LightModeEnhancement />
      
      {/* Header */}
      <EnhancedHeader 
        friend={friend}
        onShowAISummary={() => setShowAISummary(!showAISummary)}
        onShowSettings={() => setShowSettings(true)}
      />

      {/* AI Summary */}
      <AnimatePresence>
        {showAISummary && (
          <AIFeatures onClose={() => setShowAISummary(false)} />
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
        <AnimatePresence>
          {messages.map((message, index) => (
            <MessageBubble key={message.id} message={message} index={index} />
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && <TypingIndicator />}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Smart Replies */}
      {smartReplies.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="px-4 py-2 border-t border-border/50 bg-card/30 backdrop-blur-sm relative z-10"
        >
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="h-3 w-3 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">Quick Replies</span>
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-1">
            {smartReplies.map((reply, index) => (
              <motion.button
                key={index}
                initial={{ scale: 0.9, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSendMessage(reply)}
                className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                         bg-gradient-to-r from-primary/10 to-accent/10 
                         border border-primary/20 hover:border-primary/40
                         text-foreground hover:shadow-lg hover:shadow-primary/20
                         transition-all duration-300"
              >
                {reply}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Message Composer */}
      <MessageComposer
        onSendMessage={onSendMessage}
        onTypingStart={() => setIsTyping(true)}
        onTypingStop={() => setIsTyping(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        isDarkMode={isDarkMode}
        onToggleTheme={onToggleTheme}
      />
    </div>
  );
};

export default Conversation;