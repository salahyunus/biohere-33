import React, { useEffect, useMemo, useState } from "react";
import {
  Link as LinkIcon,
  ExternalLink,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SyllabusObjectiveLink } from "@/hooks/useFolders";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface SyllabusObjectiveCardProps {
  objective: SyllabusObjectiveLink;
  onRemove: () => void;
  folderId: string;
}

export const SyllabusObjectiveCard: React.FC<SyllabusObjectiveCardProps> = ({
  objective,
  onRemove,
  folderId,
}) => {
  const navigate = useNavigate();
  const [resolvedMeta, setResolvedMeta] = useState<{
    unitTitle: string;
    topicTitle: string;
  }>({
    unitTitle: objective.unitTitle,
    topicTitle: objective.topicTitle,
  });

  useEffect(() => {
    // Fallback resolve if missing/unknown
    if (
      !objective.unitTitle ||
      objective.unitTitle === "Unknown Unit" ||
      !objective.topicTitle ||
      objective.topicTitle === "Unknown Topic"
    ) {
      try {
        const units = JSON.parse(
          localStorage.getItem("syllabus-units") || "[]"
        );
        let found: any = null;
        let unitTitle = "Unknown Unit";
        let topicTitle = "Unknown Topic";
        units.forEach((u: any) => {
          u.topics?.forEach((t: any) => {
            if (
              t.objectives?.some((o: any) => o.id === objective.objectiveId)
            ) {
              found = true;
              unitTitle = u.title || unitTitle;
              topicTitle = t.title || topicTitle;
            }
            t.subtopics?.forEach((s: any) => {
              if (
                s.objectives?.some((o: any) => o.id === objective.objectiveId)
              ) {
                found = true;
                unitTitle = u.title || unitTitle;
                topicTitle = `${t.title || ""} › ${s.title || ""}`.trim();
              }
            });
          });
        });
        if (found) {
          setResolvedMeta({ unitTitle, topicTitle });
        }
      } catch {}
    }
  }, [objective.objectiveId, objective.unitTitle, objective.topicTitle]);

  const handleGoToObjective = () => {
    // Navigate to syllabus page and scroll to objective
    navigate(`/syllabus#objective-${objective.objectiveId}`);
    // Small delay to ensure navigation completes before scrolling
    setTimeout(() => {
      const element = document.getElementById(
        `objective-${objective.objectiveId}`
      );
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        // Add temporary highlight
        element.classList.add("ring-2", "ring-primary", "ring-offset-2");
        setTimeout(() => {
          element.classList.remove("ring-2", "ring-primary", "ring-offset-2");
        }, 2000);
      }
    }, 100);
  };

  const dragPayload = useMemo(
    () =>
      JSON.stringify({
        type: "syllabus-objective",
        fromFolderId: folderId,
        objective,
      }),
    [folderId, objective]
  );

  const onDragStart: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.dataTransfer.setData("application/x-syllabus-objective", dragPayload);
    e.dataTransfer.setData("text/plain", `objective:${objective.objectiveId}`);
  };

  return (
    <Card
      className="group relative hover:shadow-md transition-all duration-200 cursor-pointer"
      draggable
      onDragStart={onDragStart}
    >
      <CardContent className="p-3 animate-fade-in">
        <div className="flex items-start gap-2 mb-2">
          <LinkIcon className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium line-clamp-2 mb-1">
              {objective.objectiveText}
            </p>
            <div className="text-xs text-muted-foreground">
              <p className="truncate">
                {resolvedMeta.unitTitle || objective.unitTitle}
              </p>
              <p className="truncate">
                {resolvedMeta.topicTitle || objective.topicTitle}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoToObjective}
            className="h-7 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Go to objective
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onRemove} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Remove from folder
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};
