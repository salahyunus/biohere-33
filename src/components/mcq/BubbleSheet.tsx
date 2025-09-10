import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface BubbleSheetProps {
  totalQuestions: number;
  answers: Record<number, string>;
  correctAnswers?: string;
  onAnswerSelect: (questionNumber: number, answer: string) => void;
  isSubmitted?: boolean;
  showResults?: boolean;
  fullWidth?: boolean;
  compactMode?: boolean;
  compactCircles?: boolean;
  optionLayout?: "horizontal" | "vertical";
  markOnSolve?: boolean;
  markedQuestions?: Record<number, boolean>;
  showScrollButton?: boolean;
  className?: string;
}

export const BubbleSheet: React.FC<BubbleSheetProps> = ({
  totalQuestions,
  answers,
  correctAnswers,
  onAnswerSelect,
  isSubmitted = false,
  showResults = false,
  fullWidth = true,
  compactMode = false,
  compactCircles = false,
  optionLayout = "horizontal",
  markOnSolve = false,
  markedQuestions = {},
  showScrollButton = true,
  className,
}) => {
  const options = ["A", "B", "C", "D"];
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const checkScrollPosition = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Check if user is near the bottom (within 100px)
      setIsAtBottom(scrollTop + windowHeight >= documentHeight - 100);
    };

    window.addEventListener("scroll", checkScrollPosition);
    checkScrollPosition(); // Check initial position

    return () => window.removeEventListener("scroll", checkScrollPosition);
  }, []);

  const scrollToTopOrBottom = () => {
    if (isAtBottom) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  };

  const getOptionClass = (questionNum: number, option: string) => {
    const userAnswer = answers[questionNum];
    const correctAnswer = correctAnswers?.[questionNum - 1];
    const isSelected = userAnswer === option;
    const isMarked = markedQuestions[questionNum];

    if (compactCircles) {
      const baseClasses =
        "w-12 h-12 rounded-full border-2 transition-all duration-200 font-semibold text-lg hover:scale-110 flex items-center justify-center";

      // Mark on solve mode with instant feedback
      if (markOnSolve && isSelected && isMarked) {
        const isCorrect = correctAnswer === option;
        if (isCorrect) {
          return cn(
            baseClasses,
            "bg-green-500 text-white border-green-500 shadow-lg"
          );
        } else {
          return cn(
            baseClasses,
            "bg-red-500 text-white border-red-500 shadow-lg"
          );
        }
      }

      // Show results mode or submitted
      if (showResults && correctAnswer) {
        if (correctAnswer === option) {
          return cn(
            baseClasses,
            isSelected
              ? "bg-green-500 text-white border-green-500 shadow-lg" // User got it right
              : "bg-yellow-400 text-black border-yellow-500 shadow-md" // Show correct answer
          );
        } else if (isSelected) {
          return cn(
            baseClasses,
            "bg-red-500 text-white border-red-500 shadow-lg"
          );
        }
      }

      // Normal selection state
      if (isSelected) {
        return cn(
          baseClasses,
          "bg-primary text-primary-foreground border-primary shadow-lg"
        );
      }

      return cn(
        baseClasses,
        "border-muted-foreground hover:border-primary hover:bg-primary/10"
      );
    } else {
      const baseClasses =
        "h-16 rounded-lg border-2 transition-all duration-200 font-semibold text-xl hover:scale-105";

      // Mark on solve mode with instant feedback
      if (markOnSolve && isSelected && isMarked) {
        const isCorrect = correctAnswer === option;
        if (isCorrect) {
          return cn(
            baseClasses,
            "bg-green-500 text-white border-green-500 shadow-lg"
          );
        } else {
          return cn(
            baseClasses,
            "bg-red-500 text-white border-red-500 shadow-lg"
          );
        }
      }

      // Show results mode or submitted
      if (showResults && correctAnswer) {
        if (correctAnswer === option) {
          return cn(
            baseClasses,
            isSelected
              ? "bg-green-500 text-white border-green-500 shadow-lg" // User got it right
              : "bg-yellow-400 text-black border-yellow-500 shadow-md" // Show correct answer
          );
        } else if (isSelected) {
          return cn(
            baseClasses,
            "bg-red-500 text-white border-red-500 shadow-lg"
          );
        }
      }

      // Normal selection state
      if (isSelected) {
        return cn(
          baseClasses,
          "bg-primary text-primary-foreground border-primary shadow-lg"
        );
      }

      return cn(
        baseClasses,
        "border-muted-foreground hover:border-primary hover:bg-primary/10"
      );
    }
  };

  const getQuestionStatus = (questionNum: number) => {
    if (!showResults && !markOnSolve) return null;

    const userAnswer = answers[questionNum];
    const correctAnswer = correctAnswers?.[questionNum - 1];
    const isMarked = markedQuestions[questionNum];

    if (!userAnswer) return null;

    if (markOnSolve && !isMarked) return null;

    return userAnswer === correctAnswer ? "correct" : "incorrect";
  };

  const getOptionIcon = (questionNum: number, option: string) => {
    const userAnswer = answers[questionNum];
    const correctAnswer = correctAnswers?.[questionNum - 1];
    const isSelected = userAnswer === option;
    const isMarked = markedQuestions[questionNum];

    if (markOnSolve && isSelected && isMarked) {
      const isCorrect = correctAnswer === option;
      return isCorrect ? (
        <Check className="h-5 w-5" />
      ) : (
        <X className="h-5 w-5" />
      );
    }

    if (showResults && correctAnswer) {
      if (correctAnswer === option && isSelected) {
        return <Check className="h-5 w-5" />;
      } else if (isSelected && correctAnswer !== option) {
        return <X className="h-5 w-5" />;
      }
    }

    return null;
  };

  const shouldShowCorrectAnswer = (questionNum: number, option: string) => {
    if (!markOnSolve || !correctAnswers) return false;

    const userAnswer = answers[questionNum];
    const correctAnswer = correctAnswers[questionNum - 1];
    const isMarked = markedQuestions[questionNum];

    // Show correct answer in yellow if user answered incorrectly and question is marked
    return (
      isMarked &&
      userAnswer &&
      userAnswer !== correctAnswer &&
      correctAnswer === option
    );
  };

  const renderQuestionRow = (questionNum: number) => {
    const status = getQuestionStatus(questionNum);

    return (
      <div
        key={questionNum}
        className={cn(
          "p-6 rounded-xl transition-all duration-200",
          status === "correct" &&
            "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800",
          status === "incorrect" &&
            "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800",
          compactMode ? "py-3" : "py-6"
        )}
      >
        <div className="flex items-start gap-6">
          <div className="flex items-center gap-3 min-w-[100px]">
            <span
              className={cn("font-bold", compactMode ? "text-lg" : "text-2xl")}
            >
              {questionNum}.
            </span>
            {(showResults || markOnSolve) && status && (
              <div className="flex items-center">
                {status === "correct" ? (
                  <Check className="h-6 w-6 text-green-500" />
                ) : (
                  <X className="h-6 w-6 text-red-500" />
                )}
              </div>
            )}
          </div>

          <div className="flex-1">
            {compactCircles ? (
              <div className="flex gap-4 flex-wrap">
                {options.map((option) => (
                  <Button
                    key={option}
                    variant="ghost"
                    className={cn(
                      getOptionClass(questionNum, option),
                      "flex items-center justify-center gap-1 p-0"
                    )}
                    onClick={() =>
                      !isSubmitted && onAnswerSelect(questionNum, option)
                    }
                    disabled={isSubmitted}
                  >
                    {option}
                    {getOptionIcon(questionNum, option)}
                  </Button>
                ))}
              </div>
            ) : (
              <>
                {/* Desktop/Large screen layout */}
                <div className="hidden sm:block">
                  <div
                    className={cn(
                      "grid gap-4",
                      optionLayout === "vertical"
                        ? "grid-cols-1 max-w-xs"
                        : "grid-cols-4"
                    )}
                  >
                    {options.map((option) => (
                      <Button
                        key={option}
                        variant="ghost"
                        className={cn(
                          getOptionClass(questionNum, option),
                          "flex items-center justify-center gap-2"
                        )}
                        onClick={() =>
                          !isSubmitted && onAnswerSelect(questionNum, option)
                        }
                        disabled={isSubmitted}
                      >
                        {option}
                        {getOptionIcon(questionNum, option)}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Mobile layout - 2x2 grid */}
                <div className="block sm:hidden">
                  <div className="grid grid-cols-2 gap-3 max-w-sm">
                    {options.map((option) => (
                      <Button
                        key={option}
                        variant="ghost"
                        className={cn(
                          getOptionClass(questionNum, option),
                          "flex items-center justify-center gap-2"
                        )}
                        onClick={() =>
                          !isSubmitted && onAnswerSelect(questionNum, option)
                        }
                        disabled={isSubmitted}
                      >
                        {option}
                        {getOptionIcon(questionNum, option)}
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const getProgress = () => {
    const answered = Object.keys(answers).length;
    return Math.round((answered / totalQuestions) * 100);
  };

  const getScoreStats = () => {
    if (!correctAnswers) return null;

    const correct = Object.entries(answers).filter(
      ([q, a]) => correctAnswers[parseInt(q) - 1] === a
    ).length;

    const incorrect = Object.entries(answers).filter(
      ([q, a]) => correctAnswers[parseInt(q) - 1] !== a
    ).length;

    return { correct, incorrect };
  };

  return (
    <div
      className={cn(
        fullWidth ? "w-full min-h-screen" : "max-w-4xl mx-auto",
        "space-y-6 pb-20 relative",
        className
      )}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b pb-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xl">Answer Sheet</h3>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-sm">
              {Object.keys(answers).length}/{totalQuestions} answered
            </Badge>
            {!isSubmitted && (
              <Badge variant="secondary" className="text-sm">
                Progress:{" "}
                {Math.round(
                  (Object.keys(answers).length / totalQuestions) * 100
                )}
                %
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Questions Grid */}
      <div className={cn("space-y-4", compactMode && "space-y-2")}>
        {Array.from({ length: totalQuestions }, (_, i) =>
          renderQuestionRow(i + 1)
        )}
      </div>

      {/* Scroll button */}
      {showScrollButton && (
        <Button
          className="fixed bottom-6 left-6 z-20 rounded-full w-12 h-12 p-0 shadow-lg"
          onClick={scrollToTopOrBottom}
          variant="outline"
        >
          {isAtBottom ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </Button>
      )}

      {/* Results Summary */}
      {(showResults || isSubmitted) && correctAnswers && (
        <Card className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <div className="text-center space-y-4">
            <h4 className="text-xl font-bold">Test Results</h4>
            {(() => {
              let correct = 0;
              Object.entries(answers).forEach(([q, answer]) => {
                if (correctAnswers[parseInt(q) - 1] === answer) {
                  correct++;
                }
              });

              const incorrect = Object.entries(answers).filter(
                ([q, a]) => correctAnswers[parseInt(q) - 1] !== a
              ).length;

              const percentage = Math.round((correct / totalQuestions) * 100);
              const grade =
                percentage >= 80
                  ? "A*"
                  : percentage >= 70
                  ? "A"
                  : percentage >= 60
                  ? "B"
                  : percentage >= 50
                  ? "C"
                  : percentage >= 40
                  ? "D"
                  : "U";

              return (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {correct}
                    </div>
                    <div className="text-sm text-muted-foreground">Correct</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">
                      {incorrect}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Incorrect
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {percentage}%
                    </div>
                    <div className="text-sm text-muted-foreground">Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {grade}
                    </div>
                    <div className="text-sm text-muted-foreground">Grade</div>
                  </div>
                </div>
              );
            })()}
          </div>
        </Card>
      )}
    </div>
  );
};
