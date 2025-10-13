import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    border: string;
    input: string;
    ring: string;
  };
}

const themes: Theme[] = [
  {
    id: "quantum-dark",
    name: "Quantum Dark",
    description: "Deep navy with glowing accents",
    colors: {
      background: "220 20% 8%",
      foreground: "210 40% 98%",
      card: "220 18% 10%",
      cardForeground: "210 40% 98%",
      popover: "220 20% 12%",
      popoverForeground: "210 40% 98%",
      primary: "220 90% 56%",
      primaryForeground: "0 0% 100%",
      secondary: "220 15% 15%",
      secondaryForeground: "210 40% 98%",
      muted: "220 15% 18%",
      mutedForeground: "215 20% 65%",
      accent: "280 80% 60%",
      accentForeground: "0 0% 100%",
      border: "220 15% 25%",
      input: "220 15% 18%",
      ring: "220 90% 56%",
    }
  },
  {
    id: "frost-light",
    name: "Frost Light",
    description: "Frosted glass minimal look",
    colors: {
      background: "210 20% 98%",
      foreground: "220 15% 15%",
      card: "0 0% 100%",
      cardForeground: "220 15% 15%",
      popover: "0 0% 100%",
      popoverForeground: "220 15% 15%",
      primary: "200 80% 50%",
      primaryForeground: "0 0% 100%",
      secondary: "210 15% 95%",
      secondaryForeground: "220 15% 15%",
      muted: "210 15% 95%",
      mutedForeground: "220 10% 45%",
      accent: "180 70% 55%",
      accentForeground: "0 0% 100%",
      border: "210 15% 88%",
      input: "210 15% 90%",
      ring: "200 80% 50%",
    }
  },
  {
    id: "aurora-pulse",
    name: "Aurora Pulse",
    description: "Dynamic gradient glow",
    colors: {
      background: "260 20% 10%",
      foreground: "280 40% 98%",
      card: "260 18% 12%",
      cardForeground: "280 40% 98%",
      popover: "260 20% 14%",
      popoverForeground: "280 40% 98%",
      primary: "280 85% 60%",
      primaryForeground: "0 0% 100%",
      secondary: "260 15% 18%",
      secondaryForeground: "280 40% 98%",
      muted: "260 15% 20%",
      mutedForeground: "270 20% 65%",
      accent: "320 80% 58%",
      accentForeground: "0 0% 100%",
      border: "260 15% 28%",
      input: "260 15% 20%",
      ring: "280 85% 60%",
    }
  },
  {
    id: "cyber-cyan",
    name: "Cyber Cyan",
    description: "Neon cyan future",
    colors: {
      background: "200 30% 5%",
      foreground: "180 40% 98%",
      card: "200 28% 7%",
      cardForeground: "180 40% 98%",
      popover: "200 30% 9%",
      popoverForeground: "180 40% 98%",
      primary: "180 100% 50%",
      primaryForeground: "200 30% 5%",
      secondary: "200 15% 12%",
      secondaryForeground: "180 40% 98%",
      muted: "200 15% 15%",
      mutedForeground: "190 20% 65%",
      accent: "280 90% 60%",
      accentForeground: "0 0% 100%",
      border: "200 15% 22%",
      input: "200 15% 15%",
      ring: "180 100% 50%",
    }
  }
];

interface ThemeContextType {
  currentTheme: Theme;
  isDark: boolean;
  setTheme: (themeId: string) => void;
  toggleDarkMode: () => void;
  setAccentColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentThemeId, setCurrentThemeId] = useState("quantum-dark");
  const [isDark, setIsDark] = useState(true);

  const currentTheme = themes.find(t => t.id === currentThemeId) || themes[0];

  useEffect(() => {
    const root = document.documentElement;
    
    // Apply theme colors
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      root.style.setProperty(`--${cssVar}`, value);
    });

    // Apply dark mode class
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [currentTheme, isDark]);

  const setTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setCurrentThemeId(themeId);
      // Auto-set dark mode based on theme
      setIsDark(themeId !== "frost-light");
    }
  };

  const toggleDarkMode = () => {
    setIsDark(prev => !prev);
  };

  const setAccentColor = (color: string) => {
    document.documentElement.style.setProperty('--accent', color);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, isDark, setTheme, toggleDarkMode, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

export { themes };
