import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Home, BookOpen, Star, MessageSquare } from "lucide-react";
import { QuizGenerator as QuizGeneratorComponent } from "@/components/quiz/QuizGenerator";
import { GeneratedQuiz, SavedQuestion } from "@/data/quizQuestions";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const QuizGenerator: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [savedQuizzes, setSavedQuizzes] = useState<GeneratedQuiz[]>([]);
  const [savedQuestions, setSavedQuestions] = useState<SavedQuestion[]>([]);

  const handleSaveQuiz = (quiz: GeneratedQuiz) => {
    setSavedQuizzes((prev) => [...prev, quiz]);
  };

  const handleSaveQuestion = (question: SavedQuestion) => {
    setSavedQuestions((prev) => [...prev, question]);
  };

  const renderSavedQuizzes = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Saved Quizzes</h2>
        <Badge variant="outline">{savedQuizzes.length} saved</Badge>
      </div>

      {savedQuizzes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No saved quizzes yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Generate a quiz and save it to see it here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {savedQuizzes.map((quiz) => (
            <Card key={quiz.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{quiz.name}</CardTitle>
                    <CardDescription>
                      Created {new Date(quiz.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {quiz.questions.length} questions
                    </Badge>
                    <Badge variant="outline">{quiz.totalMarks} marks</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Topics:{" "}
                    {quiz.filters.topics.length > 0
                      ? quiz.filters.topics.join(", ")
                      : "All topics"}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Quiz
                    </Button>
                    <Button variant="outline" size="sm">
                      Export PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderSavedQuestions = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Saved Questions</h2>
        <Badge variant="outline">{savedQuestions.length} saved</Badge>
      </div>

      {savedQuestions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No saved questions yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Save questions from generated quizzes to see them here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {savedQuestions.map((question) => (
            <Card key={question.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">
                      Question {question.questionNumber}
                      {question.isImportant && (
                        <Star className="h-4 w-4 inline ml-2 fill-yellow-400 text-yellow-400" />
                      )}
                    </CardTitle>
                    <CardDescription>
                      {question.year} {question.session} • {question.topic}
                      {question.subtopic && ` - ${question.subtopic}`}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{question.marks} marks</Badge>
                    <Badge
                      variant={
                        question.difficulty === "easy"
                          ? "secondary"
                          : question.difficulty === "medium"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {question.difficulty}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="animate-fade-in">
                <div className="space-y-2">
                  <div className="text-sm line-clamp-2">
                    {question.question
                      .replace(/\*\*(.*?)\*\*/g, "$1")
                      .replace(/\*(.*?)\*/g, "$1")}
                  </div>
                  {question.comment && (
                    <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                      <strong>Note:</strong> {question.comment}
                    </div>
                  )}
                  {question.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {question.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    Saved {new Date(question.savedAt).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4 sm:p-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex gap-4 mb-6">
        <Button onClick={() => navigate("/home")} variant="outline">
          <Home className="h-4 w-4 mr-2" />
          Home
        </Button>
        <Button onClick={() => navigate("/topical")} variant="outline">
          <BookOpen className="h-4 w-4 mr-2" />
          Topical Questions
        </Button>
      </div>

      <div className="text-center mb-8">
        <div className="bg-primary/10 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <BookOpen className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Quiz Generator</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Create custom quizzes and mock exams from past paper questions with
          advanced filtering options
        </p>
      </div>

      <Tabs defaultValue="generator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generator">Generate Quiz</TabsTrigger>
          <TabsTrigger value="saved-quizzes">
            Saved Quizzes ({savedQuizzes.length})
          </TabsTrigger>
          <TabsTrigger value="saved-questions">
            Saved Questions ({savedQuestions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generator">
          <QuizGeneratorComponent
            onSaveQuiz={handleSaveQuiz}
            onSaveQuestion={handleSaveQuestion}
          />
        </TabsContent>

        <TabsContent value="saved-quizzes">{renderSavedQuizzes()}</TabsContent>

        <TabsContent value="saved-questions">
          {renderSavedQuestions()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuizGenerator;
