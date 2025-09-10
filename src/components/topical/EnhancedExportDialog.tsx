import React, { useState, useRef } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Download, FileText } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { TopicalQuestion } from "@/data/topicalQuestions";

interface EnhancedExportDialogProps {
  children: React.ReactNode;
  questions: TopicalQuestion[];
  title: string;
}

export const EnhancedExportDialog: React.FC<EnhancedExportDialogProps> = ({
  children,
  questions,
  title,
}) => {
  const [exportType, setExportType] = useState<
    "questions" | "answers" | "both"
  >("both");
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    const pdf = new jsPDF();
    const pageHeight = 295;
    const margin = 15;
    let yPosition = 20;

    // Title
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text(title, margin, yPosition);
    yPosition += 10;

    // Export info
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      margin,
      yPosition
    );
    yPosition += 5;
    pdf.text(`Total Questions: ${questions.length}`, margin, yPosition);
    yPosition += 5;
    pdf.text(
      `Export Type: ${
        exportType.charAt(0).toUpperCase() + exportType.slice(1)
      }`,
      margin,
      yPosition
    );
    yPosition += 15;

    questions.forEach((question, index) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = 20;
      }

      // Question header
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text(
        `${index + 1}. ${question.year} ${question.session} - ${
          question.questionNumber
        } (${question.marks} marks)`,
        margin,
        yPosition
      );
      yPosition += 8;

      // Topic and difficulty
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "italic");
      pdf.text(
        `Topic: ${question.topic} | Difficulty: ${question.difficulty}`,
        margin,
        yPosition
      );
      yPosition += 8;

      if (exportType === "questions" || exportType === "both") {
        // Question text
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");

        // Clean question text (remove markdown)
        const cleanQuestion = question.question
          .replace(/\*\*(.*?)\*\*/g, "$1")
          .replace(/\*(.*?)\*/g, "$1");
        const questionLines = pdf.splitTextToSize(cleanQuestion, 180);

        questionLines.forEach((line: string) => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.text(line, margin, yPosition);
          yPosition += 5;
        });
        yPosition += 5;
      }

      if (exportType === "answers" || exportType === "both") {
        // Answer text
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text("Answer:", margin, yPosition);
        yPosition += 5;

        // Clean answer text (remove markdown)
        const cleanAnswer = question.answer
          .replace(/\*\*(.*?)\*\*/g, "$1")
          .replace(/\*(.*?)\*/g, "$1");
        const answerLines = pdf.splitTextToSize(cleanAnswer, 180);

        answerLines.forEach((line: string) => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.text(line, margin, yPosition);
          yPosition += 5;
        });
      }

      yPosition += 10; // Space between questions
    });

    const filename = `${title
      .toLowerCase()
      .replace(/\s+/g, "-")}-${exportType}.pdf`;
    pdf.save(filename);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Export Questions</DialogTitle>
          <DialogDescription>
            Choose what you want to include in your export
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="space-y-2 text-sm">
              <p>
                <strong>Total Questions:</strong> {questions.length}
              </p>
              <p>
                <strong>Export Format:</strong> PDF
              </p>
              <p>
                <strong>Generated:</strong> {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium">
              What would you like to export?
            </Label>
            <RadioGroup
              value={exportType}
              onValueChange={(value) => setExportType(value as any)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="questions" id="questions" />
                <Label htmlFor="questions">Questions Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="answers" id="answers" />
                <Label htmlFor="answers">Answers Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="both" id="both" />
                <Label htmlFor="both">Questions and Answers</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={generatePDF}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
