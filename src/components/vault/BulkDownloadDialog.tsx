import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Moon, Sun } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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

interface BulkDownloadDialogProps {
  pdfs: PdfNote[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BulkDownloadDialog: React.FC<BulkDownloadDialogProps> = ({
  pdfs,
  open,
  onOpenChange,
}) => {
  const [selectedPdfs, setSelectedPdfs] = useState<string[]>([]);
  const [version, setVersion] = useState<"light" | "dark">("light");

  const topics = Array.from(new Set(pdfs.map((pdf) => pdf.topic)));

  const handlePdfToggle = (pdfId: string, checked: boolean) => {
    if (checked) {
      setSelectedPdfs((prev) => [...prev, pdfId]);
    } else {
      setSelectedPdfs((prev) => prev.filter((id) => id !== pdfId));
    }
  };

  const handleTopicToggle = (topic: string, checked: boolean) => {
    const topicPdfs = pdfs
      .filter((pdf) => pdf.topic === topic)
      .map((pdf) => pdf.id);

    if (checked) {
      setSelectedPdfs((prev) => [...new Set([...prev, ...topicPdfs])]);
    } else {
      setSelectedPdfs((prev) => prev.filter((id) => !topicPdfs.includes(id)));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPdfs(pdfs.map((pdf) => pdf.id));
    } else {
      setSelectedPdfs([]);
    }
  };

  const handleDownload = () => {
    const selectedPdfData = pdfs.filter((pdf) => selectedPdfs.includes(pdf.id));

    selectedPdfData.forEach((pdf, index) => {
      setTimeout(() => {
        const pdfUrl = version === "light" ? pdf.lightVersion : pdf.darkVersion;
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = `${pdf.title}-${version}.pdf`;
        link.click();
      }, index * 500); // Stagger downloads to avoid browser blocking
    });

    onOpenChange(false);
    setSelectedPdfs([]);
  };

  const isTopicSelected = (topic: string) => {
    const topicPdfs = pdfs.filter((pdf) => pdf.topic === topic);
    return topicPdfs.every((pdf) => selectedPdfs.includes(pdf.id));
  };

  const isTopicPartiallySelected = (topic: string) => {
    const topicPdfs = pdfs.filter((pdf) => pdf.topic === topic);
    return (
      topicPdfs.some((pdf) => selectedPdfs.includes(pdf.id)) &&
      !isTopicSelected(topic)
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Bulk Download PDF Notes</DialogTitle>
          <DialogDescription>
            Select the PDF notes you want to download and choose your preferred
            version
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Version Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Version</Label>
            <RadioGroup
              value={version}
              onValueChange={(value: "light" | "dark") => setVersion(value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label
                  htmlFor="light"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Sun className="h-4 w-4 text-yellow-500" />
                  Light Mode
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label
                  htmlFor="dark"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Moon className="h-4 w-4 text-blue-500" />
                  Dark Mode
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Select All */}
          <div className="flex items-center space-x-2 pb-2 border-b">
            <Checkbox
              checked={selectedPdfs.length === pdfs.length}
              onCheckedChange={handleSelectAll}
            />
            <Label className="font-medium">
              Select All ({selectedPdfs.length}/{pdfs.length})
            </Label>
          </div>

          {/* Topics and PDFs */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {topics.map((topic) => {
              const topicPdfs = pdfs.filter((pdf) => pdf.topic === topic);
              const isSelected = isTopicSelected(topic);
              const isPartiallySelected = isTopicPartiallySelected(topic);

              return (
                <div key={topic} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          handleTopicToggle(topic, checked as boolean)
                        }
                      />
                      {isPartiallySelected && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-2 h-0.5 bg-primary rounded" />
                        </div>
                      )}
                    </div>
                    <Badge variant="outline" className="font-medium">
                      {topic}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      (
                      {
                        topicPdfs.filter((pdf) => selectedPdfs.includes(pdf.id))
                          .length
                      }
                      /{topicPdfs.length})
                    </span>
                  </div>

                  <div className="ml-6 space-y-2">
                    {topicPdfs.map((pdf) => (
                      <div key={pdf.id} className="flex items-center space-x-2">
                        <Checkbox
                          checked={selectedPdfs.includes(pdf.id)}
                          onCheckedChange={(checked) =>
                            handlePdfToggle(pdf.id, checked as boolean)
                          }
                        />
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm flex-1">{pdf.title}</span>
                        <Badge variant="secondary" className="text-xs">
                          {pdf.pages} pages
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleDownload} disabled={selectedPdfs.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Download {selectedPdfs.length} PDF
            {selectedPdfs.length !== 1 ? "s" : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
