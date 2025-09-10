import React, { useState } from "react";
import { ArrowLeft, Download, Eye, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { PdfPreviewDialog } from "@/components/vault/PdfPreviewDialog";
import { PdfVersionDialog } from "@/components/vault/PdfVersionDialog";
import { BulkDownloadDialog } from "@/components/vault/BulkDownloadDialog";

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

const mockPdfNotes: PdfNote[] = [
  {
    id: "1",
    title: "Cell Structure & Organization",
    description:
      "Comprehensive notes on cell structure, organelles, and cellular organization",
    topic: "Cell Biology",
    pages: 24,
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
    darkVersion:
      "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf",
    lightVersion:
      "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf",
  },
  {
    id: "2",
    title: "Photosynthesis & Respiration",
    description:
      "Detailed guide to photosynthesis and cellular respiration processes",
    topic: "Biochemistry",
    pages: 32,
    image:
      "https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&h=250&fit=crop",
    darkVersion:
      "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf",
    lightVersion:
      "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf",
  },
  {
    id: "3",
    title: "Genetics & Heredity",
    description:
      "Complete notes on genetics, DNA, RNA, and inheritance patterns",
    topic: "Genetics",
    pages: 28,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
    darkVersion:
      "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf",
    lightVersion:
      "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf",
  },
  {
    id: "4",
    title: "Evolution & Natural Selection",
    description:
      "Evolutionary theory, natural selection, and speciation mechanisms",
    topic: "Evolution",
    pages: 20,
    image:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=250&fit=crop",
    darkVersion:
      "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf",
    lightVersion:
      "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf",
  },
  {
    id: "5",
    title: "Ecology & Ecosystems",
    description:
      "Ecological principles, food webs, and environmental interactions",
    topic: "Ecology",
    pages: 26,
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop",
    darkVersion:
      "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf",
    lightVersion:
      "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf",
  },
  {
    id: "6",
    title: "Human Physiology",
    description: "Body systems, homeostasis, and physiological processes",
    topic: "Physiology",
    pages: 35,
    image:
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=250&fit=crop",
    darkVersion:
      "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf",
    lightVersion:
      "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf",
  },
  {
    id: "7",
    title: "Molecular Biology",
    description:
      "DNA replication, transcription, translation, and gene expression",
    topic: "Molecular Biology",
    pages: 30,
    image:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=250&fit=crop",
    darkVersion:
      "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf",
    lightVersion:
      "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf",
  },
];

const PdfNotes: React.FC = () => {
  const navigate = useNavigate();
  const [previewPdf, setPreviewPdf] = useState<PdfNote | null>(null);
  const [versionPdf, setVersionPdf] = useState<PdfNote | null>(null);
  const [versionAction, setVersionAction] = useState<"preview" | "download">(
    "preview"
  );
  const [bulkDownloadOpen, setBulkDownloadOpen] = useState(false);

  const handlePreview = (pdf: PdfNote) => {
    setVersionPdf(pdf);
    setVersionAction("preview");
  };

  const handleDownload = (pdf: PdfNote) => {
    setVersionPdf(pdf);
    setVersionAction("download");
  };

  const handleVersionSelected = (pdf: PdfNote, version: "light" | "dark") => {
    const pdfUrl = version === "light" ? pdf.lightVersion : pdf.darkVersion;

    if (versionAction === "preview") {
      setPreviewPdf({ ...pdf, darkVersion: pdfUrl, lightVersion: pdfUrl });
    } else {
      // Trigger download
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `${pdf.title}-${version}.pdf`;
      link.click();
    }
    setVersionPdf(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/vault")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Vault
        </Button>
      </div>

      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">PDF Notes</h1>
        <p className="text-muted-foreground">
          High-quality study notes in PDF format for all biology topics
        </p>
      </div>

      {/* Bulk Download Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => setBulkDownloadOpen(true)}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Bulk Download
        </Button>
      </div>

      {/* PDF Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockPdfNotes.map((pdf) => (
          <Card
            key={pdf.id}
            className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src={pdf.image}
                alt={pdf.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <Badge className="absolute top-2 right-2 bg-background/80 text-foreground">
                {pdf.pages} pages
              </Badge>
            </div>

            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <Badge variant="outline" className="text-xs">
                  {pdf.topic}
                </Badge>
                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </div>
              <CardTitle className="text-lg leading-tight line-clamp-2">
                {pdf.title}
              </CardTitle>
              <CardDescription className="text-sm line-clamp-2">
                {pdf.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0 space-y-2">
              <Button
                onClick={() => handlePreview(pdf)}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button
                onClick={() => handleDownload(pdf)}
                size="sm"
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialogs */}
      <PdfPreviewDialog
        pdf={previewPdf}
        open={!!previewPdf}
        onOpenChange={(open) => !open && setPreviewPdf(null)}
      />

      <PdfVersionDialog
        pdf={versionPdf}
        open={!!versionPdf}
        onOpenChange={(open) => !open && setVersionPdf(null)}
        onVersionSelect={handleVersionSelected}
        action={versionAction}
      />

      <BulkDownloadDialog
        pdfs={mockPdfNotes}
        open={bulkDownloadOpen}
        onOpenChange={setBulkDownloadOpen}
      />
    </div>
  );
};

export default PdfNotes;
