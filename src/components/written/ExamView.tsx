import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { WrittenQuestion, WrittenProgress } from "@/data/writtenPapers";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

interface ExamViewProps {
  questions: WrittenQuestion[];
  progress: WrittenProgress;
  currentPage: number;
  questionsPerPage: number;
  onAnswerChange: (questionId: string, answer: string) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  onSubmitAll: () => void;
  isLastPage: boolean;
}

export const ExamView: React.FC<ExamViewProps> = ({
  questions,
  progress,
  currentPage,
  questionsPerPage,
  onAnswerChange,
  onPrevPage,
  onNextPage,
  onSubmitAll,
  isLastPage,
}) => {
  const startIndex = currentPage * questionsPerPage;
  const endIndex = Math.min(startIndex + questionsPerPage, questions.length);
  const pageQuestions = questions.slice(startIndex, endIndex);

  const formatText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Page {currentPage + 1} of{" "}
          {Math.ceil(questions.length / questionsPerPage)}
        </h2>
        <Badge variant="outline">
          Questions {startIndex + 1}-{endIndex} of {questions.length}
        </Badge>
      </div>

      <div className="space-y-8">
        {pageQuestions.map((question, index) => {
          const userAnswer = progress.answers[question.id];

          return (
            <Card key={question.id} className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Question {question.number}
                    </CardTitle>
                    <Badge variant="outline" className="mt-2">
                      {question.totalMarks} mark
                      {question.totalMarks !== 1 ? "s" : ""}
                    </Badge>
                    {userAnswer?.isSubmitted && (
                      <Badge variant="secondary" className="mt-2 ml-2">
                        Submitted: {userAnswer.marksAwarded || 0}/
                        {question.totalMarks}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: formatText(question.question),
                  }}
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

                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Answer:</label>
                  <Textarea
                    value={userAnswer?.answer || ""}
                    onChange={(e) =>
                      onAnswerChange(question.id, e.target.value)
                    }
                    placeholder="Type your answer here... (optional)"
                    className="min-h-[100px]"
                    disabled={userAnswer?.isSubmitted}
                  />
                  <div className="text-xs text-muted-foreground">
                    {(userAnswer?.answer || "").length} characters
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-6 border-t">
        <Button
          variant="outline"
          onClick={onPrevPage}
          disabled={currentPage === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous Page
        </Button>

        <div className="text-sm text-muted-foreground">
          Page {currentPage + 1} of{" "}
          {Math.ceil(questions.length / questionsPerPage)}
        </div>

        {isLastPage ? (
          <Button
            onClick={onSubmitAll}
            disabled={progress.isCompleted}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            {progress.isCompleted ? "View Results" : "Submit Exam"}
          </Button>
        ) : (
          <Button onClick={onNextPage}>
            Next Page
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};
