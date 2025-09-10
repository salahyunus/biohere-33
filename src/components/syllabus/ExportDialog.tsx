import React, { useState } from "react";
import { FileText, Image, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SyllabusUnit } from "@/hooks/useSyllabusData";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  units: SyllabusUnit[];
  totalProgress: number;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  open,
  onOpenChange,
  units,
  totalProgress,
}) => {
  const [exportType, setExportType] = useState<"pdf" | "image">("pdf");

  const generateExportContent = () => {
    let content = `# Biology Syllabus Checklist\n\n`;
    content += `**Overall Progress: ${Math.round(totalProgress)}%**\n\n`;

    units.forEach((unit) => {
      content += `## ${unit.title}\n`;
      content += `${unit.description}\n\n`;

      unit.topics.forEach((topic) => {
        content += `### ${topic.title}\n`;

        topic.objectives.forEach((objective) => {
          const status = objective.completed ? "✓" : "☐";
          content += `${status} ${objective.text}\n`;

          if (objective.tags.length > 0) {
            content += `   Tags: ${objective.tags.join(", ")}\n`;
          }

          if (objective.comment) {
            content += `   Comment: "${objective.comment}"\n`;
          }
        });

        if (topic.subtopics) {
          topic.subtopics.forEach((subtopic) => {
            content += `\n#### ${subtopic.title}\n`;

            subtopic.objectives.forEach((objective) => {
              const status = objective.completed ? "✓" : "☐";
              content += `${status} ${objective.text}\n`;

              if (objective.tags.length > 0) {
                content += `   Tags: ${objective.tags.join(", ")}\n`;
              }

              if (objective.comment) {
                content += `   Comment: "${objective.comment}"\n`;
              }
            });
          });
        }

        content += "\n";
      });

      content += "\n";
    });

    return content;
  };

  const handleExport = () => {
    const content = generateExportContent();

    if (exportType === "pdf") {
      // Create a simple PDF export using browser print
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Biology Syllabus Checklist</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
                h1 { color: #2563eb; border-bottom: 2px solid #2563eb; }
                h2 { color: #16a34a; margin-top: 30px; }
                h3 { color: #ca8a04; margin-top: 20px; }
                h4 { color: #dc2626; margin-top: 15px; }
                .objective { margin: 5px 0; }
                .completed { text-decoration: line-through; color: #6b7280; }
                .tags { font-style: italic; color: #6b7280; margin-left: 20px; }
                .comment { font-style: italic; color: #374151; margin-left: 20px; }
              </style>
            </head>
            <body>
              ${content
                .replace(/\n/g, "<br>")
                .replace(/^# (.+)$/gm, "<h1>$1</h1>")
                .replace(/^## (.+)$/gm, "<h2>$1</h2>")
                .replace(/^### (.+)$/gm, "<h3>$1</h3>")
                .replace(/^#### (.+)$/gm, "<h4>$1</h4>")}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      }
    } else {
      // For image export, we'll use canvas to create an image
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = 800;
        canvas.height = 1000;

        // White background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add text content
        ctx.fillStyle = "black";
        ctx.font = "16px Arial";
        const lines = content.split("\n");
        let y = 30;

        lines.forEach((line) => {
          if (y > canvas.height - 30) return;
          ctx.fillText(line, 20, y);
          y += 20;
        });

        // Convert to blob and download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "syllabus-checklist.png";
            a.click();
            URL.revokeObjectURL(url);
          }
        });
      }
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Checklist</DialogTitle>
          <DialogDescription>
            Choose how you'd like to export your syllabus checklist.
          </DialogDescription>
        </DialogHeader>

        <RadioGroup
          value={exportType}
          onValueChange={(value) => setExportType(value as "pdf" | "image")}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pdf" id="pdf" />
            <Label
              htmlFor="pdf"
              className="flex items-center gap-2 cursor-pointer"
            >
              <FileText className="h-4 w-4" />
              Export as PDF
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="image" id="image" />
            <Label
              htmlFor="image"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Image className="h-4 w-4" />
              Export as Image
            </Label>
          </div>
        </RadioGroup>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
