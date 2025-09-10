import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, X } from "lucide-react";

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

interface PdfPreviewDialogProps {
  pdf: PdfNote | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PdfPreviewDialog: React.FC<PdfPreviewDialogProps> = ({
  pdf,
  open,
  onOpenChange,
}) => {
  if (!pdf) return null;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdf.lightVersion;
    link.download = `${pdf.title}.pdf`;
    link.click();
  };

  const handleOpenExternal = () => {
    window.open(pdf.lightVersion, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <DialogTitle className="text-xl">{pdf.title}</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {pdf.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button size="sm" variant="outline" onClick={handleOpenExternal}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 border rounded-lg overflow-hidden bg-muted/20">
          <iframe
            src={pdf.lightVersion}
            className="w-full h-full"
            title={`Preview of ${pdf.title}`}
            loading="lazy"
          />
        </div>

        <div className="flex items-center justify-between pt-4 text-sm text-muted-foreground">
          <span>Topic: {pdf.topic}</span>
          <span>{pdf.pages} pages</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};
