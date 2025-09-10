import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  GripVertical,
  Folder,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { useSyllabusData } from "@/hooks/useSyllabusData";

interface TopicsSidebarProps {
  onTopicDrop: (topicData: any) => void;
}

export const TopicsSidebar: React.FC<TopicsSidebarProps> = ({
  onTopicDrop,
}) => {
  const { units } = useSyllabusData();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>(
    {}
  );
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>(
    {}
  );

  const toggleUnit = (unitId: string) => {
    setExpandedUnits((prev) => ({
      ...prev,
      [unitId]: !prev[unitId],
    }));
  };

  const toggleTopic = (topicId: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    itemData: any
  ) => {
    e.dataTransfer.setData("application/json", JSON.stringify(itemData));
  };

  if (isCollapsed) {
    return (
      <div className="w-12 border-r bg-card">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(false)}
          className="m-2"
        >
          <BookOpen className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-80 border-r bg-card overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Syllabus Topics</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(true)}
            className="h-6 w-6"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Drag topics to create study tasks
        </p>
      </div>

      <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
        <div className="p-2 space-y-2">
          {units.map((unit) => (
            <Collapsible
              key={unit.id}
              open={expandedUnits[unit.id]}
              onOpenChange={() => toggleUnit(unit.id)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start p-2 h-auto hover:bg-muted/50"
                >
                  {expandedUnits[unit.id] ? (
                    <ChevronDown className="h-4 w-4 mr-2" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-2" />
                  )}
                  <Folder className="h-4 w-4 mr-2 text-orange-500" />
                  <span className="font-medium text-left flex-1">
                    {unit.title}
                  </span>
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className="ml-4 space-y-1">
                {unit.topics.map((topic) => (
                  <div key={topic.id}>
                    <Collapsible
                      open={expandedTopics[topic.id]}
                      onOpenChange={() => toggleTopic(topic.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start p-2 h-auto hover:bg-muted/50"
                        >
                          {expandedTopics[topic.id] ? (
                            <ChevronDown className="h-3 w-3 mr-2" />
                          ) : (
                            <ChevronRight className="h-3 w-3 mr-2" />
                          )}
                          <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
                          <span className="text-sm text-left flex-1">
                            {topic.title}
                          </span>
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {topic.objectives.length +
                              (topic.subtopics?.reduce(
                                (acc, st) => acc + st.objectives.length,
                                0
                              ) || 0)}
                          </Badge>
                        </Button>
                      </CollapsibleTrigger>

                      <CollapsibleContent className="ml-4 space-y-1">
                        {/* Main topic objectives */}
                        {topic.objectives.map((objective) => (
                          <div
                            key={objective.id}
                            draggable
                            onDragStart={(e) =>
                              handleDragStart(e, {
                                type: "topic",
                                id: objective.id,
                                title: objective.text,
                                topicId: topic.id,
                                unitId: unit.id,
                                parentTopicName: topic.title,
                              })
                            }
                            className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-grab active:cursor-grabbing transition-colors group"
                          >
                            <GripVertical className="h-3 w-3 text-muted-foreground group-hover:text-foreground" />
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-xs text-left flex-1">
                              {objective.text}
                            </span>
                          </div>
                        ))}

                        {/* Subtopics */}
                        {topic.subtopics?.map((subtopic) => (
                          <div key={subtopic.id} className="ml-4">
                            <div className="flex items-center gap-2 p-1 text-xs font-medium text-muted-foreground">
                              <BookOpen className="h-3 w-3" />
                              {subtopic.title}
                            </div>
                            {subtopic.objectives.map((objective) => (
                              <div
                                key={objective.id}
                                draggable
                                onDragStart={(e) =>
                                  handleDragStart(e, {
                                    type: "topic",
                                    id: objective.id,
                                    title: objective.text,
                                    topicId: subtopic.id,
                                    unitId: unit.id,
                                    parentTopicName: topic.title,
                                    isSubtopic: true,
                                  })
                                }
                                className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-grab active:cursor-grabbing transition-colors group ml-2"
                              >
                                <GripVertical className="h-3 w-3 text-muted-foreground group-hover:text-foreground" />
                                <div className="w-2 h-2 rounded-full bg-purple-500" />
                                <span className="text-xs text-left flex-1">
                                  {objective.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </div>
  );
};
