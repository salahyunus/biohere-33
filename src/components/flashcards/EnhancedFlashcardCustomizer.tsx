import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { FlashcardSettings } from "@/pages/Flashcards";
import { Palette, Type, Settings2 } from "lucide-react";

interface EnhancedFlashcardCustomizerProps {
  settings: FlashcardSettings;
  onSettingsChange: (settings: FlashcardSettings) => void;
}

const backgroundColors = [
  { name: "Default", value: "hsl(var(--card))", preview: "#ffffff" },
  { name: "Light Blue", value: "#e6f3ff", preview: "#e6f3ff" },
  { name: "Light Green", value: "#e8f5e8", preview: "#e8f5e8" },
  { name: "Light Yellow", value: "#fff9e6", preview: "#fff9e6" },
  { name: "Light Pink", value: "#ffe6f0", preview: "#ffe6f0" },
  { name: "Light Purple", value: "#f0e6ff", preview: "#f0e6ff" },
  { name: "Light Red", value: "#ffe6e6", preview: "#ffe6e6" },
  { name: "Light Orange", value: "#fff0e6", preview: "#fff0e6" },
  { name: "Light Cyan", value: "#e6ffff", preview: "#e6ffff" },
  { name: "Warm Beige", value: "#f5f1e8", preview: "#f5f1e8" },
];

const fontColors = [
  { name: "Default", value: "hsl(var(--foreground))", preview: "#000000" },
  { name: "Black", value: "#000000", preview: "#000000" },
  { name: "Dark Gray", value: "#374151", preview: "#374151" },
  { name: "Blue", value: "#1e40af", preview: "#1e40af" },
  { name: "Green", value: "#166534", preview: "#166534" },
  { name: "Purple", value: "#7c3aed", preview: "#7c3aed" },
  { name: "Red", value: "#dc2626", preview: "#dc2626" },
  { name: "Orange", value: "#ea580c", preview: "#ea580c" },
];

const fonts = [
  "Sora",
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Source Sans Pro",
  "Nunito",
];

export const EnhancedFlashcardCustomizer: React.FC<
  EnhancedFlashcardCustomizerProps
> = ({ settings, onSettingsChange }) => {
  const updateSetting = <K extends keyof FlashcardSettings>(
    key: K,
    value: FlashcardSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const resetToDefaults = () => {
    onSettingsChange({
      backgroundColor: "hsl(var(--card))",
      fontFamily: "Sora",
      fontColor: "hsl(var(--foreground))",
      fontSize: 16,
      cardSize: "medium",
      reverseMode: false,
      shuffleCards: false,
      showImages: true,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Customize Flashcards
          </CardTitle>
          <Button variant="outline" size="sm" onClick={resetToDefaults}>
            Reset to Defaults
          </Button>
        </div>
      </CardHeader>
      <CardContent className="animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Appearance */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-medium">
              <Palette className="h-4 w-4" />
              Appearance
            </div>

            <div className="space-y-2">
              <Label>Background Color</Label>
              <Select
                value={settings.backgroundColor}
                onValueChange={(value) =>
                  updateSetting("backgroundColor", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {backgroundColors.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: color.preview }}
                        />
                        {color.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Card Size</Label>
              <Select
                value={settings.cardSize}
                onValueChange={(value: "small" | "medium" | "large") =>
                  updateSetting("cardSize", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-medium">
              <Type className="h-4 w-4" />
              Typography
            </div>

            <div className="space-y-2">
              <Label>Font Family</Label>
              <Select
                value={settings.fontFamily}
                onValueChange={(value) => updateSetting("fontFamily", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fonts.map((font) => (
                    <SelectItem key={font} value={font}>
                      <span style={{ fontFamily: font }}>{font}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Font Color</Label>
              <Select
                value={settings.fontColor}
                onValueChange={(value) => updateSetting("fontColor", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontColors.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: color.preview }}
                        />
                        {color.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Font Size: {settings.fontSize}px</Label>
              <Slider
                value={[settings.fontSize]}
                onValueChange={(value) => updateSetting("fontSize", value[0])}
                min={12}
                max={28}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Behavior */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-medium">
              <Settings2 className="h-4 w-4" />
              Behavior
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="reverse-mode">Reverse Mode</Label>
              <Switch
                id="reverse-mode"
                checked={settings.reverseMode}
                onCheckedChange={(checked) =>
                  updateSetting("reverseMode", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="shuffle-cards">Shuffle Cards</Label>
              <Switch
                id="shuffle-cards"
                checked={settings.shuffleCards}
                onCheckedChange={(checked) =>
                  updateSetting("shuffleCards", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="show-images">Show Images</Label>
              <Switch
                id="show-images"
                checked={settings.showImages}
                onCheckedChange={(checked) =>
                  updateSetting("showImages", checked)
                }
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="mt-6 p-4 border rounded-lg">
          <Label className="text-sm font-medium mb-2 block">Preview</Label>
          <div
            className="p-4 rounded border text-center"
            style={{
              backgroundColor: settings.backgroundColor,
              fontFamily: settings.fontFamily,
              color: settings.fontColor,
              fontSize: `${settings.fontSize}px`,
            }}
          >
            Sample flashcard text with your current settings
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
