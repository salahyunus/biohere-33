import React from "react";
import { Moon, Sun, Palette } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const colorThemes = [
  { name: "green", color: "#16a34a", label: "Green" },
  { name: "blue", color: "#2563eb", label: "Blue" },
  { name: "purple", color: "#9333ea", label: "Purple" },
  { name: "red", color: "#dc2626", label: "Red" },
  { name: "orange", color: "#ea580c", label: "Orange" },
  { name: "yellow", color: "#ca8a04", label: "Yellow" },
];

export const ThemeSelector: React.FC = () => {
  const { theme, colorTheme, toggleTheme, setColorTheme } = useTheme();

  const currentColor =
    colorThemes.find((c) => c.name === colorTheme)?.color || "#16a34a";

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="h-10 w-10 transition-all duration-300 hover:scale-105"
      >
        <div className="relative">
          {theme === "light" ? (
            <Moon className="h-5 w-5 transition-transform duration-300 rotate-0" />
          ) : (
            <Sun className="h-5 w-5 transition-transform duration-300 rotate-0" />
          )}
        </div>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 relative transition-all duration-300 hover:scale-105"
          >
            <Palette className="h-5 w-5" />
            <div
              className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background transition-colors duration-300"
              style={{ backgroundColor: currentColor }}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Color Theme</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="grid grid-cols-3 gap-2 p-2">
            {colorThemes.map((color) => (
              <button
                key={color.name}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                  colorTheme === color.name
                    ? "border-foreground shadow-lg"
                    : "border-muted-foreground/20"
                }`}
                style={{ backgroundColor: color.color }}
                onClick={() => setColorTheme(color.name as any)}
                title={color.label}
              />
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
