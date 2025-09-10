import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { ColorPicker } from "./ColorPicker";
import { useNotesSettings } from "@/hooks/useNotesSettings";

interface NotesSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const fonts = [
  "Sora",
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
];

export const NotesSettings: React.FC<NotesSettingsProps> = ({
  open,
  onOpenChange,
}) => {
  const { settings, updateSettings } = useNotesSettings();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Notes Settings</DialogTitle>
          <DialogDescription>
            Customize your reading experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Font Family</Label>
            <Select
              value={settings.fontFamily}
              onValueChange={(value) => updateSettings({ fontFamily: value })}
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
            <Label>Font Size: {settings.fontSize}px</Label>
            <Slider
              value={[settings.fontSize]}
              onValueChange={(value) => updateSettings({ fontSize: value[0] })}
              min={12}
              max={24}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <Label>Text Color</Label>
            <ColorPicker
              color={settings.textColor}
              onChange={(color) => updateSettings({ textColor: color })}
            />
          </div>

          <div className="space-y-2">
            <Label>Highlight Color</Label>
            <ColorPicker
              color={settings.highlightColor}
              onChange={(color) => updateSettings({ highlightColor: color })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Text Selection Popover</Label>
            <Switch
              checked={settings.textSelectionPopover}
              onCheckedChange={(checked) =>
                updateSettings({ textSelectionPopover: checked })
              }
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
