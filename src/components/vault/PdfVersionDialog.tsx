import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Download, Eye } from "lucide-react";

interface PdfNote {
  id: string;
  title: string;
  description: string;
  topic: string;
  pages: number;
  image: string;
  darkVersion: string;
  lightVersion: string;
}

interface PdfVersionDialogProps {
  pdf: PdfNote | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVersionSelect: (pdf: PdfNote, version: "light" | "dark") => void;
  action: "preview" | "download";
}

export const PdfVersionDialog: React.FC<PdfVersionDialogProps> = ({
  pdf,
  open,
  onOpenChange,
  onVersionSelect,
  action,
}) => {
  if (!pdf) return null;

  const handleVersionSelect = (version: "light" | "dark") => {
    onVersionSelect(pdf, version);
  };

  const ActionIcon = action === "preview" ? Eye : Download;
  const actionText = action === "preview" ? "Preview" : "Download";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Version</DialogTitle>
          <DialogDescription>
            Select which version of "{pdf.title}" you'd like to {action}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-accent"
              onClick={() => handleVersionSelect("light")}
            >
              <Sun className="h-8 w-8 text-yellow-500" />
              <div className="text-center">
                <div className="font-medium">Light Mode</div>
                <div className="text-xs text-muted-foreground">
                  White background
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-accent"
              onClick={() => handleVersionSelect("dark")}
            >
              <Moon className="h-8 w-8 text-blue-500" />
              <div className="text-center">
                <div className="font-medium">Dark Mode</div>
                <div className="text-xs text-muted-foreground">
                  Dark background
                </div>
              </div>
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Choose the version that works best for your reading preferences
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
