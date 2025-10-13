import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FuturisticHeader } from "./FuturisticHeader";
import { FloatingMessage } from "./FloatingMessage";
import { ModernComposer } from "./ModernComposer";
import { LightModeEnhancement } from "./LightModeEnhancement";
import { FloatingParticles } from "./FloatingParticles";
import { SecretChatMode } from "./SecurityIndicator";
import TypingIndicator from "./TypingIndicator";
import { Sparkles, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Friend, Message } from "@/pages/Chat";

interface ModernConversationProps {
  friend: Friend | null;
  messages: Message[];
  onSendMessage: (content: string) => void;
}

export function ModernConversation({ friend, messages, onSendMessage }: ModernConversationProps) {
  const [isTyping, setIsTyping] = useState(false);
  const [secretMode, setSecretMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate typing when user starts typing
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].sender === "user") {
      setIsTyping(true);
      const timeout = setTimeout(() => setIsTyping(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [messages]);

  if (!friend) {
    return (
      <div className="h-full flex items-center justify-center bg-background relative overflow-hidden">
        <FloatingParticles />
        <LightModeEnhancement />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 relative z-10"
        >
          <motion.div
            className="w-24 h-24 mx-auto bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-border/50"
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Sparkles className="h-12 w-12 text-primary" />
          </motion.div>
          
          <div>
            <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Choose a Conversation
            </h3>
            <p className="text-muted-foreground max-w-md">
              Select a friend from the sidebar to start chatting with our next-gen messaging experience
            </p>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-2 gap-4 mt-8 max-w-lg mx-auto">
            {[
              { icon: Sparkles, label: "AI-Powered", color: "from-purple-500 to-pink-500" },
              { icon: TrendingUp, label: "Real-time", color: "from-blue-500 to-cyan-500" }
            ].map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="p-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl"
              >
                <div className={`w-10 h-10 mx-auto mb-2 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center`}>
                  <feature.icon className="h-5 w-5 text-white" />
                </div>
                <p className="text-sm font-medium">{feature.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // Group messages by sender for better UI
  const groupedMessages = messages.reduce((groups: any[], message, index) => {
    const prevMessage = messages[index - 1];
    const isGrouped = prevMessage && prevMessage.sender === message.sender;
    
    groups.push({
      ...message,
      isGrouped,
    });
    
    return groups;
  }, []);

  return (
    <div className={`h-full flex flex-col bg-background relative overflow-hidden ${secretMode ? 'brightness-90' : ''}`}>
      <FloatingParticles />
      <LightModeEnhancement />
      
      {/* Header */}
      <FuturisticHeader 
        friend={friend}
        onShowInfo={() => console.log("Show info")}
      />

      {/* Secret Mode Toggle */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 pt-3 flex items-center justify-between border-b border-border/30 pb-3 relative z-10"
      >
        <SecretChatMode active={secretMode} />
        
        {!secretMode && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSecretMode(true)}
            className="gap-2 text-xs"
          >
            <Zap className="h-3 w-3" />
            Enable Secret Chat
          </Button>
        )}

        {secretMode && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSecretMode(false)}
            className="gap-2 text-xs text-purple-500"
          >
            Disable Secret Mode
          </Button>
        )}
      </motion.div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 relative z-10">
        {/* Date divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center my-6"
        >
          <div className="px-4 py-1.5 bg-muted/50 backdrop-blur-sm border border-border/50 rounded-full text-xs font-medium text-muted-foreground">
            Today
          </div>
        </motion.div>

        <AnimatePresence mode="popLayout">
          {groupedMessages.map((message, index) => (
            <FloatingMessage
              key={message.id}
              message={message}
              index={index}
              senderAvatar={friend.avatar}
              senderName={friend.name}
              isGrouped={message.isGrouped}
            />
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex gap-3"
            >
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                </div>
              </div>
              <TypingIndicator />
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <ModernComposer onSendMessage={onSendMessage} />
    </div>
  );
}
