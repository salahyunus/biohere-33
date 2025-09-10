import React from "react";
import {
  Settings,
  Monitor,
  Maximize,
  Eye,
  EyeOff,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MCQSettingsProps {
  settings: {
    fullWidth: boolean;
    compactMode: boolean;
    compactCircles: boolean;
    showTimer: boolean;
    timerPosition: "top-right" | "bottom-right" | "floating";
    optionLayout: "horizontal" | "vertical";
    showScrollButton: boolean;
  };
  onSettingsChange: (settings: any) => void;
}

export const MCQSettings: React.FC<MCQSettingsProps> = ({
  settings,
  onSettingsChange,
}) => {
  const updateSetting = (key: string, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>MCQ Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="full-width">Full Width Layout</Label>
              <Switch
                id="full-width"
                checked={settings.fullWidth}
                onCheckedChange={(checked) =>
                  updateSetting("fullWidth", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="compact-mode">Compact Mode</Label>
              <Switch
                id="compact-mode"
                checked={settings.compactMode}
                onCheckedChange={(checked) =>
                  updateSetting("compactMode", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="compact-circles">Compact Circles</Label>
              <Switch
                id="compact-circles"
                checked={settings.compactCircles}
                onCheckedChange={(checked) =>
                  updateSetting("compactCircles", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="show-timer">Show Timer</Label>
              <Switch
                id="show-timer"
                checked={settings.showTimer}
                onCheckedChange={(checked) =>
                  updateSetting("showTimer", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="show-scroll-button">Show Scroll Button</Label>
              <Switch
                id="show-scroll-button"
                checked={settings.showScrollButton}
                onCheckedChange={(checked) =>
                  updateSetting("showScrollButton", checked)
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Timer Position</Label>
              <Select
                value={settings.timerPosition}
                onValueChange={(value) => updateSetting("timerPosition", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top-right">Top Right</SelectItem>
                  <SelectItem value="bottom-right">Bottom Right</SelectItem>
                  <SelectItem value="floating">Floating</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Option Layout</Label>
              <Select
                value={settings.optionLayout}
                onValueChange={(value) => updateSetting("optionLayout", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="horizontal">Horizontal</SelectItem>
                  <SelectItem value="vertical">Vertical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
