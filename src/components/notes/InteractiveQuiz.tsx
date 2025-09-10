import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Save, RotateCcw } from "lucide-react";

interface InteractiveQuizProps {
  content: {
    questions: Array<{
      id: string;
      question: string;
      options: string[];
      correct: number;
      explanation: string;
    }>;
  };
}

export const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({
  content,
}) => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setShowResults(true);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setShowResults(false);
  };

  const calculateScore = () => {
    const correct = content.questions.filter(
      (q) => answers[q.id] === q.correct
    ).length;
    return Math.round((correct / content.questions.length) * 100);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Test Yourself
            {submitted && (
              <Badge
                variant={calculateScore() >= 60 ? "default" : "destructive"}
              >
                {calculateScore()}%
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            {submitted && (
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Retake
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {content.questions.map((question, index) => {
          const isCorrect = answers[question.id] === question.correct;
          const hasAnswered = question.id in answers;

          return (
            <div key={question.id} className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="font-medium">{index + 1}.</span>
                <p className="flex-1">{question.question}</p>
                {showResults &&
                  hasAnswered &&
                  (isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  ))}
              </div>

              <RadioGroup
                value={answers[question.id]?.toString()}
                onValueChange={(value) =>
                  setAnswers((prev) => ({
                    ...prev,
                    [question.id]: parseInt(value),
                  }))
                }
                disabled={submitted}
              >
                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem
                      value={optionIndex.toString()}
                      id={`${question.id}-${optionIndex}`}
                    />
                    <Label
                      htmlFor={`${question.id}-${optionIndex}`}
                      className={`flex-1 ${
                        showResults && optionIndex === question.correct
                          ? "text-green-600 font-medium"
                          : showResults &&
                            answers[question.id] === optionIndex &&
                            optionIndex !== question.correct
                          ? "text-red-600"
                          : ""
                      }`}
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {showResults && hasAnswered && !isCorrect && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground">
                    <strong>Explanation:</strong> {question.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {!submitted && (
          <Button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length !== content.questions.length}
            className="w-full"
          >
            Submit Quiz
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
