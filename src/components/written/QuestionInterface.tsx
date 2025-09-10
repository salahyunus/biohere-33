import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Image,
  RotateCcw,
} from "lucide-react";
import {
  WrittenQuestion,
  WrittenProgress,
  UserAnswer,
} from "@/data/writtenPapers";
import { cn } from "@/lib/utils";

interface QuestionInterfaceProps {
  question: WrittenQuestion;
  userAnswer: UserAnswer | undefined;
  progress: WrittenProgress;
  showModelAnswer?: boolean;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  onReset?: () => void;
  onNext?: () => void;
  onSubmitAll?: () => void;
  canSubmit: boolean;
  isLastQuestion?: boolean;
}

export const QuestionInterface: React.FC<QuestionInterfaceProps> = ({
  question,
  userAnswer,
  progress,
  showModelAnswer = false,
  onAnswerChange,
  onSubmit,
  onReset,
  onNext,
  onSubmitAll,
  canSubmit,
  isLastQuestion = false,
}) => {
  const [showModel, setShowModel] = useState(showModelAnswer);

  // Default userAnswer if undefined
  const safeUserAnswer = userAnswer || {
    questionId: question.id,
    answer: "",
    maxMarks: question.totalMarks,
    isSubmitted: false,
  };

  const formatText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>");
  };

  const highlightKeywords = (text: string, isModelAnswer = false) => {
    let highlightedText = text;

    question.markScheme.forEach((point) => {
      const allKeywords = [...point.keywords, ...(point.synonyms || [])];

      allKeywords.forEach((keyword) => {
        const regex = new RegExp(
          `\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
          "gi"
        );
        const colorClass = isModelAnswer
          ? "bg-green-100 text-green-800 px-1 rounded"
          : "bg-blue-100 text-blue-800 px-1 rounded font-medium";
        highlightedText = highlightedText.replace(
          regex,
          `<span class="${colorClass}">$&</span>`
        );
      });
    });

    return highlightedText;
  };

  const getScoreColor = (awarded: number, total: number) => {
    const percentage = (awarded / total) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const shouldDisableTextarea = () => {
    if (progress.submissionMode === "question-by-question") {
      return safeUserAnswer.isSubmitted;
    }
    return progress.isCompleted;
  };

  const getNextButtonText = () => {
    if (progress.submissionMode === "submit-at-end") {
      return isLastQuestion ? "Submit All Answers" : "Next Question";
    }
    return isLastQuestion ? "Complete Paper" : "Next Question";
  };

  const handleNextOrSubmitAll = () => {
    if (
      progress.submissionMode === "submit-at-end" &&
      isLastQuestion &&
      onSubmitAll
    ) {
      onSubmitAll();
    } else if (onNext) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">
                Question {question.number}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">
                  {question.totalMarks} mark
                  {question.totalMarks !== 1 ? "s" : ""}
                </Badge>
                {safeUserAnswer.isSubmitted && (
                  <Badge
                    variant="secondary"
                    className={getScoreColor(
                      safeUserAnswer.marksAwarded || 0,
                      question.totalMarks
                    )}
                  >
                    {safeUserAnswer.marksAwarded}/{question.totalMarks}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className="text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatText(question.question) }}
          />

          {question.hasImages && (
            <div className="border rounded-lg overflow-hidden">
              <img
                src="https://dummyimage.com/600x400/000/fff"
                alt="Question diagram"
                className="w-full h-auto"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Answer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={safeUserAnswer.answer}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder="Type your answer here... (optional)"
            className="min-h-[120px]"
            disabled={shouldDisableTextarea()}
          />

          {safeUserAnswer.isSubmitted && safeUserAnswer.answer && (
            <div className="mt-2 p-3 bg-muted rounded-md">
              <p className="text-sm font-medium mb-2 text-muted-foreground">
                Your answer with highlighted mark points:
              </p>
              <div
                className="text-sm leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: highlightKeywords(safeUserAnswer.answer, false),
                }}
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {safeUserAnswer.answer.length} characters
            </div>

            <div className="flex items-center gap-2">
              {safeUserAnswer.isSubmitted &&
                onReset &&
                progress.submissionMode === "question-by-question" && (
                  <Button onClick={onReset} variant="outline" size="sm">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset Answer
                  </Button>
                )}

              {progress.submissionMode === "question-by-question" ? (
                safeUserAnswer.isSubmitted ? (
                  <Button onClick={onNext} disabled={!onNext}>
                    {getNextButtonText()}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={onSubmit} disabled={!canSubmit}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Submit Answer
                  </Button>
                )
              ) : (
                <Button
                  onClick={handleNextOrSubmitAll}
                  disabled={!onNext && (!onSubmitAll || !isLastQuestion)}
                >
                  {isLastQuestion ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Submit All Answers
                    </>
                  ) : (
                    <>
                      {getNextButtonText()}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {(safeUserAnswer.isSubmitted ||
        showModelAnswer ||
        progress.isCompleted) && (
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base text-primary">
                Model Answer
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowModel(!showModel)}
              >
                {showModel ? (
                  <EyeOff className="h-4 w-4 mr-1" />
                ) : (
                  <Eye className="h-4 w-4 mr-1" />
                )}
                {showModel ? "Hide" : "Show"}
              </Button>
            </div>
          </CardHeader>
          {showModel && (
            <CardContent>
              <div
                className="text-sm leading-relaxed text-muted-foreground"
                dangerouslySetInnerHTML={{
                  __html: highlightKeywords(
                    formatText(question.modelAnswer),
                    true
                  ),
                }}
              />
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
};
