import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileImage, FileText } from "lucide-react";
import { Flashcard } from "@/data/flashcards";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface EnhancedExportDialogProps {
  children: React.ReactNode;
  flashcards: Flashcard[];
  title: string;
}

export const EnhancedExportDialog: React.FC<EnhancedExportDialogProps> = ({
  children,
  flashcards,
  title,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [exportType, setExportType] = useState<
    "both" | "questions" | "answers"
  >("both");
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeImages, setIncludeImages] = useState(true);
  const [format, setFormat] = useState<"pdf" | "image">("pdf");

  const generateContent = () => {
    let content = "";

    flashcards.forEach((card, index) => {
      content += `\n${index + 1}. `;

      if (exportType === "both" || exportType === "questions") {
        content += `Q: ${card.question}\n`;
      }

      if (exportType === "both" || exportType === "answers") {
        content += `A: ${card.answer}\n`;
      }

      if (includeMetadata) {
        content += `Topic: ${card.topic}`;
        if (card.subtopic) content += ` - ${card.subtopic}`;
        content += ` | Difficulty: ${card.difficulty}`;
        if (card.tags.length > 0) content += ` | Tags: ${card.tags.join(", ")}`;
        content += "\n";
      }

      content += "\n";
    });

    return content;
  };

  const exportAsPDF = async () => {
    if (!contentRef.current) return;

    try {
      const canvas = await html2canvas(contentRef.current, {
        backgroundColor: "#ffffff",
        scale: 1,
        height: contentRef.current.scrollHeight,
        width: contentRef.current.scrollWidth,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth - 20; // 10mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 10; // 10mm top margin

      // First page
      if (imgHeight <= pageHeight - 20) {
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      } else {
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, pageHeight - 20);
        heightLeft -= pageHeight - 20;

        // Additional pages
        while (heightLeft > 0) {
          pdf.addPage();
          position = -(imgHeight - heightLeft) + 10;
          pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight - 20;
        }
      }

      pdf.save(`${title.toLowerCase().replace(/\s+/g, "-")}-flashcards.pdf`);
    } catch (error) {
      console.error("Failed to export as PDF:", error);
    }
  };

  const exportAsImage = async () => {
    if (!contentRef.current) return;

    try {
      const canvas = await html2canvas(contentRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        height: contentRef.current.scrollHeight,
        width: contentRef.current.scrollWidth,
      });

      const link = document.createElement("a");
      link.download = `${title
        .toLowerCase()
        .replace(/\s+/g, "-")}-flashcards.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error("Failed to export as image:", error);
    }
  };

  const handleExport = () => {
    if (format === "pdf") {
      exportAsPDF();
    } else {
      exportAsImage();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Export Flashcards - {title}</DialogTitle>
          <DialogDescription>
            Choose your export options and format
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Content to Export</Label>
              <RadioGroup
                value={exportType}
                onValueChange={(value: "both" | "questions" | "answers") =>
                  setExportType(value)
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="both" />
                  <Label htmlFor="both">Questions and Answers</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="questions" id="questions" />
                  <Label htmlFor="questions">Questions Only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="answers" id="answers" />
                  <Label htmlFor="answers">Answers Only</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">
                Additional Options
              </Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="metadata"
                  checked={includeMetadata}
                  onCheckedChange={(checked) =>
                    setIncludeMetadata(checked as boolean)
                  }
                />
                <Label htmlFor="metadata">
                  Include metadata (topic, difficulty, tags)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="images"
                  checked={includeImages}
                  onCheckedChange={(checked) =>
                    setIncludeImages(checked as boolean)
                  }
                />
                <Label htmlFor="images">Include images (if any)</Label>
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Export Format</Label>
              <RadioGroup
                value={format}
                onValueChange={(value: "pdf" | "image") => setFormat(value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pdf" id="pdf" />
                  <Label htmlFor="pdf">PDF Document</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="image" id="image" />
                  <Label htmlFor="image">Image (PNG)</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-muted/30 max-h-96 overflow-y-auto">
            <div
              ref={contentRef}
              className="space-y-4 bg-white p-4 rounded text-black"
            >
              <div className="border-b pb-2">
                <h2 className="text-xl font-bold">{title}</h2>
                <p className="text-sm text-gray-600">
                  Generated on: {new Date().toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  Total flashcards: {flashcards.length}
                </p>
              </div>

              <div className="space-y-3 text-sm">
                {flashcards.slice(0, 3).map((card, index) => (
                  <div key={index} className="border-b pb-2">
                    <p>
                      <strong>{index + 1}.</strong>
                    </p>
                    {(exportType === "both" || exportType === "questions") && (
                      <p>
                        <strong>Q:</strong> {card.question.slice(0, 100)}...
                      </p>
                    )}
                    {(exportType === "both" || exportType === "answers") && (
                      <p>
                        <strong>A:</strong> {card.answer.slice(0, 100)}...
                      </p>
                    )}
                    {includeMetadata && (
                      <p className="text-xs text-gray-500">
                        {card.topic} | {card.difficulty} |{" "}
                        {card.tags.join(", ")}
                      </p>
                    )}
                  </div>
                ))}
                {flashcards.length > 3 && (
                  <p className="text-center text-gray-500 italic">
                    ... and {flashcards.length - 3} more flashcards
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button onClick={handleExport} className="gap-2">
            {format === "pdf" ? (
              <FileText className="h-4 w-4" />
            ) : (
              <FileImage className="h-4 w-4" />
            )}
            Export as {format.toUpperCase()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
