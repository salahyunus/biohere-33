import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SyllabusTopic as SyllabusTopicType,
  SyllabusSettings,
  SyllabusObjective,
} from "@/hooks/useSyllabusData";
import { SyllabusObjectiveItem } from "./SyllabusObjectiveItem";

interface SyllabusTopicProps {
  topic: SyllabusTopicType;
  unitId: string;
  settings: SyllabusSettings;
  onObjectiveUpdate: (
    unitId: string,
    topicId: string,
    objectiveId: string,
    updates: Partial<SyllabusObjective>,
    subtopicId?: string
  ) => void;
  onObjectiveDelete: (
    unitId: string,
    topicId: string,
    objectiveId: string,
    subtopicId?: string
  ) => void;
  onTopicDelete?: (unitId: string, topicId: string) => void;
  onTopicComplete: () => void;
  isSubtopic?: boolean;
  parentTopicId?: string;
}

export const SyllabusTopic: React.FC<SyllabusTopicProps> = ({
  topic,
  unitId,
  settings,
  onObjectiveUpdate,
  onObjectiveDelete,
  onTopicDelete,
  onTopicComplete,
  isSubtopic = false,
  parentTopicId,
}) => {
  const [isOpen, setIsOpen] = useState(topic.expanded || false);
  const [wasCompleted, setWasCompleted] = useState(false);

  const completedObjectives = topic.objectives.filter(
    (obj) => obj.completed
  ).length;
  const totalObjectives =
    topic.objectives.length +
    (topic.subtopics?.reduce(
      (acc, subtopic) => acc + subtopic.objectives.length,
      0
    ) || 0);
  const completedSubtopicObjectives =
    topic.subtopics?.reduce(
      (acc, subtopic) =>
        acc + subtopic.objectives.filter((obj) => obj.completed).length,
      0
    ) || 0;
  const totalCompleted = completedObjectives + completedSubtopicObjectives;
  const isTopicComplete =
    totalObjectives > 0 && totalCompleted === totalObjectives;

  useEffect(() => {
    if (isTopicComplete && !wasCompleted && totalObjectives > 0) {
      setWasCompleted(true);
      onTopicComplete();
    } else if (!isTopicComplete && wasCompleted) {
      setWasCompleted(false);
    }
  }, [isTopicComplete, wasCompleted, totalObjectives, onTopicComplete]);

  useEffect(() => {
    if (settings.expandAll) {
      setIsOpen(true);
    } else if (settings.collapseAll) {
      setIsOpen(false);
    }
  }, [settings.expandAll, settings.collapseAll]);

  const handleObjectiveUpdate = (
    objectiveId: string,
    updates: Partial<SyllabusObjective>,
    subtopicId?: string
  ) => {
    onObjectiveUpdate(
      unitId,
      parentTopicId || topic.id,
      objectiveId,
      updates,
      subtopicId
    );
  };

  const handleObjectiveDelete = (objectiveId: string, subtopicId?: string) => {
    onObjectiveDelete(
      unitId,
      parentTopicId || topic.id,
      objectiveId,
      subtopicId
    );
  };

  const handleTopicDelete = () => {
    if (onTopicDelete) {
      onTopicDelete(unitId, topic.id);
    }
  };

  if (settings.expandAll) {
    return (
      <div
        className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
          isSubtopic ? "ml-6 bg-muted/20" : "bg-card"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className={`font-semibold ${isSubtopic ? "text-base" : "text-lg"}`}
          >
            {topic.title}
          </h3>
          {topic.isCustom && onTopicDelete && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={handleTopicDelete}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Topic
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="space-y-2">
          {topic.objectives.map((objective, index) => (
            <div key={objective.id} className="animate-fade-in">
              <SyllabusObjectiveItem
                objective={objective}
                settings={settings}
                onUpdate={(updates) =>
                  handleObjectiveUpdate(
                    objective.id,
                    updates,
                    isSubtopic ? topic.id : undefined
                  )
                }
                onDelete={
                  objective.isCustom
                    ? () =>
                        handleObjectiveDelete(
                          objective.id,
                          isSubtopic ? topic.id : undefined
                        )
                    : undefined
                }
              />
            </div>
          ))}
        </div>

        {topic.subtopics && (
          <div className="mt-4 space-y-4">
            {topic.subtopics.map((subtopic, index) => (
              <div key={subtopic.id} className="animate-fade-in">
                <SyllabusTopic
                  topic={subtopic}
                  unitId={unitId}
                  settings={settings}
                  onObjectiveUpdate={onObjectiveUpdate}
                  onObjectiveDelete={onObjectiveDelete}
                  onTopicComplete={onTopicComplete}
                  isSubtopic={true}
                  parentTopicId={topic.id}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`border rounded-lg transition-all duration-200 hover:shadow-md ${
        isSubtopic ? "ml-6 bg-muted/20" : "bg-card"
      }`}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="flex-1 justify-between p-4 h-auto hover:bg-muted/50 transition-colors duration-200"
            >
              <h3
                className={`font-semibold text-left ${
                  isSubtopic ? "text-base" : "text-lg"
                }`}
              >
                {topic.title}
              </h3>
              <div className="transition-transform duration-200">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </Button>
          </CollapsibleTrigger>

          {topic.isCustom && onTopicDelete && (
            <div className="pr-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={handleTopicDelete}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Topic
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        <CollapsibleContent className="px-4 pb-4 ">
          <div className="space-y-2">
            {topic.objectives.map((objective, index) => (
              <div key={objective.id} className="animate-fade-in">
                <SyllabusObjectiveItem
                  objective={objective}
                  settings={settings}
                  onUpdate={(updates) =>
                    handleObjectiveUpdate(
                      objective.id,
                      updates,
                      isSubtopic ? topic.id : undefined
                    )
                  }
                  onDelete={
                    objective.isCustom
                      ? () =>
                          handleObjectiveDelete(
                            objective.id,
                            isSubtopic ? topic.id : undefined
                          )
                      : undefined
                  }
                />
              </div>
            ))}
          </div>

          {topic.subtopics && (
            <div className="mt-4 space-y-4">
              {topic.subtopics.map((subtopic, index) => (
                <div key={subtopic.id} className="animate-fade-in">
                  <SyllabusTopic
                    topic={subtopic}
                    unitId={unitId}
                    settings={settings}
                    onObjectiveUpdate={onObjectiveUpdate}
                    onObjectiveDelete={onObjectiveDelete}
                    onTopicComplete={onTopicComplete}
                    isSubtopic={true}
                    parentTopicId={topic.id}
                  />
                </div>
              ))}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
