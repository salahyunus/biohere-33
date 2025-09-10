import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Settings,
  Plus,
  Download,
  ExternalLink,
  CheckCircle,
  Circle,
} from "lucide-react";
import Confetti from "react-confetti";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSyllabusData } from "@/hooks/useSyllabusData";
import { SyllabusUnit } from "@/components/syllabus/SyllabusUnit";
import { SyllabusSettings } from "@/components/syllabus/SyllabusSettings";
import { AddObjectiveDialog } from "@/components/syllabus/AddObjectiveDialog";
import { ExportDialog } from "@/components/syllabus/ExportDialog";

const SyllabusChecklist: React.FC = () => {
  const {
    units,
    settings,
    updateObjective,
    updateSettings,
    addCustomTopic,
    addCustomObjective,
    deleteObjective,
    deleteTopic,
    getTotalProgress,
    getUnitProgress,
  } = useSyllabusData();

  const [showSettings, setShowSettings] = useState(false);
  const [showAddObjective, setShowAddObjective] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const location = useLocation();

  const totalProgress = getTotalProgress();

  // Counts for progress card
  const { completedCount, totalCount, remainingCount } = useMemo(() => {
    let total = 0;
    let done = 0;
    units.forEach((unit) => {
      unit.topics.forEach((topic) => {
        total += topic.objectives.length;
        done += topic.objectives.filter((o) => o.completed).length;
        topic.subtopics?.forEach((sub) => {
          total += sub.objectives.length;
          done += sub.objectives.filter((o) => o.completed).length;
        });
      });
    });
    return {
      completedCount: done,
      totalCount: total,
      remainingCount: Math.max(0, total - done),
    };
  }, [units]);

  useEffect(() => {
    // Hash-deep-link scrolling: /syllabus#objective-<id>
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("ring-2", "ring-primary", "ring-offset-2");
          setTimeout(
            () =>
              el.classList.remove("ring-2", "ring-primary", "ring-offset-2"),
            1200
          );
        }
      }, 150);
    }
  }, [location.hash, units]);

  const handleObjectiveUpdate = (
    unitId: string,
    topicId: string,
    objectiveId: string,
    updates: any,
    subtopicId?: string
  ) => {
    updateObjective(unitId, topicId, objectiveId, updates, subtopicId);
  };

  const handleObjectiveDelete = (
    unitId: string,
    topicId: string,
    objectiveId: string,
    subtopicId?: string
  ) => {
    deleteObjective(unitId, topicId, objectiveId, subtopicId);
  };

  const handleTopicDelete = (unitId: string, topicId: string) => {
    deleteTopic(unitId, topicId);
  };

  const handleTopicComplete = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleAddCustomObjective = (
    unitId: string,
    topicId: string,
    text: string,
    isNewTopic?: boolean,
    newTopicTitle?: string
  ) => {
    if (isNewTopic && newTopicTitle) {
      addCustomTopic(unitId, newTopicTitle);
      // We need to get the new topic ID, but for simplicity, we'll add the objective to the new topic
      setTimeout(() => {
        const updatedUnits = units.find((u) => u.id === unitId);
        const newTopic = updatedUnits?.topics.find(
          (t) => t.title === newTopicTitle
        );
        if (newTopic) {
          addCustomObjective(unitId, newTopic.id, text);
        }
      }, 100);
    } else {
      addCustomObjective(unitId, topicId, text);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in px-3 sm:px-4 lg:px-0">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      {/* Header - More responsive */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link to="/">
            <Button
              variant="outline"
              size="icon"
              className="hover-scale h-8 w-8 sm:h-10 sm:w-10"
            >
              <Home className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-1">
              Syllabus Checklist
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm lg:text-lg">
              Track your progress through the biology syllabus
            </p>
          </div>
        </div>

        {/* Action buttons - Responsive layout */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowSettings(true)}
              className="hover-scale h-8 w-8 sm:h-9 sm:w-9"
            >
              <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowExport(true)}
              className="hover-scale h-8 w-8 sm:h-9 sm:w-9"
            >
              <Download className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={() => setShowAddObjective(true)}
            className="gap-1 sm:gap-2 hover-scale text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Add</span>
            <span className="xs:hidden sm:inline">Objective</span>
          </Button>

          <Button
            variant="outline"
            asChild
            className="hover-scale gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
          >
            <a
              href="/syllabus.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="gap-1 sm:gap-2"
            >
              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">PDF</span>
              <span className="xs:hidden sm:inline">Syllabus</span>
            </a>
          </Button>
        </div>
      </div>

      {/* Overall Progress - Styled like the reference and responsive */}
      <div className="bg-card rounded-xl p-4 sm:p-6 border animate-scale-in">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">
              Overall Progress
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {completedCount} of {totalCount} objectives completed
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>{completedCount} done</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <Circle className="h-4 w-4" />
              <span>{remainingCount} remaining</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-primary">
              {Math.round(totalProgress)}%
            </span>
          </div>
        </div>
        <div className="mb-1">
          <Progress
            value={totalProgress}
            className="h-2 sm:h-3 rounded-full bg-muted"
          />
        </div>
        <div className="flex sm:hidden items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-primary" />
            <span>{completedCount} done</span>
          </div>
          <div className="flex items-center gap-1">
            <Circle className="h-3 w-3" />
            <span>{remainingCount} remaining</span>
          </div>
        </div>
      </div>

      {/* Units - More responsive spacing */}
      <div className="space-y-4 sm:space-y-6">
        {units.map((unit, index) => (
          <div key={unit.id} className="animate-fade-in">
            <SyllabusUnit
              unit={unit}
              progress={getUnitProgress(unit.id)}
              settings={settings}
              onObjectiveUpdate={handleObjectiveUpdate}
              onObjectiveDelete={handleObjectiveDelete}
              onTopicDelete={handleTopicDelete}
              onTopicComplete={handleTopicComplete}
            />
          </div>
        ))}
      </div>

      {/* Dialogs */}
      <SyllabusSettings
        open={showSettings}
        onOpenChange={setShowSettings}
        settings={settings}
        onSettingsChange={updateSettings}
      />

      <AddObjectiveDialog
        open={showAddObjective}
        onOpenChange={setShowAddObjective}
        onAddObjective={handleAddCustomObjective}
        units={units}
      />

      <ExportDialog
        open={showExport}
        onOpenChange={setShowExport}
        units={units}
        totalProgress={totalProgress}
      />
    </div>
  );
};

export default SyllabusChecklist;
