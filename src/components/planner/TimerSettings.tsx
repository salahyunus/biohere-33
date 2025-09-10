import React from "react";
import {
  Calendar as CalendarIcon,
  Palette,
  Type,
  Settings,
  Maximize2,
  Timer,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TimerSettings {
  examDate: Date;
  backgroundColor: string;
  fontColor: string;
  fontFamily: string;
  fontSize: number;
  showDays: boolean;
  showHours: boolean;
  showMinutes: boolean;
  showSeconds: boolean;
  showMonths: boolean;
  showProgressBar: boolean;
  timerStyle: "digital" | "sand";
  isFullscreen: boolean;
  showExamTime: boolean;
}

interface TimerSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: TimerSettings;
  updateSettings: (updates: Partial<TimerSettings>) => void;
}

const colorPresets = [
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#10b981" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Pink", value: "#ec4899" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Gray", value: "#6b7280" },
];

const fontOptions = [
  { name: "Sora", value: "Sora, sans-serif" },
  { name: "Inter", value: "Inter, sans-serif" },
  { name: "Roboto", value: "Roboto, sans-serif" },
  { name: "Open Sans", value: "Open Sans, sans-serif" },
  { name: "Montserrat", value: "Montserrat, sans-serif" },
];

export const TimerSettings: React.FC<TimerSettingsProps> = ({
  open,
  onOpenChange,
  settings,
  updateSettings,
}) => {
  const handleDateTimeUpdate = (date: Date | undefined) => {
    if (!date) return;

    let newDate: Date;
    if (settings.showExamTime) {
      // Keep the existing time
      newDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        settings.examDate.getHours(),
        settings.examDate.getMinutes()
      );
    } else {
      // Set time to midnight
      newDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        0,
        0,
        0
      );
    }

    updateSettings({ examDate: newDate });
  };

  const handleTimeUpdate = (hours: number, minutes: number) => {
    const newDate = new Date(
      settings.examDate.getFullYear(),
      settings.examDate.getMonth(),
      settings.examDate.getDate(),
      hours,
      minutes
    );
    updateSettings({ examDate: newDate });
  };

  const handleShowTimeToggle = (checked: boolean) => {
    updateSettings({ showExamTime: checked });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Timer Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Exam Date */}
          <div className="space-y-2">
            <Label>Exam Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !settings.examDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {settings.examDate
                    ? settings.showExamTime
                      ? format(settings.examDate, "PPP 'at' h:mm a")
                      : format(settings.examDate, "PPP")
                    : "Pick exam date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <div className="p-3 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.showExamTime}
                      onCheckedChange={handleShowTimeToggle}
                    />
                    <Label className="text-sm">Show time</Label>
                  </div>
                  <Calendar
                    mode="single"
                    selected={settings.examDate}
                    onSelect={handleDateTimeUpdate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                  {settings.showExamTime && (
                    <div className="border-t pt-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <Input
                          type="time"
                          value={format(settings.examDate, "HH:mm")}
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value
                              .split(":")
                              .map(Number);
                            handleTimeUpdate(hours, minutes);
                          }}
                          className="w-auto text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Timer Style */}
          <div className="space-y-2">
            <Label>Timer Style</Label>
            <Select
              value={settings.timerStyle}
              onValueChange={(value: "digital" | "sand") =>
                updateSettings({ timerStyle: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="digital">
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4" />
                    Digital Timer
                  </div>
                </SelectItem>
                <SelectItem value="sand">
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4" />
                    Sand Timer
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Display Options */}
          <div className="space-y-4">
            <Label>Display Options</Label>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.showProgressBar}
                  onCheckedChange={(checked) =>
                    updateSettings({ showProgressBar: checked })
                  }
                />
                <Label>Show Progress Bar</Label>
              </div>
            </div>
          </div>

          {/* Background Color */}
          <div className="space-y-2">
            <Label>Background Color</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {colorPresets.map((color) => (
                <button
                  key={color.name}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all",
                    settings.backgroundColor === color.value
                      ? "border-foreground scale-110"
                      : "border-border hover:scale-105"
                  )}
                  style={{ backgroundColor: color.value }}
                  onClick={() =>
                    updateSettings({ backgroundColor: color.value })
                  }
                  title={color.name}
                />
              ))}
            </div>
            <Input
              type="color"
              value={settings.backgroundColor}
              onChange={(e) =>
                updateSettings({ backgroundColor: e.target.value })
              }
              className="w-20 h-10"
            />
          </div>

          {/* Font Color */}
          <div className="space-y-2">
            <Label>Font Color</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {["#ffffff", "#000000", "#374151", "#6b7280", "#f3f4f6"].map(
                (color) => (
                  <button
                    key={color}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all",
                      settings.fontColor === color
                        ? "border-foreground scale-110"
                        : "border-border hover:scale-105"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => updateSettings({ fontColor: color })}
                  />
                )
              )}
            </div>
            <Input
              type="color"
              value={settings.fontColor}
              onChange={(e) => updateSettings({ fontColor: e.target.value })}
              className="w-20 h-10"
            />
          </div>

          {/* Font Family */}
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
                {fontOptions.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    <span style={{ fontFamily: font.value }}>{font.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <Label>Font Size: {settings.fontSize}px</Label>
            <Slider
              value={[settings.fontSize]}
              onValueChange={(value) => updateSettings({ fontSize: value[0] })}
              max={120}
              min={24}
              step={4}
              className="w-full"
            />
          </div>

          {/* Time Format */}
          <div className="space-y-4">
            <Label>Time Format</Label>
            <p className="text-sm text-muted-foreground">
              When a unit is disabled, its time will be converted to the next
              smaller unit
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.showMonths}
                  onCheckedChange={(checked) =>
                    updateSettings({ showMonths: checked })
                  }
                />
                <Label>Months</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.showDays}
                  onCheckedChange={(checked) =>
                    updateSettings({ showDays: checked })
                  }
                />
                <Label>Days</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.showHours}
                  onCheckedChange={(checked) =>
                    updateSettings({ showHours: checked })
                  }
                />
                <Label>Hours</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.showMinutes}
                  onCheckedChange={(checked) =>
                    updateSettings({ showMinutes: checked })
                  }
                />
                <Label>Minutes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.showSeconds}
                  onCheckedChange={(checked) =>
                    updateSettings({ showSeconds: checked })
                  }
                />
                <Label>Seconds</Label>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
