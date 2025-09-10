import React from "react";
import { Button } from "@/components/ui/button";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const presetColors = [
  "#fef08a", // yellow
  "#bfdbfe", // blue
  "#bbf7d0", // green
  "#fecaca", // red
  "#e9d5ff", // purple
  "#fed7aa", // orange
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onChange,
}) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {presetColors.map((presetColor) => (
        <Button
          key={presetColor}
          variant="outline"
          size="sm"
          className="w-8 h-8 p-0 border-2"
          style={{
            backgroundColor: presetColor,
            borderColor: color === presetColor ? "#000" : "transparent",
          }}
          onClick={() => onChange(presetColor)}
        />
      ))}
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 border rounded cursor-pointer"
      />
    </div>
  );
};
