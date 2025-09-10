import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Download, FileText, Image } from "lucide-react";
import { NotesLesson } from "@/hooks/useNotesData";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentLesson: NotesLesson | null;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  open,
  onOpenChange,
  currentLesson,
}) => {
  const [exportFormat, setExportFormat] = useState<"pdf" | "image">("pdf");
  const [exportAll, setExportAll] = useState(false);

  const handleExport = () => {
    console.log("Exporting:", {
      format: exportFormat,
      all: exportAll,
      lesson: currentLesson?.title,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Notes</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Export Format</Label>
            <RadioGroup
              value={exportFormat}
              onValueChange={(value: any) => setExportFormat(value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  PDF Document
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="image" id="image" />
                <Label htmlFor="image" className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  PNG Image
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Export Options</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="export-all"
                checked={exportAll}
                onCheckedChange={(checked) => setExportAll(checked as boolean)}
              />
              <Label htmlFor="export-all">
                Export all lessons in this unit
              </Label>
            </div>
          </div>

          {currentLesson && !exportAll && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm">
                <strong>Current lesson:</strong> {currentLesson.title}
              </p>
            </div>
          )}

          <Button onClick={handleExport} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Export {exportAll ? "All Lessons" : "Current Lesson"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
