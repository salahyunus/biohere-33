import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

interface PastPaper {
  id: string;
  name: string;
  year: number;
  session: string;
}

interface PastPapersYear {
  year: number;
  papers: PastPaper[];
  expanded: boolean;
}

interface PastPapersSidebarProps {
  onPaperDrop: (paperData: any) => void;
}

export const PastPapersSidebar: React.FC<PastPapersSidebarProps> = ({
  onPaperDrop,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Generate past papers data
  const generatePastPapers = (): PastPapersYear[] => {
    const years = [2025, 2024, 2023, 2022, 2021, 2020];

    return years.map((year) => {
      const papers: PastPaper[] = [];

      // Add Jan and June for all years
      papers.push({
        id: `paper-jan-${year}`,
        name: `Jan ${year}`,
        year,
        session: "Jan",
      });

      papers.push({
        id: `paper-june-${year}`,
        name: `June ${year}`,
        year,
        session: "June",
      });

      // Add Oct for years that have it (not 2020 and 2025)
      if (year !== 2020 && year !== 2025) {
        papers.push({
          id: `paper-oct-${year}`,
          name: `Oct ${year}`,
          year,
          session: "Oct",
        });
      }

      return {
        year,
        papers,
        expanded: false,
      };
    });
  };

  const [yearsData, setYearsData] = useState<PastPapersYear[]>(
    generatePastPapers()
  );

  const toggleYear = (year: number) => {
    setYearsData((prev) =>
      prev.map((yearData) =>
        yearData.year === year
          ? { ...yearData, expanded: !yearData.expanded }
          : yearData
      )
    );
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    paper: PastPaper
  ) => {
    const paperData = {
      type: "paper",
      id: paper.id,
      name: paper.name,
      year: paper.year,
      session: paper.session,
    };
    e.dataTransfer.setData("application/json", JSON.stringify(paperData));
  };

  if (isCollapsed) {
    return (
      <div className="w-12 border-r bg-card">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(false)}
          className="m-2"
        >
          <FileText className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-80 border-r bg-card overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Past Papers</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(true)}
            className="h-6 w-6"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Drag papers to schedule solving them
        </p>
      </div>

      <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
        <div className="p-2 space-y-2">
          {yearsData.map((yearData) => (
            <Collapsible
              key={yearData.year}
              open={yearData.expanded}
              onOpenChange={() => toggleYear(yearData.year)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start p-2 h-auto hover:bg-muted/50"
                >
                  {yearData.expanded ? (
                    <ChevronDown className="h-4 w-4 mr-2" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-2" />
                  )}
                  <span className="font-medium">{yearData.year}</span>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {yearData.papers.length}
                  </Badge>
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className="ml-4 space-y-1">
                {yearData.papers.map((paper) => (
                  <div
                    key={paper.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, paper)}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-grab active:cursor-grabbing transition-colors group"
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                    <FileText className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">{paper.name}</span>
                    {(paper.year === 2024 || paper.year === 2025) && (
                      <Badge
                        variant="secondary"
                        className="ml-auto text-xs bg-green-100 text-green-800"
                      >
                        recent
                      </Badge>
                    )}
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </div>
  );
};
