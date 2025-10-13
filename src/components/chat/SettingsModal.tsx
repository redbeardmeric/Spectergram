import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Settings, Bell, Lock, Palette, User, Shield } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const settingsSections = [
    {
      icon: User,
      title: "Profile",
      items: [
        { label: "Display Name", value: "Username" },
        { label: "Bio", value: "Hey there! Using Spectergram" },
      ]
    },
    {
      icon: Bell,
      title: "Notifications",
      items: [
        { label: "Message Notifications", toggle: true, enabled: true },
        { label: "Sound", toggle: true, enabled: true },
        { label: "Vibrate", toggle: true, enabled: false },
      ]
    },
    {
      icon: Lock,
      title: "Privacy & Security",
      items: [
        { label: "End-to-End Encryption", toggle: true, enabled: true, locked: true },
        { label: "Read Receipts", toggle: true, enabled: true },
        { label: "Typing Indicators", toggle: true, enabled: true },
        { label: "Secret Chat Mode", toggle: true, enabled: false },
      ]
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden bg-card/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Settings className="h-5 w-5 text-primary" />
            Settings
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto pr-2 space-y-6">
          {settingsSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <section.icon className="h-4 w-4" />
                {section.title}
              </div>

              <div className="space-y-3">
                {section.items.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{item.label}</span>
                      {item.locked && (
                        <motion.div
                          animate={{
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity
                          }}
                        >
                          <Shield className="h-3 w-3 text-green-500" />
                        </motion.div>
                      )}
                    </div>

                    {item.toggle ? (
                      <Switch checked={item.enabled} disabled={item.locked} />
                    ) : (
                      <span className="text-sm text-muted-foreground">{item.value}</span>
                    )}
                  </div>
                ))}
              </div>

              {index < settingsSections.length - 1 && (
                <Separator className="my-4" />
              )}
            </motion.div>
          ))}

          {/* App info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center py-6 space-y-2"
          >
            <p className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Spectergram
            </p>
            <p className="text-xs text-muted-foreground">
              Privacy. Precision. Peace of Mind.
            </p>
            <p className="text-xs text-muted-foreground/60">
              Version 1.0.0 • Built with ❤️
            </p>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
