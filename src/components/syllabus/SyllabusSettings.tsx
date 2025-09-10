import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SyllabusSettings as SyllabusSettingsType } from "@/hooks/useSyllabusData";

interface SyllabusSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: SyllabusSettingsType;
  onSettingsChange: (settings: SyllabusSettingsType) => void;
}

export const SyllabusSettings: React.FC<SyllabusSettingsProps> = ({
  open,
  onOpenChange,
  settings,
  onSettingsChange,
}) => {
  const handleToggle = (key: keyof SyllabusSettingsType) => {
    onSettingsChange({
      ...settings,
      [key]: !settings[key],
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Syllabus Settings</DialogTitle>
          <DialogDescription>
            Customize how your syllabus checklist appears and behaves.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">
                Strike Through Completed
              </Label>
              <p className="text-xs text-muted-foreground">
                Add strikethrough and grey out completed objectives
              </p>
            </div>
            <Switch
              checked={settings.strikethrough}
              onCheckedChange={() => handleToggle("strikethrough")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Expand All Topics</Label>
              <p className="text-xs text-muted-foreground">
                Keep all topics expanded and disable collapsing
              </p>
            </div>
            <Switch
              checked={settings.expandAll}
              onCheckedChange={() => handleToggle("expandAll")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Collapse All Topics</Label>
              <p className="text-xs text-muted-foreground">
                Collapse all topics when this setting is toggled
              </p>
            </div>
            <Switch
              checked={settings.collapseAll}
              onCheckedChange={() => handleToggle("collapseAll")}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
