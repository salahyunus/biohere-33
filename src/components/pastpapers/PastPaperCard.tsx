import React, { useState } from "react";
import {
  FileText,
  Download,
  Bookmark,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Tag,
  Clock,
  Trophy,
  Edit3,
  Maximize,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { BookmarkDialog } from "./BookmarkDialog";
import { ImprovedSolveDialog } from "./ImprovedSolveDialog";
import { CommentDialog } from "./CommentDialog";
import { usePastPapers, type PastPaper } from "@/hooks/usePastPapers";
import { useNavigate } from "react-router-dom";

interface PastPaperCardProps {
  paper: PastPaper;
}

export const PastPaperCard: React.FC<PastPaperCardProps> = ({ paper }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isQuestionsExpanded, setIsQuestionsExpanded] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(
    new Set()
  );
  const [showBookmarkDialog, setShowBookmarkDialog] = useState(false);
  const [showSolveDialog, setShowSolveDialog] = useState(false);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  const {
    bookmarkPaper,
    removeBookmark,
    savePaperToDashboard,
    removeComment,
    removeTag,
    removeSolvedLog,
  } = usePastPapers();
  const navigate = useNavigate();

  const handleBookmark = () => {
    if (paper.isBookmarked) {
      removeBookmark(paper.id);
    } else {
      setShowBookmarkDialog(true);
    }
  };

  const handleRemoveComment = (questionNumber: string) => {
    removeComment(paper.id, questionNumber);
  };

  const handleRemoveTag = (questionNumber: string, tag: string) => {
    removeTag(paper.id, questionNumber, tag);
  };

  const handleRemoveSolvedLog = () => {
    removeSolvedLog(paper.id);
  };

  const handleViewBothPdfs = () => {
    const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(
      paper.questionPdfUrl
    )}&embedded=true`;
    navigate(`/pdf-viewer/${paper.id}`);
  };

  const handleSaveToDashboard = () => {
    const success = savePaperToDashboard(paper);
    if (success) {
      console.log("Paper saved to dashboard");
    }
  };

  const handleAddComment = (questionNumber: string) => {
    setSelectedQuestion(questionNumber);
    setShowCommentDialog(true);
  };

  const formatSession = (session: string) => {
    return session.charAt(0).toUpperCase() + session.slice(1);
  };

  const toggleQuestionExpansion = (questionPrefix: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionPrefix)) {
      newExpanded.delete(questionPrefix);
    } else {
      newExpanded.add(questionPrefix);
    }
    setExpandedQuestions(newExpanded);
  };

  // Group questions by their main number (1a, 1b -> 1)
  const groupedQuestions = paper.questions.reduce((acc, question) => {
    const mainNumber = question.number.match(/^\d+/)?.[0] || question.number;
    if (!acc[mainNumber]) {
      acc[mainNumber] = [];
    }
    acc[mainNumber].push(question);
    return acc;
  }, {} as Record<string, typeof paper.questions>);

  return (
    <>
      <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {paper.year} {formatSession(paper.session)}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                {paper.solvedInfo?.completed && (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    <Trophy className="h-3 w-3 mr-1" />
                    Logged
                  </Badge>
                )}
                {paper.isBookmarked && (
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800"
                  >
                    <Bookmark className="h-3 w-3 mr-1" />
                    Bookmarked
                  </Badge>
                )}
                {Object.keys(paper.comments).length > 0 && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    <MessageSquare className="h-3 w-3 mr-1" />
                    {Object.keys(paper.comments).length} Comments
                  </Badge>
                )}
              </div>
            </div>

            <Button
              variant={paper.isBookmarked ? "default" : "outline"}
              size="sm"
              onClick={handleBookmark}
            >
              <Bookmark
                className={`h-4 w-4 ${
                  paper.isBookmarked ? "fill-current" : ""
                }`}
              />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Always visible paper links */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`${paper.questionPdfUrl}`, "_blank")}
            >
              <FileText className="h-4 w-4 mr-1" />
              Question Paper
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                window.open(
                  `https://docs.google.com/viewer?url=${encodeURIComponent(
                    paper.markSchemePdfUrl
                  )}&embedded=true`,
                  "_blank"
                )
              }
            >
              <Download className="h-4 w-4 mr-1" />
              Mark Scheme
            </Button>
          </div>

          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-2">
                <span className="flex items-center gap-2">More Options</span>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="mt-3 space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewBothPdfs}
                >
                  <Maximize className="h-4 w-4 mr-1" />
                  Side by Side
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/pdf-annotation/${paper.id}`)}
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  Annotate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSolveDialog(true)}
                >
                  <Clock className="h-4 w-4 mr-1" />
                  {paper.solvedInfo?.completed ? "Update Log" : "Log"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveToDashboard}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Save to Dashboard
                </Button>
                {paper.examinerReportUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(
                        `https://docs.google.com/viewer?url=${encodeURIComponent(
                          paper.examinerReportUrl
                        )}&embedded=true`,
                        "_blank"
                      )
                    }
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Examiner Report
                  </Button>
                )}
              </div>

              {paper.solvedInfo && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center justify-between text-sm flex-wrap gap-2 flex-1">
                      <span className="flex items-center gap-1">
                        <Trophy className="h-4 w-4" />
                        Score: {paper.solvedInfo.score}/
                        {paper.solvedInfo.totalMarks}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {paper.solvedInfo.timeTaken} mins
                      </span>
                      <Badge
                        variant={
                          paper.solvedInfo.difficulty === "easy"
                            ? "secondary"
                            : paper.solvedInfo.difficulty === "medium"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {paper.solvedInfo.difficulty}
                      </Badge>
                      {paper.solvedInfo.grade && (
                        <Badge variant="outline">
                          Grade {paper.solvedInfo.grade}
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveSolvedLog}
                      className="text-destructive hover:text-destructive"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )}

              {/* Questions section */}
              {paper.questions.length > 0 && (
                <Collapsible
                  open={isQuestionsExpanded}
                  onOpenChange={setIsQuestionsExpanded}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-2"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          Questions ({paper.questions.length})
                        </span>
                      </span>
                      {isQuestionsExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="mt-2">
                    <div className="space-y-2">
                      {Object.entries(groupedQuestions).map(
                        ([mainNumber, questions]) => (
                          <div key={mainNumber}>
                            {questions.length === 1 ? (
                              <div className="flex items-center justify-between p-2 bg-background rounded border text-sm">
                                <div className="flex items-center gap-2 flex-1">
                                  <span className="font-medium">
                                    Q{questions[0].number}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {questions[0].marks}m
                                  </Badge>
                                  {paper.comments[questions[0].number] && (
                                    <div className="flex items-center gap-1">
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        <MessageSquare className="h-3 w-3 mr-1" />
                                        Comment
                                      </Badge>
                                      <span className="text-xs text-muted-foreground max-w-32 truncate">
                                        {paper.comments[questions[0].number]}
                                      </span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          handleRemoveComment(
                                            questions[0].number
                                          )
                                        }
                                        className="h-4 w-4 p-0 text-destructive hover:text-destructive"
                                      >
                                        ×
                                      </Button>
                                    </div>
                                  )}
                                  {paper.tags[questions[0].number] && (
                                    <div className="flex items-center gap-1">
                                      {paper.tags[questions[0].number].map(
                                        (tag) => (
                                          <Badge
                                            key={tag}
                                            variant="outline"
                                            className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                                            onClick={() =>
                                              handleRemoveTag(
                                                questions[0].number,
                                                tag
                                              )
                                            }
                                          >
                                            <Tag className="h-3 w-3 mr-1" />
                                            {tag} ×
                                          </Badge>
                                        )
                                      )}
                                    </div>
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleAddComment(questions[0].number)
                                  }
                                  className="h-6 px-2 text-xs"
                                >
                                  {paper.comments[questions[0].number]
                                    ? "Edit"
                                    : "Add"}{" "}
                                  Comment
                                </Button>
                              </div>
                            ) : (
                              <Collapsible
                                open={expandedQuestions.has(mainNumber)}
                                onOpenChange={() =>
                                  toggleQuestionExpansion(mainNumber)
                                }
                              >
                                <CollapsibleTrigger asChild>
                                  <div className="flex items-center justify-between p-2 bg-background rounded border text-sm cursor-pointer hover:bg-muted/50">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">
                                        Q{mainNumber}
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {questions.reduce(
                                          (sum, q) => sum + q.marks,
                                          0
                                        )}
                                        m total
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">
                                        {questions.length} parts
                                      </span>
                                    </div>
                                    {expandedQuestions.has(mainNumber) ? (
                                      <ChevronDown className="h-3 w-3" />
                                    ) : (
                                      <ChevronRight className="h-3 w-3" />
                                    )}
                                  </div>
                                </CollapsibleTrigger>

                                <CollapsibleContent className="ml-4 mt-1 space-y-1">
                                  {questions.map((question) => (
                                    <div
                                      key={question.id}
                                      className="flex items-center justify-between p-2 bg-muted/30 rounded border text-sm"
                                    >
                                      <div className="flex items-center gap-2 flex-1">
                                        <span className="font-medium">
                                          Q{question.number}
                                        </span>
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {question.marks}m
                                        </Badge>
                                        {paper.comments[question.number] && (
                                          <div className="flex items-center gap-1">
                                            <Badge
                                              variant="secondary"
                                              className="text-xs"
                                            >
                                              <MessageSquare className="h-3 w-3 mr-1" />
                                              Comment
                                            </Badge>
                                            <span className="text-xs text-muted-foreground max-w-32 truncate">
                                              {paper.comments[question.number]}
                                            </span>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() =>
                                                handleRemoveComment(
                                                  question.number
                                                )
                                              }
                                              className="h-4 w-4 p-0 text-destructive hover:text-destructive"
                                            >
                                              ×
                                            </Button>
                                          </div>
                                        )}
                                        {paper.tags[question.number] && (
                                          <div className="flex items-center gap-1">
                                            {paper.tags[question.number].map(
                                              (tag) => (
                                                <Badge
                                                  key={tag}
                                                  variant="outline"
                                                  className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                                                  onClick={() =>
                                                    handleRemoveTag(
                                                      question.number,
                                                      tag
                                                    )
                                                  }
                                                >
                                                  <Tag className="h-3 w-3 mr-1" />
                                                  {tag} ×
                                                </Badge>
                                              )
                                            )}
                                          </div>
                                        )}
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          handleAddComment(question.number)
                                        }
                                        className="h-6 px-2 text-xs"
                                      >
                                        {paper.comments[question.number]
                                          ? "Edit"
                                          : "Add"}{" "}
                                        Comment
                                      </Button>
                                    </div>
                                  ))}
                                </CollapsibleContent>
                              </Collapsible>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* Dialogs */}
      {showBookmarkDialog && (
        <BookmarkDialog
          paper={paper}
          onClose={() => setShowBookmarkDialog(false)}
          onBookmark={(questionNumbers) => {
            bookmarkPaper(paper.id, questionNumbers);
            setShowBookmarkDialog(false);
          }}
        />
      )}

      {showSolveDialog && (
        <ImprovedSolveDialog
          paper={paper}
          onClose={() => setShowSolveDialog(false)}
        />
      )}

      {showCommentDialog && (
        <CommentDialog
          paper={paper}
          questionNumber={selectedQuestion}
          onClose={() => setShowCommentDialog(false)}
        />
      )}
    </>
  );
};
