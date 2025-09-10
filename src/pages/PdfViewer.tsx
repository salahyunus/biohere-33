import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePastPapers } from "@/hooks/usePastPapers";

export const PdfViewer: React.FC = () => {
  const { paperId } = useParams<{ paperId: string }>();
  const navigate = useNavigate();
  const { pastPapers } = usePastPapers();
  const [paper, setPaper] = useState<any>(null);

  useEffect(() => {
    if (paperId) {
      const foundPaper = pastPapers.find((p) => p.id === paperId);
      setPaper(foundPaper);
    }
  }, [paperId, pastPapers]);

  if (!paper) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Paper not found</h2>
          <Button onClick={() => navigate("/past-papers")}>
            Back to Past Papers
          </Button>
        </div>
      </div>
    );
  }

  const questionPdfGoogleUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(
    paper.questionPdfUrl
  )}&embedded=true`;
  const markSchemeGoogleUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(
    paper.markSchemePdfUrl
  )}&embedded=true`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/past-papers")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-semibold">
              {paper.year} {paper.session} - Question Paper & Mark Scheme
            </h1>
          </div>
        </div>
      </div>

      {/* PDF Viewers */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Question Paper */}
        <div className="flex-1 border-r">
          <div className="p-4 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <h3 className="font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Question Paper
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(questionPdfGoogleUrl, "_blank")}
              >
                <Download className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
            </div>
          </div>
          <div className="h-full">
            <iframe
              src={questionPdfGoogleUrl}
              className="w-full h-full border-0"
              title="Question Paper"
            />
          </div>
        </div>

        {/* Mark Scheme */}
        <div className="flex-1">
          <div className="p-4 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <h3 className="font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Mark Scheme
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(markSchemeGoogleUrl, "_blank")}
              >
                <Download className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
            </div>
          </div>
          <div className="h-full">
            <iframe
              src={markSchemeGoogleUrl}
              className="w-full h-full border-0"
              title="Mark Scheme"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
