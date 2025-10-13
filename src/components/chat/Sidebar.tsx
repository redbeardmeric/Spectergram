import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Settings, 
  Moon, 
  Sun,
  MoreVertical,
  Plus,
  MessageCircle
} from "lucide-react";
import type { Friend } from "@/pages/Chat";

interface SidebarProps {
  friends: Friend[];
  selectedFriend: Friend | null;
  onSelectFriend: (friend: Friend) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const Sidebar = ({ 
  friends, 
  selectedFriend, 
  onSelectFriend, 
  isDarkMode, 
  onToggleTheme 
}: SidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500 status-glow-online";
      case "away": return "bg-yellow-500 status-glow-away";
      case "offline": return "bg-gray-500 status-glow-offline";
      default: return "bg-gray-500";
    }
  };

  const getStatusAnimation = (status: string) => {
    return status === "online" ? "animate-glow-pulse" : "";
  };

  return (
    <div className="h-full flex flex-col bg-card relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      {/* Header */}
      <div className="p-4 border-b border-border relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">John Doe</h3>
              <p className="text-xs text-muted-foreground">Available</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleTheme}
                className="h-8 w-8"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass border-border/50 focus:border-primary/50"
          />
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4 border-b border-border relative z-10">
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-primary to-accent text-white font-medium shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </motion.button>
      </div>

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <AnimatePresence mode="wait">
          {filteredFriends.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-32 text-muted-foreground"
            >
              <MessageCircle className="h-8 w-8 mb-2" />
              <p className="text-sm">No conversations found</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredFriends.map((friend, index) => (
                <motion.div
                  key={friend.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 4, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectFriend(friend)}
                  className={`
                    flex items-center p-4 cursor-pointer transition-all duration-300
                    hover:bg-muted/50 hover:shadow-lg hover:shadow-primary/10 border-b border-border/50
                    ${selectedFriend?.id === friend.id ? 'bg-primary/10 border-l-4 border-l-primary shadow-inner' : ''}
                    group relative overflow-hidden
                  `}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={friend.avatar} alt={friend.name} />
                      <AvatarFallback>{friend.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <motion.div
                      animate={{ 
                        scale: friend.status === "online" ? [1, 1.2, 1] : 1,
                        opacity: friend.status === "online" ? [1, 0.7, 1] : 1
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: friend.status === "online" ? Infinity : 0,
                        ease: "easeInOut" 
                      }}
                      className={`
                        absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-card
                        ${getStatusColor(friend.status)} ${getStatusAnimation(friend.status)}
                      `}
                    />
                  </div>

                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground truncate">
                        {friend.name}
                      </h4>
                      {friend.timestamp && (
                        <span className="text-xs text-muted-foreground">
                          {friend.timestamp}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-muted-foreground truncate">
                        {friend.lastMessage || "No recent messages"}
                      </p>
                      
                      <div className="flex items-center space-x-2">
                        {friend.unread && friend.unread > 0 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center justify-center"
                          >
                            <Badge 
                              variant="default" 
                              className="h-5 w-5 text-xs p-0 bg-primary text-primary-foreground"
                            >
                              {friend.unread}
                            </Badge>
                          </motion.div>
                        )}
                        
                        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Sidebar;