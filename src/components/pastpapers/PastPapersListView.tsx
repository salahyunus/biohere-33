import React, { useState } from "react";
import { FileText, Download, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { type PastPaper } from "@/hooks/usePastPapers";

interface PastPapersListViewProps {
  papers: PastPaper[];
}

export const PastPapersListView: React.FC<PastPapersListViewProps> = ({
  papers,
}) => {
  const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set());

  const toggleYear = (year: number) => {
    const newExpanded = new Set(expandedYears);
    if (newExpanded.has(year)) {
      newExpanded.delete(year);
    } else {
      newExpanded.add(year);
    }
    setExpandedYears(newExpanded);
  };

  const formatSession = (session: string) => {
    return session.charAt(0).toUpperCase() + session.slice(1);
  };

  // Group papers by year
  const papersByYear = papers.reduce((acc, paper) => {
    if (!acc[paper.year]) acc[paper.year] = [];
    acc[paper.year].push(paper);
    return acc;
  }, {} as Record<number, PastPaper[]>);

  const years = Object.keys(papersByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="space-y-4">
      {years.map((year) => (
        <div key={year} className="border rounded-lg">
          <Collapsible
            open={expandedYears.has(year)}
            onOpenChange={() => toggleYear(year)}
          >
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold">{year}</h3>
                  {year >= 2023 && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      Recent
                    </Badge>
                  )}
                  <Badge variant="outline">
                    {papersByYear[year].length} papers
                  </Badge>
                </div>
                {expandedYears.has(year) ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="px-4 pb-4 space-y-3">
                {papersByYear[year].map((paper) => (
                  <div key={paper.id} className="border rounded-md p-4 bg-card">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-lg">
                        {formatSession(paper.session)} {paper.year}
                      </h4>
                      <div className="flex items-center gap-2">
                        {paper.isBookmarked && (
                          <Badge
                            variant="secondary"
                            className="bg-yellow-100 text-yellow-800"
                          >
                            Bookmarked
                          </Badge>
                        )}
                        {paper.solvedInfo?.completed && (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                          >
                            Logged
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(
                            `https://docs.google.com/viewer?url=${encodeURIComponent(
                              paper.questionPdfUrl
                            )}&embedded=true`,
                            "_blank"
                          )
                        }
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Question Paper
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(
                            `https://docs.google.com/viewer?url=${encodeURIComponent(
                              paper.markSchemePdfUrl
                            )}&embedded=true`,
                            "_blank"
                          )
                        }
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Mark Scheme
                      </Button>
                      {paper.examinerReportUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(
                              `https://docs.google.com/viewer?url=${encodeURIComponent(
                                paper.examinerReportUrl
                              )}&embedded=true`,
                              "_blank"
                            )
                          }
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Examiner Report
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      ))}
    </div>
  );
};
