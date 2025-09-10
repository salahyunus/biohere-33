import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Home,
  Archive,
  ChevronRight,
  ChevronDown,
  Circle,
  CheckCircle,
  PanelLeft,
} from "lucide-react";
import { NotesUnit, NotesLesson } from "@/hooks/useNotesData";
import { SearchDialog } from "./SearchDialog";
import { cn } from "@/lib/utils";

interface NotesSidebarProps {
  units: NotesUnit[];
  currentLesson: NotesLesson | null;
  onNavigateToLesson: (unitId: string, lessonId: string) => void;
  onNavigateToUnit: (unitId: string) => void;
  onNavigateToSavedContent: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const NotesSidebar: React.FC<NotesSidebarProps> = ({
  units,
  currentLesson,
  onNavigateToLesson,
  onNavigateToUnit,
  onNavigateToSavedContent,
  isOpen,
  onToggle,
}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>(
    {}
  );

  const toggleTopic = (topicId: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  const getTopicProgress = (unitId: string, topicId: string) => {
    const unit = units.find((u) => u.id === unitId);
    const topic = unit?.topics.find((t) => t.id === topicId);
    if (!topic) return 0;

    const completedLessons = topic.lessons.filter((l) => l.completed).length;
    return topic.lessons.length > 0
      ? (completedLessons / topic.lessons.length) * 100
      : 0;
  };

  if (!isOpen) {
    return (
      <div className="w-12 border-r bg-background flex flex-col items-center py-4">
        <Button variant="ghost" size="icon" onClick={onToggle} className="mb-4">
          <PanelLeft className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <aside className="w-80 border-r bg-background overflow-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Biology Notes</h2>
            <Button variant="ghost" size="icon" onClick={onToggle}>
              <PanelLeft className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSearch(true)}
              className="w-full justify-start"
            >
              <Search className="h-4 w-4 mr-2" />
              Search notes...
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onNavigateToSavedContent}
              className="w-full justify-start"
            >
              <Archive className="h-4 w-4 mr-2" />
              Saved Content
            </Button>
          </div>

          <div className="space-y-4">
            {units.map((unit) => (
              <div key={unit.id} className="space-y-2">
                <Button
                  variant="ghost"
                  onClick={() => onNavigateToUnit(unit.id)}
                  className="w-full justify-start font-medium"
                >
                  <Home className="h-4 w-4 mr-2" />
                  {unit.title}
                </Button>

                <div className="space-y-1 ml-2">
                  {unit.topics.map((topic) => {
                    const isExpanded = expandedTopics[topic.id];
                    const progress = getTopicProgress(unit.id, topic.id);

                    return (
                      <div key={topic.id} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleTopic(topic.id)}
                            className="flex-1 justify-start text-sm"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-3 w-3 mr-1" />
                            ) : (
                              <ChevronRight className="h-3 w-3 mr-1" />
                            )}
                            {topic.title}
                          </Button>
                          {progress > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {Math.round(progress)}%
                            </Badge>
                          )}
                        </div>

                        {progress > 0 && (
                          <Progress value={progress} className="h-1 ml-6" />
                        )}

                        {isExpanded && (
                          <div className="ml-6 space-y-1">
                            {topic.lessons.map((lesson) => (
                              <Button
                                key={lesson.id}
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  onNavigateToLesson(unit.id, lesson.id)
                                }
                                className={cn(
                                  "w-full justify-start text-sm",
                                  currentLesson?.id === lesson.id && "bg-accent"
                                )}
                              >
                                {lesson.completed ? (
                                  <CheckCircle className="h-3 w-3 mr-2 text-green-600" />
                                ) : (
                                  <Circle className="h-3 w-3 mr-2 text-muted-foreground" />
                                )}
                                {lesson.title}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <SearchDialog
        open={showSearch}
        onOpenChange={setShowSearch}
        units={units}
        onNavigateToLesson={onNavigateToLesson}
      />
    </>
  );
};
