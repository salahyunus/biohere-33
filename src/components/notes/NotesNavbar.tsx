import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Settings2,
  Bookmark,
  Volume2,
  Highlighter,
  Download,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Home,
} from "lucide-react";
import { ThemeSelector } from "@/components/ThemeSelector";
import { NotesSettings } from "./NotesSettings";
import { ExportDialog } from "./ExportDialog";
import { NotesLesson } from "@/hooks/useNotesData";
import { cn } from "@/lib/utils";

interface NotesNavbarProps {
  currentLesson: NotesLesson | null;
  onToggleComplete?: () => void;
  onNavigateToUnit?: () => void;
}

export const NotesNavbar: React.FC<NotesNavbarProps> = ({
  currentLesson,
  onToggleComplete,
  onNavigateToUnit,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [isHighlightMode, setIsHighlightMode] = useState(false);

  const handleBookmark = () => {
    if (currentLesson) {
      // Add to saved content - bookmarked lessons
      console.log("Bookmarking lesson:", currentLesson.title);
    }
  };

  const handleListen = () => {
    if (currentLesson) {
      // Implement text-to-speech
      const text = currentLesson.content
        .filter((c) => c.type === "paragraph")
        .map((c) => c.content.text)
        .join(" ");

      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
      }
    }
  };

  const toggleHighlightMode = () => {
    setIsHighlightMode(!isHighlightMode);
    document.body.classList.toggle("highlight-mode", !isHighlightMode);
  };

  return (
    <>
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>

            {currentLesson && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={onNavigateToUnit}>
                  <Home className="h-4 w-4 mr-1" />
                  Unit Overview
                </Button>
                <span className="text-sm font-medium">
                  {currentLesson.title}
                </span>
                {currentLesson.completed && (
                  <Badge variant="secondary" className="text-green-600">
                    Complete
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <ThemeSelector />

            {!isCollapsed && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                >
                  <Settings2 className="h-4 w-4" />
                </Button>

                {currentLesson && (
                  <>
                    <Button variant="ghost" size="sm" onClick={handleBookmark}>
                      <Bookmark className="h-4 w-4" />
                    </Button>

                    <Button variant="ghost" size="sm" onClick={handleListen}>
                      <Volume2 className="h-4 w-4" />
                    </Button>

                    <Button
                      variant={isHighlightMode ? "default" : "ghost"}
                      size="sm"
                      onClick={toggleHighlightMode}
                    >
                      <Highlighter className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowExport(true)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>

                    <Button
                      variant={currentLesson.completed ? "default" : "ghost"}
                      size="sm"
                      onClick={onToggleComplete}
                      className={cn(
                        currentLesson.completed &&
                          "bg-green-600 hover:bg-green-700"
                      )}
                    >
                      <CheckCircle className="h-4 w-4" />
                      {currentLesson.completed ? "Complete" : "Mark Complete"}
                    </Button>
                  </>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowExport(true)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      <NotesSettings open={showSettings} onOpenChange={setShowSettings} />

      <ExportDialog
        open={showExport}
        onOpenChange={setShowExport}
        currentLesson={currentLesson}
      />
    </>
  );
};
