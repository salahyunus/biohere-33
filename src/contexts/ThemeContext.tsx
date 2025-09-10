import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type ColorTheme = "green" | "blue" | "purple" | "red" | "orange" | "yellow";

interface ThemeContextType {
  theme: Theme;
  colorTheme: ColorTheme;
  setTheme: (theme: Theme) => void;
  setColorTheme: (colorTheme: ColorTheme) => void;
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

  useEffect(() => {
    const savedTheme = localStorage.getItem("biology-app-theme") as Theme;
    const savedColorTheme = localStorage.getItem(
      "biology-app-color-theme"
    ) as ColorTheme;

    if (savedTheme) {
      setTheme(savedTheme);
    }
    if (savedColorTheme) {
      setColorTheme(savedColorTheme);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;

    // Add transition class for smooth theme changes
    root.style.transition = "color 300ms ease, background-color 300ms ease";

    root.classList.remove("light", "dark");
    root.classList.add(theme);

    root.classList.remove(
      "theme-green",
      "theme-blue",
      "theme-purple",
      "theme-red",
      "theme-orange",
      "theme-yellow"
    );
    root.classList.add(`theme-${colorTheme}`);

    localStorage.setItem("biology-app-theme", theme);
    localStorage.setItem("biology-app-color-theme", colorTheme);
  }, [theme, colorTheme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const value = {
    theme,
    colorTheme,
    setTheme,
    setColorTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
