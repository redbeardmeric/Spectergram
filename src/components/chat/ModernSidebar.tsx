import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MessageSquarePlus, 
  Users, 
  Settings as SettingsIcon, 
  Search,
  ChevronLeft,
  ChevronRight,
  Shield,
  Sparkles
} from "lucide-react";
import type { Friend } from "@/pages/Chat";
import { useState } from "react";

interface ModernSidebarProps {
  friends: Friend[];
  selectedFriend: Friend | null;
  onSelectFriend: (friend: Friend) => void;
}

export function ModernSidebar({ friends, selectedFriend, onSelectFriend }: ModernSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      case "offline": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <motion.div
      className="h-full bg-card/50 backdrop-blur-xl border-r border-border/50 flex flex-col relative"
      animate={{ width: isCollapsed ? 80 : 320 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5 pointer-events-none" />

      {/* Header - Spectergram Branding */}
      <div className="p-4 border-b border-border/50 relative z-10 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center justify-between mb-4">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Shield className="h-6 w-6 text-primary" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Spectergram
                </h2>
                <p className="text-xs text-muted-foreground">Secure Messaging</p>
              </div>
            </motion.div>
          )}
          
          {isCollapsed && (
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Shield className="h-6 w-6 text-primary" />
            </motion.div>
          )}
          
          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </motion.button>
        </div>

        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </motion.div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-border/50 space-y-2 relative z-10">
        <motion.button
          whileHover={{ scale: 1.02, x: 2 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-primary via-accent to-primary text-white font-medium shadow-lg hover:shadow-xl transition-all relative overflow-hidden ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ["-100%", "100%"]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <MessageSquarePlus className="h-5 w-5 relative z-10" />
          {!isCollapsed && <span className="relative z-10">New Chat</span>}
        </motion.button>

        {!isCollapsed && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02, x: 2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-all"
          >
            <Users className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm">Groups</span>
            <Badge className="ml-auto">3</Badge>
          </motion.button>
        )}
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto relative z-10">
        {filteredFriends.map((friend, index) => (
          <motion.button
            key={friend.id}
            onClick={() => onSelectFriend(friend)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ x: 4, backgroundColor: "hsl(var(--muted) / 0.5)" }}
            className={`w-full p-4 flex items-center gap-3 border-b border-border/30 transition-all ${
              selectedFriend?.id === friend.id
                ? "bg-primary/10 border-l-4 border-l-primary"
                : ""
            } ${isCollapsed ? "justify-center" : ""}`}
          >
            <div className="relative flex-shrink-0">
              <Avatar className={`${isCollapsed ? "h-10 w-10" : "h-12 w-12"} ring-2 ring-border`}>
                <AvatarImage src={friend.avatar} alt={friend.name} />
                <AvatarFallback>{friend.name[0]}</AvatarFallback>
              </Avatar>
              <motion.div
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${getStatusColor(friend.status)}`}
                animate={
                  friend.status === "online"
                    ? { scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }
                    : {}
                }
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>

            {!isCollapsed && (
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-sm truncate">{friend.name}</h3>
                  {friend.timestamp && (
                    <span className="text-xs text-muted-foreground ml-2">
                      {friend.timestamp}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {friend.lastMessage || "No messages yet"}
                </p>
              </div>
            )}

            {!isCollapsed && friend.unread && friend.unread > 0 && (
              <Badge className="bg-primary text-primary-foreground">
                {friend.unread}
              </Badge>
            )}
          </motion.button>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-border/50 relative z-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <SettingsIcon className="h-5 w-5 text-muted-foreground" />
          {!isCollapsed && <span className="text-sm">Settings</span>}
        </motion.button>
      </div>
    </motion.div>
  );
}
