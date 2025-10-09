import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Shield, 
  Bell, 
  Palette,
  Moon,
  Sun,
  Upload,
  Save
} from "lucide-react";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const Settings = ({ isOpen, onClose, isDarkMode, onToggleTheme }: SettingsProps) => {
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    status: "Available",
    bio: "Building amazing things with code"
  });

  const [notifications, setNotifications] = useState({
    messages: true,
    calls: true,
    mentions: true,
    sounds: false
  });

  const [privacy, setPrivacy] = useState({
    readReceipts: true,
    onlineStatus: true,
    lastSeen: false,
    profilePhoto: "everyone"
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[80vh] p-0 bg-gradient-to-br from-card via-card/95 to-background border border-border/50">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Settings
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="flex-1 px-6 pb-6">
          <TabsList className="grid w-full grid-cols-4 glass">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="theme" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Theme
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 overflow-y-auto max-h-[calc(80vh-160px)]">
            <TabsContent value="profile" className="mt-0 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Avatar Section */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="glass">
                      <Upload className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG or GIF. Max size 5MB.
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Profile Form */}
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Display Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="glass"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="glass"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="status">Status Message</Label>
                    <Input
                      id="status"
                      value={profileData.status}
                      onChange={(e) => setProfileData({...profileData, status: e.target.value})}
                      className="glass"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      className="glass"
                    />
                  </div>
                </div>

                <Button className="w-full" variant="premium">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </motion.div>
            </TabsContent>

            <TabsContent value="privacy" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Read Receipts</h4>
                      <p className="text-sm text-muted-foreground">
                        Let others know when you've read their messages
                      </p>
                    </div>
                    <Switch
                      checked={privacy.readReceipts}
                      onCheckedChange={(checked) => setPrivacy({...privacy, readReceipts: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Online Status</h4>
                      <p className="text-sm text-muted-foreground">
                        Show when you're online to your contacts
                      </p>
                    </div>
                    <Switch
                      checked={privacy.onlineStatus}
                      onCheckedChange={(checked) => setPrivacy({...privacy, onlineStatus: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Last Seen</h4>
                      <p className="text-sm text-muted-foreground">
                        Show when you were last active
                      </p>
                    </div>
                    <Switch
                      checked={privacy.lastSeen}
                      onCheckedChange={(checked) => setPrivacy({...privacy, lastSeen: checked})}
                    />
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="notifications" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Message Notifications</h4>
                      <p className="text-sm text-muted-foreground">
                        Get notified when you receive new messages
                      </p>
                    </div>
                    <Switch
                      checked={notifications.messages}
                      onCheckedChange={(checked) => setNotifications({...notifications, messages: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Call Notifications</h4>
                      <p className="text-sm text-muted-foreground">
                        Get notified for incoming calls
                      </p>
                    </div>
                    <Switch
                      checked={notifications.calls}
                      onCheckedChange={(checked) => setNotifications({...notifications, calls: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Mention Alerts</h4>
                      <p className="text-sm text-muted-foreground">
                        Get notified when someone mentions you
                      </p>
                    </div>
                    <Switch
                      checked={notifications.mentions}
                      onCheckedChange={(checked) => setNotifications({...notifications, mentions: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Sound Effects</h4>
                      <p className="text-sm text-muted-foreground">
                        Play sounds for notifications
                      </p>
                    </div>
                    <Switch
                      checked={notifications.sounds}
                      onCheckedChange={(checked) => setNotifications({...notifications, sounds: checked})}
                    />
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="theme" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <h4 className="font-medium">Appearance</h4>
                  
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 glass">
                    <div className="flex items-center space-x-3">
                      {isDarkMode ? (
                        <Moon className="h-5 w-5 text-primary" />
                      ) : (
                        <Sun className="h-5 w-5 text-primary" />
                      )}
                      <div>
                        <h4 className="font-medium">
                          {isDarkMode ? "Dark Mode" : "Light Mode"}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {isDarkMode ? "Dark theme is active" : "Light theme is active"}
                        </p>
                      </div>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onToggleTheme}
                        className="glass"
                      >
                        Switch to {isDarkMode ? "Light" : "Dark"}
                      </Button>
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border border-border/50 glass text-center">
                      <div className="w-full h-20 rounded bg-gradient-to-br from-primary to-primary/80 mb-3"></div>
                      <p className="text-sm font-medium">Premium Theme</p>
                      <p className="text-xs text-muted-foreground">Currently Active</p>
                    </div>
                    
                    <div className="p-4 rounded-lg border border-border/30 text-center opacity-60">
                      <div className="w-full h-20 rounded bg-gradient-to-br from-muted to-muted/80 mb-3"></div>
                      <p className="text-sm font-medium">More Themes</p>
                      <p className="text-xs text-muted-foreground">Coming Soon</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default Settings;