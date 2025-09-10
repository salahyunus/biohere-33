import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { NotesLesson } from "@/hooks/useNotesData";
import { ContentRenderer } from "./ContentRenderer";
import { Target, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface NotesContentProps {
  lesson: NotesLesson;
  onToggleComplete: () => void;
}

export const NotesContent: React.FC<NotesContentProps> = ({
  lesson,
  onToggleComplete,
}) => {
  const [showObjectives, setShowObjectives] = useState(lesson.isFirstInTopic);

  const objectivesProgress = lesson.syllabusObjectives
    ? (lesson.syllabusObjectives.filter((obj) => obj.completed).length /
        lesson.syllabusObjectives.length) *
      100
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {lesson.syllabusObjectives && lesson.isFirstInTopic && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Syllabus Objectives
              </CardTitle>
              <button
                onClick={() => setShowObjectives(!showObjectives)}
                className="p-1 hover:bg-accent rounded"
              >
                {showObjectives ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            </div>
            {showObjectives && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Progress
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(objectivesProgress)}%
                  </span>
                </div>
                <Progress value={objectivesProgress} />
              </div>
            )}
          </CardHeader>
          {showObjectives && (
            <CardContent>
              <div className="space-y-3">
                {lesson.syllabusObjectives.map((objective) => (
                  <div
                    key={objective.id}
                    className="flex items-start space-x-2"
                  >
                    <Checkbox
                      id={objective.id}
                      checked={objective.completed}
                      onCheckedChange={() => {
                        // Toggle objective completion
                        console.log("Toggle objective:", objective.id);
                      }}
                    />
                    <label
                      htmlFor={objective.id}
                      className="text-sm leading-relaxed cursor-pointer"
                    >
                      {objective.text}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      <div className="space-y-6">
        {lesson.content.map((content) => (
          <ContentRenderer key={content.id} content={content} />
        ))}
      </div>
    </div>
  );
};
