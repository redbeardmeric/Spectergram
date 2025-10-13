import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Send, 
  Paperclip, 
  Mic, 
  MicOff,
  Smile,
  Plus,
  Zap
} from "lucide-react";

interface MessageComposerProps {
  onSendMessage: (content: string) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
}

const MessageComposer = ({ 
  onSendMessage, 
  onTypingStart, 
  onTypingStop 
}: MessageComposerProps) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (message.trim()) {
      onTypingStart();
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        onTypingStop();
      }, 1000);
    } else {
      onTypingStop();
    }

    return () => {
      clearTimeout(typingTimeoutRef.current);
    };
  }, [message, onTypingStart, onTypingStop]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
      onTypingStop();
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

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Start recording
      console.log("Starting voice recording...");
    } else {
      // Stop recording
      console.log("Stopping voice recording...");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className="p-4 border-t border-border bg-card/30 backdrop-blur-sm">
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-3 h-3 bg-destructive rounded-full"
                />
                <span className="text-sm font-medium">Recording...</span>
                <span className="text-sm text-muted-foreground">
                  {formatTime(recordingTime)}
                </span>
              </div>
              
              {/* Animated waveform */}
              <div className="flex items-center space-x-1">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-destructive rounded-full"
                    animate={{
                      height: [4, 16, 4],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end space-x-3">
        {/* Quick Actions */}
        <div className="flex space-x-1">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Plus className="h-4 w-4" />
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Paperclip className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>

        {/* Message Input */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              adjustTextareaHeight();
            }}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="min-h-[44px] max-h-[120px] resize-none pr-20 glass border-border/50 focus:border-primary/50"
            rows={1}
          />
          
          {/* Emoji button */}
          <motion.div 
            className="absolute right-3 bottom-3"
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.9 }}
          >
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Smile className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </Button>
          </motion.div>
        </div>

        {/* Send/Voice Button */}
        <div className="flex space-x-2">
          {message.trim() ? (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={handleSend}
                variant="premium"
                size="icon"
                className="h-11 w-11"
              >
                <Send className="h-4 w-4" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={toggleRecording}
                variant={isRecording ? "destructive" : "ghost"}
                size="icon"
                className={`h-11 w-11 ${isRecording ? "animate-pulse-glow" : ""}`}
              >
                {isRecording ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            </motion.div>
          )}
          
          {/* AI Assist Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 glass border-border/50 hover:bg-primary/10"
              onClick={() => console.log("AI assist activated")}
            >
              <Zap className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MessageComposer;