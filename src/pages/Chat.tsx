import { useState } from "react";
import { motion } from "framer-motion";
import { ModernSidebar } from "@/components/chat/ModernSidebar";
import { ModernConversation } from "@/components/chat/ModernConversation";
import { SettingsModal } from "@/components/chat/SettingsModal";
import { useToast } from "@/hooks/use-toast";

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "away" | "offline";
  lastMessage?: string;
  timestamp?: string;
  unread?: number;
}

export interface Message {
  id: string;
  content: string;
  sender: "user" | "friend";
  timestamp: string;
  reactions?: string[];
  status?: "sending" | "sent" | "delivered" | "read";
}

const Chat = () => {
  const { toast } = useToast();
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // Mock data
  const friends: Friend[] = [
    {
      id: "1",
      name: "Alice Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      status: "online",
      lastMessage: "Hey! How's your day going?",
      timestamp: "2 min ago",
      unread: 2,
    },
    {
      id: "2", 
      name: "Bob Smith",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face",
      status: "away",
      lastMessage: "Sure, let's meet tomorrow",
      timestamp: "1h ago",
    },
    {
      id: "3",
      name: "Carol Wilson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", 
      status: "offline",
      lastMessage: "Thanks for the help!",
      timestamp: "3h ago",
    },
    {
      id: "4",
      name: "David Brown",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      status: "online",
      lastMessage: "The meeting went well",
      timestamp: "5h ago",
    },
  ];

  const mockMessages: Message[] = selectedFriend ? [
    {
      id: "1",
      content: "Hey there! How's everything going?",
      sender: "friend",
      timestamp: "10:30 AM",
    },
    {
      id: "2", 
      content: "Hi! Everything's great, thanks for asking. Just working on some exciting projects.",
      sender: "user",
      timestamp: "10:32 AM",
    },
    {
      id: "3",
      content: "That sounds awesome! What kind of projects?",
      sender: "friend", 
      timestamp: "10:33 AM",
      reactions: ["👍", "❤️"],
    },
    {
      id: "4",
      content: "I'm building a premium chat application with some really cool AI features. The UI is inspired by Signal and Telegram but with a more futuristic feel.",
      sender: "user",
      timestamp: "10:35 AM",
      status: "read",
    },
    {
      id: "5",
      content: "Wow, that sounds incredible! I'd love to see it when it's ready. 🚀",
      sender: "friend",
      timestamp: "10:36 AM",
    },
  ] : [];

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
    toast({
      title: `Switched to ${!isDarkMode ? "dark" : "light"} mode`,
      description: "Theme preference updated",
    });
  };

  return (
    <>
      <div className={`h-screen flex bg-background ${isDarkMode ? "dark" : ""}`}>
        <ModernSidebar
          friends={friends}
          selectedFriend={selectedFriend}
          onSelectFriend={setSelectedFriend}
        />

        <div className="flex-1">
          <ModernConversation
            friend={selectedFriend}
            messages={mockMessages}
            onSendMessage={(content) => {
              console.log("Sending message:", content);
              toast({
                title: "Message sent",
                description: `Message sent to ${selectedFriend?.name}`,
              });
            }}
          />
        </div>
      </div>

      <SettingsModal open={showSettings} onOpenChange={setShowSettings} />
    </>
  );
};

export default Chat;