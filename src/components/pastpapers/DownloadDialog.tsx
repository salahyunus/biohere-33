import React, { useState } from "react";
import { Download, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { usePastPapers } from "@/hooks/usePastPapers";
import { useToast } from "@/hooks/use-toast";

interface DownloadDialogProps {
  onClose: () => void;
}

export const DownloadDialog: React.FC<DownloadDialogProps> = ({ onClose }) => {
  const [selectedPapers, setSelectedPapers] = useState<string[]>([]);
  const [includeMarkSchemes, setIncludeMarkSchemes] = useState(true);
  const [includeExaminerReports, setIncludeExaminerReports] = useState(false);
  const { pastPapers } = usePastPapers();
  const { toast } = useToast();

  const handlePaperToggle = (paperId: string) => {
    setSelectedPapers((prev) =>
      prev.includes(paperId)
        ? prev.filter((id) => id !== paperId)
        : [...prev, paperId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPapers.length === pastPapers.length) {
      setSelectedPapers([]);
    } else {
      setSelectedPapers(pastPapers.map((p) => p.id));
    }
  };

  const handleDownload = async () => {
    if (selectedPapers.length === 0) {
      toast({
        title: "No Papers Selected",
        description: "Please select at least one paper to download.",
        variant: "destructive",
      });
      return;
    }

    // In a real application, this would trigger the actual download
    // For now, we'll just show a success message
    toast({
      title: "Download Started",
      description: `Downloading ${selectedPapers.length} paper(s) with ${
        includeMarkSchemes ? "mark schemes" : "question papers only"
      }.`,
    });

    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: "All selected files have been downloaded successfully.",
      });
      onClose();
    }, 2000);
  };

  const groupedPapers = pastPapers.reduce((acc, paper) => {
    if (!acc[paper.year]) acc[paper.year] = [];
    acc[paper.year].push(paper);
    return acc;
  }, {} as Record<number, typeof pastPapers>);

  const years = Object.keys(groupedPapers)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Bulk Download Papers
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Select papers to download. Files will be organized by year and
              session.
            </p>
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              {selectedPapers.length === pastPapers.length ? (
                <>
                  <X className="h-4 w-4 mr-1" />
                  Deselect All
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Select All
                </>
              )}
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="mark-schemes"
                checked={includeMarkSchemes}
                onCheckedChange={(checked) =>
                  setIncludeMarkSchemes(checked as boolean)
                }
              />
              <Label htmlFor="mark-schemes">Include mark schemes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="examiner-reports"
                checked={includeExaminerReports}
                onCheckedChange={(checked) =>
                  setIncludeExaminerReports(checked as boolean)
                }
              />
              <Label htmlFor="examiner-reports">
                Include examiner reports (when available)
              </Label>
            </div>
          </div>

          <div className="border rounded-lg max-h-80 overflow-y-auto">
            <div className="p-4 space-y-4">
              {years.map((year) => (
                <div key={year} className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    {year}
                    {year >= 2023 && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-green-100 text-green-800"
                      >
                        Recent
                      </Badge>
                    )}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 ml-4">
                    {groupedPapers[year].map((paper) => (
                      <div
                        key={paper.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={paper.id}
                          checked={selectedPapers.includes(paper.id)}
                          onCheckedChange={() => handlePaperToggle(paper.id)}
                        />
                        <Label
                          htmlFor={paper.id}
                          className="text-sm cursor-pointer"
                        >
                          {paper.session.charAt(0).toUpperCase() +
                            paper.session.slice(1)}{" "}
                          Paper {paper.paperNumber}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedPapers.length > 0 && (
            <div className="bg-primary/10 p-3 rounded-lg">
              <div className="text-sm">
                <strong>{selectedPapers.length}</strong> paper(s) selected
                {includeMarkSchemes && <span> + mark schemes</span>}
                {includeExaminerReports && <span> + examiner reports</span>}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleDownload}
              disabled={selectedPapers.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Download ({selectedPapers.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
