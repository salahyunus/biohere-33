import React, { useState } from "react";
import {
  MoreHorizontal,
  Tag,
  MessageSquare,
  FolderPlus,
  Link,
  Trash2,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SyllabusObjective, SyllabusSettings } from "@/hooks/useSyllabusData";
import { ObjectiveDialog } from "./ObjectiveDialog";
import { cn } from "@/lib/utils";

interface SyllabusObjectiveItemProps {
  objective: SyllabusObjective;
  settings: SyllabusSettings;
  onUpdate: (updates: Partial<SyllabusObjective>) => void;
  onDelete?: () => void;
}

export const SyllabusObjectiveItem: React.FC<SyllabusObjectiveItemProps> = ({
  objective,
  settings,
  onUpdate,
  onDelete,
}) => {
  const [showDialog, setShowDialog] = useState(false);

  const handleCheck = (checked: boolean) => {
    onUpdate({ completed: checked });
  };

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case "important":
        return "bg-red-500 hover:bg-red-600";
      case "difficult":
        return "bg-orange-500 hover:bg-orange-600";
      case "easy":
        return "bg-green-500 hover:bg-green-600";
      case "review":
        return "bg-yellow-500 hover:bg-yellow-600";
      default:
        return "bg-blue-500 hover:bg-blue-600";
    }
  };

  return (
    <div
      id={`objective-${objective.id}`}
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg border bg-background hover:bg-muted/50 transition-colors",
        settings.strikethrough && objective.completed && "opacity-60"
      )}
    >
      <Checkbox
        checked={objective.completed}
        onCheckedChange={handleCheck}
        className="mt-1"
      />

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm",
            settings.strikethrough &&
              objective.completed &&
              "line-through text-muted-foreground"
          )}
        >
          {objective.text}
        </p>

        {objective.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {objective.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className={cn("text-xs text-white", getTagColor(tag))}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {objective.comment && (
          <p className="text-xs text-muted-foreground mt-2 italic">
            "{objective.comment}"
          </p>
        )}

        {objective.folderId && (
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <Link className="h-3 w-3" />
            <span>Saved to folder</span>
          </div>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowDialog(true)}>
            <Tag className="h-4 w-4 mr-2" />
            Manage Tags
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowDialog(true)}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Add Comment
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowDialog(true)}>
            <FolderPlus className="h-4 w-4 mr-2" />
            Save to Folder
          </DropdownMenuItem>
          {objective.isCustom && onDelete && (
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Objective
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ObjectiveDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        objective={objective}
        onUpdate={onUpdate}
      />
    </div>
  );
};
