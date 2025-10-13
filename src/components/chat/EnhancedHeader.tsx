import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Video,
  Info,
  Sparkles,
  Settings,
  MoreVertical,
  Zap
} from "lucide-react";
import type { Friend } from "@/pages/Chat";

interface EnhancedHeaderProps {
  friend: Friend;
  onShowAISummary: () => void;
  onShowSettings: () => void;
}

export function EnhancedHeader({ friend, onShowAISummary, onShowSettings }: EnhancedHeaderProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "text-green-500";
      case "away": return "text-yellow-500";
      case "offline": return "text-gray-500";
      default: return "text-gray-500";
    }
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative flex items-center justify-between p-4 border-b border-border bg-card/80 backdrop-blur-xl"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-50" />
      
      <div className="flex items-center space-x-3 relative z-10">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative"
        >
          <Avatar className="h-11 w-11 ring-2 ring-primary/20">
            <AvatarImage src={friend.avatar} alt={friend.name} />
            <AvatarFallback>{friend.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          {friend.status === "online" && (
            <motion.div
              className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-card"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.div>
        
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-foreground">{friend.name}</h3>
            {friend.status === "online" && (
              <Badge variant="secondary" className="text-xs px-2 py-0 bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Live
                </motion.span>
              </Badge>
            )}
          </div>
          <p className={`text-xs ${getStatusColor(friend.status)}`}>
            {friend.status === "online" ? "Active now" : 
             friend.status === "away" ? "Away" : "Last seen recently"}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-1 relative z-10">
        <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={onShowAISummary}
            className="h-9 w-9 hover:bg-primary/10 hover:text-primary"
          >
            <Zap className="h-4 w-4" />
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Phone className="h-4 w-4" />
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Video className="h-4 w-4" />
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Info className="h-4 w-4" />
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9"
            onClick={onShowSettings}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
