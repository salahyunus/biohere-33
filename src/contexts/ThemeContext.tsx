import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type ColorTheme = "green" | "blue" | "purple" | "red" | "orange" | "yellow";
type SpecialTheme = "hacker" | "pirate-light" | "pirate-dark" | "duck-light" | "duck-dark" | "handwritten-light" | "handwritten-dark" | "none";

interface ThemeContextType {
  theme: Theme;
  colorTheme: ColorTheme;
  specialTheme: SpecialTheme;
  setTheme: (theme: Theme) => void;
  setColorTheme: (colorTheme: ColorTheme) => void;
  setSpecialTheme: (specialTheme: SpecialTheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("light");
  const [colorTheme, setColorTheme] = useState<ColorTheme>("green");
  const [specialTheme, setSpecialTheme] = useState<SpecialTheme>("none");

  useEffect(() => {
    const savedTheme = localStorage.getItem("biology-app-theme") as Theme;
    const savedColorTheme = localStorage.getItem(
      "biology-app-color-theme"
    ) as ColorTheme;
    const savedSpecialTheme = localStorage.getItem(
      "biology-app-special-theme"
    ) as SpecialTheme;

    if (savedTheme) {
      setTheme(savedTheme);
    }
    if (savedColorTheme) {
      setColorTheme(savedColorTheme);
    }
    if (savedSpecialTheme) {
      setSpecialTheme(savedSpecialTheme);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;

    // Add transition class for smooth theme changes
    root.style.transition = "color 300ms ease, background-color 300ms ease";

    root.classList.remove("light", "dark");
    if (specialTheme === "none") {
      root.classList.add(theme);
    }

    root.classList.remove(
      "theme-green",
      "theme-blue",
      "theme-purple",
      "theme-red",
      "theme-orange",
      "theme-yellow",
      "theme-hacker",
      "theme-pirate-light",
      "theme-pirate-dark",
      "theme-duck-light",
      "theme-duck-dark",
      "theme-handwritten-light",
      "theme-handwritten-dark"
    );
    
    if (specialTheme !== "none") {
      root.classList.add(`theme-${specialTheme}`);
    } else {
      root.classList.add(`theme-${colorTheme}`);
    }

    localStorage.setItem("biology-app-theme", theme);
    localStorage.setItem("biology-app-color-theme", colorTheme);
    localStorage.setItem("biology-app-special-theme", specialTheme);
  }, [theme, colorTheme, specialTheme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const value = {
    theme,
    colorTheme,
    specialTheme,
    setTheme,
    setColorTheme,
    setSpecialTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
