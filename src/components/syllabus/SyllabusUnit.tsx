import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  SyllabusUnit as SyllabusUnitType,
  SyllabusSettings,
  SyllabusObjective,
} from "@/hooks/useSyllabusData";
import { SyllabusTopic } from "./SyllabusTopic";

interface SyllabusUnitProps {
  unit: SyllabusUnitType;
  progress: number;
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
}

export const SyllabusUnit: React.FC<SyllabusUnitProps> = ({
  unit,
  progress,
  settings,
  onObjectiveUpdate,
  onObjectiveDelete,
  onTopicDelete,
  onTopicComplete,
}) => {
  return (
    <Card className="hover-scale">
      <CardHeader>
        <CardTitle>
          <div>
            <h2 className="text-xl font-bold">{unit.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {unit.description}
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {unit.topics.map((topic, index) => (
          <div
            key={topic.id}
            className="animate-fade-in"
          >
            <SyllabusTopic
              topic={topic}
              unitId={unit.id}
              settings={settings}
              onObjectiveUpdate={onObjectiveUpdate}
              onObjectiveDelete={onObjectiveDelete}
              onTopicDelete={onTopicDelete}
              onTopicComplete={onTopicComplete}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
