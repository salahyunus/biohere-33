import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Save,
  Pen,
  Highlighter,
  Type,
  Eraser,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const PdfAnnotation: React.FC = () => {
  const { paperId } = useParams();
  const navigate = useNavigate();
  const [selectedTool, setSelectedTool] = useState<
    "pen" | "highlighter" | "text" | "eraser"
  >("pen");
  const [zoom, setZoom] = useState(100);

  const samplePdfUrl =
    "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf";

  const handleSaveAnnotations = () => {
    // Save annotations to localStorage with paperId
    console.log("Saving annotations for paper:", paperId);
  };

  const tools = [
    { id: "pen" as const, icon: Pen, label: "Pen" },
    { id: "highlighter" as const, icon: Highlighter, label: "Highlighter" },
    { id: "text" as const, icon: Type, label: "Text" },
    { id: "eraser" as const, icon: Eraser, label: "Eraser" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Toolbar */}
      <div className="bg-card border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/past-papers")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Papers
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <h1 className="text-lg font-semibold">
              PDF Annotation - Paper {paperId}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              {tools.map(({ id, icon: Icon, label }) => (
                <Button
                  key={id}
                  variant={selectedTool === id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedTool(id)}
                  className="h-8 w-8 p-0"
                >
                  <Icon className="h-4 w-4" />
                </Button>
              ))}
            </div>

            <Separator orientation="vertical" className="h-6" />

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(Math.max(50, zoom - 25))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[60px] text-center">
                {zoom}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(Math.min(200, zoom + 25))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            <Button variant="outline" onClick={handleSaveAnnotations}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>

            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 p-4">
        <Card className="h-[calc(100vh-120px)]">
          <CardContent className="p-0 h-full">
            <iframe
              src={`${samplePdfUrl}#zoom=${zoom}`}
              className="w-full h-full border-0 rounded-lg"
              title="PDF Viewer"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
