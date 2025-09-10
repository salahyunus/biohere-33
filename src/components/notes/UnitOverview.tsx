import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Send,
  Target,
} from "lucide-react";
import { NotesUnit } from "@/hooks/useNotesData";
import { useState } from "react";

interface UnitOverviewProps {
  unit: NotesUnit;
  onNavigateToLesson: (unitId: string, lessonId: string) => void;
}

export const UnitOverview: React.FC<UnitOverviewProps> = ({
  unit,
  onNavigateToLesson,
}) => {
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>(
    {}
  );
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");

  const toggleTopic = (topicId: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  const handleSubmitFeedback = () => {
    console.log("Submitting feedback:", { email, feedback });
    setFeedback("");
    setEmail("");
  };

  const getTopicProgress = (topicId: string) => {
    const topic = unit.topics.find((t) => t.id === topicId);
    if (!topic) return 0;

    const completedLessons = topic.lessons.filter((l) => l.completed).length;
    return topic.lessons.length > 0
      ? (completedLessons / topic.lessons.length) * 100
      : 0;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">{unit.title}</h1>
        <p className="text-lg text-muted-foreground">{unit.description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Quick Links
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            <BookOpen className="h-4 w-4 mr-2" />
            View Syllabus Objectives
            <ExternalLink className="h-4 w-4 ml-auto" />
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Unit Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {unit.resources.map((resource, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start h-auto p-4"
              >
                <div className="text-left">
                  <div className="font-medium">{resource.title}</div>
                  <Badge variant="secondary" className="mt-1">
                    {resource.type}
                  </Badge>
                </div>
                <ExternalLink className="h-4 w-4 ml-auto" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Topics & Lessons</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {unit.topics.map((topic) => {
            const isExpanded = expandedTopics[topic.id];
            const progress = getTopicProgress(topic.id);

            return (
              <div key={topic.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    onClick={() => toggleTopic(topic.id)}
                    className="flex-1 justify-start font-medium"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 mr-2" />
                    ) : (
                      <ChevronRight className="h-4 w-4 mr-2" />
                    )}
                    {topic.title}
                  </Button>
                  {progress > 0 && (
                    <Badge variant="secondary">
                      {Math.round(progress)}% Complete
                    </Badge>
                  )}
                </div>

                {progress > 0 && <Progress value={progress} className="ml-6" />}

                {isExpanded && (
                  <div className="ml-6 space-y-2">
                    {topic.lessons.map((lesson) => (
                      <Button
                        key={lesson.id}
                        variant="ghost"
                        onClick={() => onNavigateToLesson(unit.id, lesson.id)}
                        className="w-full justify-start text-sm"
                      >
                        {lesson.title}
                        {lesson.completed && (
                          <Badge
                            variant="secondary"
                            className="ml-auto text-green-600"
                          >
                            Complete
                          </Badge>
                        )}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feedback & Support</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email (optional)</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Feedback or Report Issues
            </label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your feedback or report any mistakes you've found..."
              rows={4}
            />
          </div>

          <Button onClick={handleSubmitFeedback} disabled={!feedback.trim()}>
            <Send className="h-4 w-4 mr-2" />
            Submit Feedback
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
