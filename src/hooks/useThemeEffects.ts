import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";

// Pirate language dictionary
const pirateTranslations: Record<string, string> = {
  "hello": "ahoy",
  "hi": "ahoy",
  "yes": "aye",
  "no": "nay", 
  "friend": "matey",
  "friends": "mateys",
  "money": "doubloons",
  "steal": "plunder",
  "bathroom": "head",
  "left": "port",
  "right": "starboard",
  "stop": "avast",
  "quickly": "smartly",
  "jail": "brig",
  "flag": "colors",
  "song": "shanty",
  "storm": "squall",
  "telescope": "spyglass"
};

export const useThemeEffects = () => {
  const { specialTheme } = useTheme();
  
  // Typewriter effect for hacker theme
  const [typewriterText, setTypewriterText] = useState("");
  
  const applyTypewriterEffect = (text: string, delay: number = 50) => {
    if (specialTheme !== "hacker") return text;
    
    let i = 0;
    const timer = setInterval(() => {
      setTypewriterText(text.slice(0, i));
      i++;
      if (i > text.length) {
        clearInterval(timer);
      }
    }, delay);
    
    return () => clearInterval(timer);
  };

  // Pirate language translator
  const toPirateSpeak = (text: string): string => {
    if (!specialTheme.includes("pirate")) return text;
    
    let pirateText = text.toLowerCase();
    
    Object.entries(pirateTranslations).forEach(([english, pirate]) => {
      const regex = new RegExp(`\\b${english}\\b`, 'gi');
      pirateText = pirateText.replace(regex, pirate);
    });
    
    // Add some pirate flair
    pirateText = pirateText
      .replace(/\./g, ', ye scurvy dog!')
      .replace(/!/g, ', arrr!')
      .replace(/\?/g, ', savvy?');
    
    return pirateText;
  };

  // Get theme-specific CSS classes
  const getThemeClasses = () => {
    const classes = [];
    
    if (specialTheme === "hacker") {
      classes.push("font-mono-hacker", "typewriter-cursor");
    } else if (specialTheme.includes("pirate")) {
      classes.push("font-pirate", "pirate-text");
    } else if (specialTheme.includes("duck")) {
      classes.push("font-duck", "duck-hover");
    } else if (specialTheme.includes("handwritten")) {
      classes.push("font-handwritten", "sketch-border");
    }
    
    return classes.join(" ");
  };

  // Apply font family based on theme
  useEffect(() => {
    const body = document.body;
    
    // Remove all theme font classes
    body.classList.remove(
      "font-pirate", 
      "font-duck", 
      "font-handwritten", 
      "font-mono-hacker"
    );
    
    // Add appropriate font class
    if (specialTheme === "hacker") {
      body.classList.add("font-mono-hacker");
    } else if (specialTheme.includes("pirate")) {
      body.classList.add("font-pirate");
    } else if (specialTheme.includes("duck")) {
      body.classList.add("font-duck");
    } else if (specialTheme.includes("handwritten")) {
      body.classList.add("font-handwritten");
    }
  }, [specialTheme]);

  return {
    specialTheme,
    typewriterText,
    applyTypewriterEffect,
    toPirateSpeak,
    getThemeClasses,
    isPirateTheme: specialTheme.includes("pirate"),
    isHackerTheme: specialTheme === "hacker",
    isDuckTheme: specialTheme.includes("duck"),
    isHandwrittenTheme: specialTheme.includes("handwritten"),
  };
};