import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Eye,
  EyeOff,
  FileText,
  Save,
  Star,
  MessageSquare,
  ExternalLink,
  Clock,
} from "lucide-react";
import { QuizQuestion as QuizQuestionType } from "@/data/quizQuestions";
import { cn } from "@/lib/utils";

interface QuizQuestionProps {
  question: QuizQuestionType;
  showAnswer: boolean;
  onToggleAnswer: () => void;
  onSaveQuestion: (question: QuizQuestionType) => void;
  onAddComment: (questionId: string, comment: string) => void;
  onToggleImportant: (questionId: string) => void;
  isImportant?: boolean;
  comment?: string;
  isCollapsible?: boolean;
  showMetadata?: boolean;
  selectedAnswer?: string;
  onAnswerSelect?: (answer: string) => void;
  isAnswerMode?: boolean;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  showAnswer,
  onToggleAnswer,
  onSaveQuestion,
  onAddComment,
  onToggleImportant,
  isImportant = false,
  comment = "",
  isCollapsible = true,
  showMetadata = true,
  selectedAnswer,
  onAnswerSelect,
  isAnswerMode = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(!isCollapsible);
  const [commentText, setCommentText] = useState(comment);
  const [showCommentInput, setShowCommentInput] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "hard":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>");
  };

  const handleSaveComment = () => {
    onAddComment(question.id, commentText);
    setShowCommentInput(false);
  };

  const renderMCQOptions = () => {
    if (question.questionType !== "mcq" || !question.mcqOptions) return null;

    return (
      <div className="space-y-2 mt-4">
        {Object.entries(question.mcqOptions).map(([key, value]) => {
          if (key === "correctAnswer") return null;

          const isSelected = selectedAnswer === key;
          const isCorrect = key === question.mcqOptions?.correctAnswer;
          const showCorrect = showAnswer || isAnswerMode;

          return (
            <div
              key={key}
              className={cn(
                "p-3 border rounded-lg cursor-pointer transition-colors",
                isSelected && "border-primary bg-primary/10",
                showCorrect && isCorrect && "border-green-500 bg-green-50",
                showCorrect &&
                  isSelected &&
                  !isCorrect &&
                  "border-red-500 bg-red-50"
              )}
              onClick={() => onAnswerSelect?.(key)}
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">{key}.</span>
                <span>{value}</span>
                {showCorrect && isCorrect && (
                  <Badge variant="secondary" className="ml-auto text-green-700">
                    Correct
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card className="mb-4">
      <CardHeader
        className={cn("cursor-pointer", isCollapsible && "hover:bg-muted/50")}
        onClick={() => isCollapsible && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "w-3 h-3 rounded-full mt-1",
                getDifficultyColor(question.difficulty)
              )}
              title={`${question.difficulty} difficulty`}
            />
            <div>
              <CardTitle className="text-lg">
                Question {question.questionNumber}
                {showMetadata && (
                  <Badge variant="outline" className="ml-2">
                    {question.marks} mark{question.marks !== 1 ? "s" : ""}
                  </Badge>
                )}
              </CardTitle>
              {showMetadata && (
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>
                    {question.year} {question.session}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {question.topic}
                  </Badge>
                  {question.subtopic && (
                    <Badge variant="outline" className="text-xs">
                      {question.subtopic}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {question.questionType}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={isImportant ? "default" : "ghost"}
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggleImportant(question.id);
              }}
            >
              <Star className={cn("h-4 w-4", isImportant && "fill-current")} />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowCommentInput(!showCommentInput);
              }}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onSaveQuestion(question);
              }}
            >
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          <div
            className="text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatText(question.question) }}
          />

          {question.hasImages && question.imageUrl && (
            <div className="border rounded-lg overflow-hidden">
              <img
                src={question.imageUrl}
                alt="Question diagram"
                className="w-full h-auto max-h-64 object-contain"
              />
            </div>
          )}

          {question.parts && (
            <div className="space-y-3 ml-4 border-l-2 border-muted pl-4">
              {question.parts.map((part) => (
                <div key={part.partId} className="space-y-2">
                  <div className="font-medium text-sm">
                    {part.partLabel} ({part.marks} mark
                    {part.marks !== 1 ? "s" : ""})
                  </div>
                  <div
                    className="text-sm"
                    dangerouslySetInnerHTML={{
                      __html: formatText(part.question),
                    }}
                  />
                  {showAnswer && (
                    <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                      <strong>Answer:</strong> {part.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {renderMCQOptions()}

          {showCommentInput && (
            <div className="space-y-2">
              <Textarea
                placeholder="Add a comment or note about this question..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="min-h-[60px]"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveComment}>
                  Save Comment
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowCommentInput(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {comment && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-blue-800">
                Your Comment:
              </div>
              <div className="text-sm text-blue-700">{comment}</div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              {!isAnswerMode && (
                <Button
                  variant={showAnswer ? "secondary" : "outline"}
                  size="sm"
                  onClick={onToggleAnswer}
                >
                  {showAnswer ? (
                    <EyeOff className="h-4 w-4 mr-2" />
                  ) : (
                    <Eye className="h-4 w-4 mr-2" />
                  )}
                  {showAnswer ? "Hide Answer" : "Show Answer"}
                </Button>
              )}

              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Question Paper
              </Button>

              <Button variant="ghost" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Mark Scheme
              </Button>
            </div>
          </div>

          {showAnswer && !question.parts && (
            <div className="bg-muted p-4 rounded-lg">
              <div className="font-medium text-sm mb-2">Answer:</div>
              <div
                className="text-sm leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: formatText(question.answer),
                }}
              />
              {question.hasImages && question.answerImageUrl && (
                <div className="mt-3 border rounded-lg overflow-hidden">
                  <img
                    src={question.answerImageUrl}
                    alt="Answer diagram"
                    className="w-full h-auto max-h-48 object-contain"
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};
