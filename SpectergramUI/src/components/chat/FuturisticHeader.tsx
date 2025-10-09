import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Video,
  Info,
  MoreVertical,
  Sparkles,
  Search
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SecurityIndicator } from "./SecurityIndicator";
import { ThemeSwitcher } from "./ThemeSwitcher";
import type { Friend } from "@/pages/Chat";

interface FuturisticHeaderProps {
  friend: Friend;
  onShowInfo: () => void;
}

export function FuturisticHeader({ friend, onShowInfo }: FuturisticHeaderProps) {
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
      className="relative px-6 py-4 border-b border-border/50 bg-card/30 backdrop-blur-xl"
    >
      {/* Animated gradient bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

      <div className="flex items-center justify-between">
        {/* Friend info */}
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <Avatar className="h-12 w-12 ring-2 ring-primary/20">
              <AvatarImage src={friend.avatar} alt={friend.name} />
              <AvatarFallback>{friend.name[0]}</AvatarFallback>
            </Avatar>
            {friend.status === "online" && (
              <motion.div
                className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-card"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-lg">{friend.name}</h2>
              {friend.status === "online" && (
                <Badge 
                  variant="secondary" 
                  className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 px-2 py-0"
                >
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Active
                  </motion.span>
                </Badge>
              )}
            </div>
            <p className={`text-sm ${getStatusColor(friend.status)}`}>
              {friend.status === "online" ? "Online now" : 
               friend.status === "away" ? "Away" : "Offline"}
            </p>
          </div>
        </div>

        {/* Center: Security Indicator */}
        <div className="flex-1 flex justify-center">
          <SecurityIndicator />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2.5 rounded-xl hover:bg-muted transition-colors"
          >
            <Phone className="h-5 w-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2.5 rounded-xl hover:bg-muted transition-colors"
          >
            <Video className="h-5 w-5" />
          </motion.button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 rounded-xl hover:bg-muted transition-colors"
              >
                <MoreVertical className="h-5 w-5" />
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="cursor-pointer">
                <Search className="h-4 w-4 mr-2" />
                Search
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Sparkles className="h-4 w-4 mr-2 text-primary" />
                AI Features
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={onShowInfo}>
                <Info className="h-4 w-4 mr-2" />
                Chat Info
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5">
                <ThemeSwitcher />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.div>
  );
}
