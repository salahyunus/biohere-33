import React, { useState } from "react";
import { Moon, Sun, Palette, ChevronDown, Skull, Zap, PenTool } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

const colorThemes = [
  { name: "green", color: "#16a34a", label: "Green" },
  { name: "blue", color: "#2563eb", label: "Blue" },
  { name: "purple", color: "#9333ea", label: "Purple" },
  { name: "red", color: "#dc2626", label: "Red" },
  { name: "orange", color: "#ea580c", label: "Orange" },
  { name: "yellow", color: "#ca8a04", label: "Yellow" },
];

const specialThemes = [
  { 
    name: "hacker", 
    label: "Hacker", 
    icon: "🔰", 
    description: "Matrix-style green on black",
    font: "mono-hacker"
  },
  { 
    name: "pirate-light", 
    label: "Pirate Light", 
    icon: "🏴‍☠️", 
    description: "Ahoy! Light pirate theme",
    font: "pirate"
  },
  { 
    name: "pirate-dark", 
    label: "Pirate Dark", 
    icon: "☠️", 
    description: "Dark seas adventure",
    font: "pirate"
  },
  { 
    name: "duck-light", 
    label: "Duck Light", 
    icon: "🦆", 
    description: "Quack! Sunny duck pond",
    font: "duck"
  },
  { 
    name: "duck-dark", 
    label: "Duck Dark", 
    icon: "🌙🦆", 
    description: "Night time at the pond",
    font: "duck"
  },
  { 
    name: "handwritten-light", 
    label: "Handwritten Light", 
    icon: "✍️", 
    description: "Like writing on paper",
    font: "handwritten"
  },
  { 
    name: "handwritten-dark", 
    label: "Handwritten Dark", 
    icon: "🖋️", 
    description: "Dark paper vibes",
    font: "handwritten"
  },
];

export const ThemeSelector: React.FC = () => {
  const { theme, colorTheme, specialTheme, toggleTheme, setColorTheme, setSpecialTheme } = useTheme();
  const [showSpecialThemes, setShowSpecialThemes] = useState(false);

  const currentColor =
    colorThemes.find((c) => c.name === colorTheme)?.color || "#16a34a";

  const handleSpecialThemeSelect = (themeName: string) => {
    if (themeName === "none") {
      setSpecialTheme("none");
    } else {
      setSpecialTheme(themeName as any);
    }
  };

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
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Color Theme</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="grid grid-cols-3 gap-2 p-2">
            {colorThemes.map((color) => (
              <button
                key={color.name}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                  colorTheme === color.name && specialTheme === "none"
                    ? "border-foreground shadow-lg"
                    : "border-muted-foreground/20"
                }`}
                style={{ backgroundColor: color.color }}
                onClick={() => {
                  setColorTheme(color.name as any);
                  setSpecialTheme("none");
                }}
                title={color.label}
              />
            ))}
          </div>
          
          <DropdownMenuSeparator />
          
          <Collapsible open={showSpecialThemes} onOpenChange={setShowSpecialThemes}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between h-auto p-2 font-normal"
              >
                <span className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Special Themes
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showSpecialThemes ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-1 p-1">
                <button
                  onClick={() => handleSpecialThemeSelect("none")}
                  className={`w-full text-left p-2 rounded text-sm hover:bg-muted transition-colors ${
                    specialTheme === "none" ? "bg-muted" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>🎨</span>
                    <span>Default Theme</span>
                  </div>
                </button>
                {specialThemes.map((theme) => (
                  <button
                    key={theme.name}
                    onClick={() => handleSpecialThemeSelect(theme.name)}
                    className={`w-full text-left p-2 rounded text-sm hover:bg-muted transition-colors ${
                      specialTheme === theme.name ? "bg-muted" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span>{theme.icon}</span>
                      <span className="font-medium">{theme.label}</span>
                    </div>
                    <div className="text-xs text-muted-foreground ml-6">
                      {theme.description}
                    </div>
                  </button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
