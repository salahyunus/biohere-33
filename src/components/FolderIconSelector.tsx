import React from "react";
import { Button } from "@/components/ui/button";
import {
  Folder,
  FolderOpen,
  Book,
  FileQuestion,
  Brain,
  FileText,
  StickyNote,
  Calculator,
  Dna,
  Leaf,
  FileWarning,
  CheckCircle,
} from "lucide-react";

const iconOptions = [
  { icon: Folder, name: "folder" },
  { icon: FolderOpen, name: "folder-open" },
  { icon: Book, name: "book" },
  { icon: FileQuestion, name: "file-question" },
  { icon: Brain, name: "brain" },
  { icon: FileText, name: "file-text" },
  { icon: StickyNote, name: "sticky-note" },
  { icon: Dna, name: "dna" },
  { icon: Leaf, name: "leaf" },
  { icon: FileWarning, name: "warning" },
  { icon: CheckCircle, name: "check" },
];

interface FolderIconSelectorProps {
  selectedIcon: string;
  onIconSelect: (icon: string) => void;
  size?: "sm" | "md" | "lg";
}

export const FolderIconSelector: React.FC<FolderIconSelectorProps> = ({
  selectedIcon,
  onIconSelect,
  size = "md",
}) => {
  const iconSize =
    size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-5 w-5";
  const buttonSize =
    size === "sm" ? "h-8 w-8" : size === "lg" ? "h-12 w-12" : "h-10 w-10";

  return (
    <div className="flex gap-2 flex-wrap">
      {iconOptions.map((option) => {
        const IconComponent = option.icon;
        return (
          <Button
            key={option.name}
            variant={selectedIcon === option.name ? "default" : "outline"}
            size="icon"
            className={buttonSize}
            onClick={() => onIconSelect(option.name)}
          >
            <IconComponent className={iconSize} />
          </Button>
        );
      })}
    </div>
  );
};
