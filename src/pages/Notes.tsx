import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NotesNavbar } from "@/components/notes/NotesNavbar";
import { NotesSidebar } from "@/components/notes/NotesSidebar";
import { NotesContent } from "@/components/notes/NotesContent";
import { UnitOverview } from "@/components/notes/UnitOverview";
import { SavedContent } from "@/components/notes/SavedContent";
import { useNotesData } from "@/hooks/useNotesData";
import { useNotesSettings } from "@/hooks/useNotesSettings";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Notes() {
  const { unitId, lessonId } = useParams<{
    unitId?: string;
    lessonId?: string;
  }>();
  const navigate = useNavigate();
  const {
    units,
    currentLesson,
    setCurrentLesson,
    toggleLessonComplete,
    getUnitProgress,
    getTotalProgress,
  } = useNotesData();
  const { settings } = useNotesSettings();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (unitId && lessonId) {
      const unit = units.find((u) => u.id === unitId);
      if (unit) {
        const topic = unit.topics.find((t) =>
          t.lessons.some((l) => l.id === lessonId)
        );
        const lesson = topic?.lessons.find((l) => l.id === lessonId);
        if (lesson) {
          setCurrentLesson(lesson);
        }
      }
    } else if (unitId === "saved-content") {
      // Handle saved content page
    } else if (unitId && !lessonId) {
      // Show unit overview
      setCurrentLesson(null);
    }
  }, [unitId, lessonId, units, setCurrentLesson]);

  const handleNavigateToLesson = (unitId: string, lessonId: string) => {
    navigate(`/notes/${unitId}/${lessonId}`);
  };

  const handleNavigateToUnit = (unitId: string) => {
    navigate(`/notes/${unitId}`);
  };

  const renderContent = () => {
    if (unitId === "saved-content") {
      return <SavedContent />;
    }

    if (!lessonId && unitId) {
      const unit = units.find((u) => u.id === unitId);
      if (unit) {
        return (
          <UnitOverview
            unit={unit}
            onNavigateToLesson={handleNavigateToLesson}
          />
        );
      }
    }

    if (currentLesson) {
      return (
        <NotesContent
          lesson={currentLesson}
          onToggleComplete={() => toggleLessonComplete(currentLesson.id)}
        />
      );
    }

    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">
          Select a lesson to view its content
        </p>
      </div>
    );
  };

  const totalProgress = getTotalProgress();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NotesNavbar
        currentLesson={currentLesson}
        onToggleComplete={
          currentLesson
            ? () => toggleLessonComplete(currentLesson.id)
            : undefined
        }
        onNavigateToUnit={() => unitId && handleNavigateToUnit(unitId)}
      />

      <div className="flex-1 flex">
        <NotesSidebar
          units={units}
          currentLesson={currentLesson}
          onNavigateToLesson={handleNavigateToLesson}
          onNavigateToUnit={handleNavigateToUnit}
          onNavigateToSavedContent={() => navigate("/notes/saved-content")}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 overflow-auto">
          {totalProgress > 0 && (
            <Card className="m-4 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(totalProgress)}%
                </span>
              </div>
              <Progress value={totalProgress} className="w-full" />
            </Card>
          )}

          <div
            className="p-4"
            style={{
              fontFamily: settings.fontFamily,
              fontSize: `${settings.fontSize}px`,
              color: settings.textColor,
            }}
          >
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
