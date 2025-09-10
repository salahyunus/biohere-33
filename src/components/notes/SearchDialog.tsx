import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ExternalLink } from "lucide-react";
import { NotesUnit } from "@/hooks/useNotesData";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  units: NotesUnit[];
  onNavigateToLesson: (unitId: string, lessonId: string) => void;
}

export const SearchDialog: React.FC<SearchDialogProps> = ({
  open,
  onOpenChange,
  units,
  onNavigateToLesson,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const searchResults: any[] = [];

    units.forEach((unit) => {
      unit.topics.forEach((topic) => {
        topic.lessons.forEach((lesson) => {
          // Search in lesson title
          if (lesson.title.toLowerCase().includes(searchTerm.toLowerCase())) {
            searchResults.push({
              type: "lesson",
              unitId: unit.id,
              lessonId: lesson.id,
              title: lesson.title,
              unit: unit.title,
              topic: topic.title,
            });
          }

          // Search in lesson content
          lesson.content.forEach((content) => {
            if (
              content.type === "paragraph" &&
              content.content.text
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            ) {
              searchResults.push({
                type: "content",
                unitId: unit.id,
                lessonId: lesson.id,
                title: lesson.title,
                unit: unit.title,
                topic: topic.title,
                snippet: content.content.text.substring(0, 150) + "...",
              });
            }
          });
        });
      });
    });

    setResults(searchResults);
  };

  const highlightText = (text: string, term: string) => {
    const regex = new RegExp(`(${term})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Search Notes</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search through all notes..."
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="max-h-96 overflow-auto space-y-2">
            {results.map((result, index) => (
              <div
                key={index}
                className="p-3 border rounded-lg hover:bg-accent cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium">{result.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {result.unit} › {result.topic}
                    </p>
                    {result.snippet && (
                      <p
                        className="text-sm mt-1"
                        dangerouslySetInnerHTML={{
                          __html: highlightText(result.snippet, searchTerm),
                        }}
                      />
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onNavigateToLesson(result.unitId, result.lessonId);
                      onOpenChange(false);
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {searchTerm && results.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No results found for "{searchTerm}"
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
