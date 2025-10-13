import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Paperclip, 
  Mic, 
  MicOff,
  Smile,
  Image as ImageIcon,
  FileText,
  Sparkles,
  X
} from "lucide-react";

interface ModernComposerProps {
  onSendMessage: (content: string) => void;
}

export function ModernComposer({ onSendMessage }: ModernComposerProps) {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const attachments = [
    { icon: ImageIcon, label: "Photo", color: "text-purple-500" },
    { icon: FileText, label: "File", color: "text-blue-500" },
    { icon: Sparkles, label: "AI Assist", color: "text-yellow-500" },
  ];

  return (
    <div className="relative px-6 py-4 border-t border-border/50 bg-card/30 backdrop-blur-xl">
      {/* Attachment menu */}
      <AnimatePresence>
        {showAttachments && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-6 mb-2 p-2 bg-popover/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl"
          >
            {attachments.map((attachment, index) => (
              <motion.button
                key={attachment.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, x: 4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  console.log("Attach", attachment.label);
                  setShowAttachments(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-muted transition-colors"
              >
                <attachment.icon className={`h-5 w-5 ${attachment.color}`} />
                <span className="text-sm font-medium">{attachment.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recording indicator */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-3 h-3 bg-destructive rounded-full"
              />
              <span className="text-sm font-medium">Recording...</span>
            </div>
            
            <div className="flex items-center gap-2">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-destructive rounded-full"
                  animate={{ height: [4, 20, 4] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsRecording(false)}
              className="p-1.5 hover:bg-destructive/20 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input area */}
      <div className="flex items-end gap-3">
        {/* Attachment button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowAttachments(!showAttachments)}
          className={`p-3 rounded-xl transition-all ${
            showAttachments
              ? "bg-primary text-primary-foreground"
              : "bg-muted/50 hover:bg-muted"
          }`}
        >
          {showAttachments ? (
            <X className="h-5 w-5" />
          ) : (
            <Paperclip className="h-5 w-5" />
          )}
        </motion.button>

        {/* Text input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              adjustHeight();
            }}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            rows={1}
            className="w-full px-4 py-3 pr-12 bg-muted/50 border border-border/50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm"
          />
          
          {/* Emoji button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-3 bottom-3 p-1.5 hover:bg-muted rounded-lg transition-colors"
          >
            <Smile className="h-5 w-5 text-muted-foreground" />
          </motion.button>
        </div>

        {/* Send/Voice button */}
        {message.trim() ? (
          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            className="p-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-all"
          >
            <Send className="h-5 w-5" />
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsRecording(!isRecording)}
            className={`p-3 rounded-xl transition-all ${
              isRecording
                ? "bg-destructive text-destructive-foreground animate-pulse"
                : "bg-muted/50 hover:bg-muted"
            }`}
          >
            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </motion.button>
        )}
      </div>
    </div>
  );
}
