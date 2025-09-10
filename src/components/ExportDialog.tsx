import React, { useRef } from "react";
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
import { Download, FileImage, FileText } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ExportDialogProps {
  children: React.ReactNode;
  data: any;
  title: string;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  children,
  data,
  title,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const exportAsImage = async () => {
    if (!contentRef.current) return;

    try {
      const canvas = await html2canvas(contentRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      });

      const link = document.createElement("a");
      link.download = `${title.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error("Failed to export as image:", error);
    }
  };

  const exportAsPDF = async () => {
    if (!contentRef.current) return;

    try {
      const canvas = await html2canvas(contentRef.current, {
        backgroundColor: "#ffffff",
        scale: 1,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${title.toLowerCase().replace(/\s+/g, "-")}.pdf`);
    } catch (error) {
      console.error("Failed to export as PDF:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export {title}</DialogTitle>
          <DialogDescription>
            Choose your preferred export format
          </DialogDescription>
        </DialogHeader>

        <div ref={contentRef} className="p-4 bg-white rounded border">
          <h2 className="text-xl font-bold text-black mb-4">{title}</h2>
          <div className="space-y-2 text-black">
            <p>
              <strong>Generated on:</strong> {new Date().toLocaleDateString()}
            </p>
            {data && typeof data === "object" && (
              <div className="space-y-1">
                {Object.entries(data).map(([key, value]) => (
                  <p key={key}>
                    <strong>
                      {key.charAt(0).toUpperCase() + key.slice(1)}:
                    </strong>{" "}
                    {String(value)}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button onClick={exportAsImage} variant="outline">
            <FileImage className="h-4 w-4 mr-2" />
            Export as Image
          </Button>
          <Button onClick={exportAsPDF}>
            <FileText className="h-4 w-4 mr-2" />
            Export as PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
