import { motion } from "framer-motion";
import { Palette } from "lucide-react";

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const themeColors = [
  { name: "Purple", hsl: "234 89% 74%", hex: "#a855f7" },
  { name: "Cyan", hsl: "194 98% 71%", hex: "#67e8f9" },
  { name: "Pink", hsl: "330 81% 60%", hex: "#ec4899" },
  { name: "Green", hsl: "142 76% 73%", hex: "#4ade80" },
  { name: "Orange", hsl: "25 95% 53%", hex: "#fb923c" },
  { name: "Blue", hsl: "217 91% 60%", hex: "#3b82f6" },
];

export function ColorPicker({ selectedColor, onColorChange }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-3">
      <Palette className="h-4 w-4 text-muted-foreground" />
      <div className="flex gap-2">
        {themeColors.map((color) => (
          <motion.button
            key={color.name}
            type="button"
            onClick={() => onColorChange(color.hsl)}
            className={`h-6 w-6 rounded-full border-2 transition-all ${
              selectedColor === color.hsl
                ? "border-white scale-110"
                : "border-transparent opacity-70 hover:opacity-100 hover:scale-110"
            }`}
            style={{ backgroundColor: color.hex }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Select ${color.name} theme`}
          />
        ))}
      </div>
    </div>
  );
}
