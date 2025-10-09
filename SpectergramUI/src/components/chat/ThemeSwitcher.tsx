import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Palette, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTheme, themes } from "@/contexts/ThemeContext";
import { useState } from "react";

const accentColors = [
  { name: "Cyan", value: "180 100% 50%" },
  { name: "Violet", value: "280 85% 60%" },
  { name: "Magenta", value: "320 80% 58%" },
  { name: "Lime", value: "80 70% 50%" },
  { name: "Pink", value: "340 80% 60%" },
  { name: "Blue", value: "220 90% 56%" }
];

export function ThemeSwitcher() {
  const { currentTheme, isDark, setTheme, toggleDarkMode, setAccentColor } = useTheme();
  const [currentAccent, setCurrentAccent] = useState(accentColors[0].value);

  const handleThemeChange = (themeId: string) => {
    setTheme(themeId);
  };

  const handleAccentChange = (accentValue: string) => {
    setAccentColor(accentValue);
    setCurrentAccent(accentValue);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative group"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 180 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Palette className="h-5 w-5" />
          </motion.div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 bg-card/95 backdrop-blur-xl border-border/50" align="end">
        <div className="space-y-4">
          {/* Header */}
          <div>
            <h3 className="font-semibold mb-1">Theme Settings</h3>
            <p className="text-xs text-muted-foreground">Customize your Spectergram experience</p>
          </div>

          {/* Dark/Light toggle */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <span className="text-sm font-medium">Dark Mode</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="gap-2"
            >
              <motion.div
                animate={{ rotate: isDark ? 0 : 180 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </motion.div>
              <span className="text-xs">{isDark ? "Dark" : "Light"}</span>
            </Button>
          </div>

          {/* Theme selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Theme Style</label>
            <div className="grid gap-2">
              {themes.map((theme) => (
                <motion.button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    currentTheme.id === theme.id
                      ? "border-primary bg-primary/10"
                      : "border-border/50 hover:border-border hover:bg-muted/50"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{theme.name}</p>
                      <p className="text-xs text-muted-foreground">{theme.description}</p>
                    </div>
                    <AnimatePresence>
                      {currentTheme.id === theme.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Check className="h-4 w-4 text-primary" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Accent color picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Accent Color</label>
            <div className="flex gap-2 flex-wrap">
              {accentColors.map((color) => (
                <motion.button
                  key={color.name}
                  onClick={() => handleAccentChange(color.value)}
                  className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                    currentAccent === color.value ? "border-foreground scale-110" : "border-transparent"
                  }`}
                  style={{
                    background: `hsl(${color.value})`
                  }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  title={color.name}
                >
                  <AnimatePresence>
                    {currentAccent === color.value && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Check className="h-4 w-4 text-white drop-shadow-lg" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
