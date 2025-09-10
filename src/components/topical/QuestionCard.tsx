import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  EyeOff,
  ExternalLink,
  Lightbulb,
  AlertTriangle,
} from "lucide-react";
import { TopicalQuestion } from "@/data/topicalQuestions";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface QuestionCardProps {
  question: TopicalQuestion;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const navigate = useNavigate();

  const formatSession = (session: string) => {
    return session.charAt(0).toUpperCase() + session.slice(1);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatText = (text: string) => {
    // Convert markdown-like formatting to HTML
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
      .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italic
      .replace(/__(.*?)__/g, "<mark>$1</mark>"); // Highlight
  };

  const goToPaper = () => {
    navigate(`/pdf-viewer/${question.paperId}`);
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline">
              {formatSession(question.session)} {question.year}
            </Badge>
            <Badge variant="secondary">Q{question.questionNumber}</Badge>
            <Badge variant="secondary">
              {question.marks} mark{question.marks !== 1 ? "s" : ""}
            </Badge>
            <Badge
              variant="outline"
              className={getDifficultyColor(question.difficulty)}
            >
              {question.difficulty}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            {question.examinerTips && question.examinerTips.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Lightbulb className="h-4 w-4 text-blue-500" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <div className="space-y-1">
                      <p className="font-medium">Examiner Tips:</p>
                      <ul className="text-sm space-y-1">
                        {question.examinerTips.map((tip, index) => (
                          <li key={index}>• {tip}</li>
                        ))}
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {question.commonMisconceptions &&
              question.commonMisconceptions.length > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <div className="space-y-1">
                        <p className="font-medium">Common Misconceptions:</p>
                        <ul className="text-sm space-y-1">
                          {question.commonMisconceptions.map(
                            (misconception, index) => (
                              <li key={index}>• {misconception}</li>
                            )
                          )}
                        </ul>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPaper}
              className="h-8 w-8 p-0"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Question:</h3>
          <div
            className="text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatText(question.question) }}
          />
          {question.hasImages && (
            <p className="text-xs text-muted-foreground mt-2 italic">
              * This question includes diagrams/images in the original paper
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-xs text-muted-foreground">
            {question.topic} {question.subtopic && `• ${question.subtopic}`} •{" "}
            {question.syllabusObjective}
          </div>
          <Button
            variant={showAnswer ? "secondary" : "default"}
            size="sm"
            onClick={() => setShowAnswer(!showAnswer)}
          >
            {showAnswer ? (
              <EyeOff className="h-4 w-4 mr-1" />
            ) : (
              <Eye className="h-4 w-4 mr-1" />
            )}
            {showAnswer ? "Hide Answer" : "Show Answer"}
          </Button>
        </div>

        {showAnswer && (
          <div className="bg-muted/30 p-4 rounded-lg border-l-4 border-primary">
            <h4 className="font-medium mb-2 text-primary">Answer:</h4>
            <div
              className="text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formatText(question.answer) }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
