import React, { useState } from "react";
import {
  FileText,
  Search,
  Download,
  Timer,
  Bookmark,
  Tag,
  Star,
  Grid,
  List,
  Home,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PastPaperCard } from "@/components/pastpapers/PastPaperCard";
import { PastPapersListView } from "@/components/pastpapers/PastPapersListView";
import { DraggableTimer } from "@/components/pastpapers/DraggableTimer";
import { DownloadDialog } from "@/components/pastpapers/DownloadDialog";
import { usePastPapers } from "@/hooks/usePastPapers";
import { MyPapers } from "@/components/pastpapers/MyPapers";

const PastPapers: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { pastPapers, getFilteredPapers } = usePastPapers();

  const handleAdvancedSearch = () => {
    navigate("/past-papers/search");
  };

  const handleTopicalQuestions = () => {
    navigate("/topical");
  };

  const filteredPapers = getFilteredPapers(searchTerm);

  const papersByYear = filteredPapers.reduce((acc, paper) => {
    if (!acc[paper.year]) acc[paper.year] = [];
    acc[paper.year].push(paper);
    return acc;
  }, {} as Record<number, any[]>);

  const years = Object.keys(papersByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-primary/10 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <FileText className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Past Papers+</h1>
          <p className="text-lg text-muted-foreground">
            Access comprehensive collection of past examination papers with mark
            schemes, examiner reports, and more.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search papers by year, session, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => navigate("/home")} variant="outline">
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
          <Button onClick={handleAdvancedSearch} variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Advanced Search
          </Button>
          <Button onClick={() => setShowDownloadDialog(true)} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Bulk Download
          </Button>
          <Button
            onClick={() => setShowTimer(!showTimer)}
            variant={showTimer ? "default" : "outline"}
          >
            <Timer className="h-4 w-4 mr-2" />
            Timer
          </Button>
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Draggable Timer */}
        {showTimer && <DraggableTimer onClose={() => setShowTimer(false)} />}

        {/* Tabs */}
        <Tabs defaultValue="question-papers" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-7">
            <TabsTrigger value="question-papers">Question Papers</TabsTrigger>
            <TabsTrigger value="my-papers">My Papers</TabsTrigger>
            <TabsTrigger value="examiner-reports">Examiner Reports</TabsTrigger>
            <TabsTrigger value="topical">Topical</TabsTrigger>
            <TabsTrigger value="common-questions">Common Questions</TabsTrigger>
            <TabsTrigger value="challenging">
              Challenging Collection
            </TabsTrigger>
            <TabsTrigger value="6markers">6-Marker Collection</TabsTrigger>
          </TabsList>

          <TabsContent value="question-papers" className="mt-6">
            {viewMode === "list" ? (
              <PastPapersListView papers={filteredPapers} />
            ) : (
              <div className="space-y-6">
                {years.map((year) => (
                  <div key={year} className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <span>{year}</span>
                      {year >= 2023 && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Recent
                        </span>
                      )}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {papersByYear[year].map((paper) => (
                        <PastPaperCard key={paper.id} paper={paper} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-papers" className="mt-6">
            <MyPapers />
          </TabsContent>

          <TabsContent value="examiner-reports" className="mt-6">
            <div className="text-center py-16">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Examiner Reports</h3>
              <p className="text-muted-foreground">
                Coming soon - Detailed examiner reports for all sessions
              </p>
            </div>
          </TabsContent>

          <TabsContent value="topical" className="mt-6">
            <div className="text-center py-16">
              <Tag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Topical Questions</h3>
              <p className="text-muted-foreground mb-4">
                Browse questions organized by topics and difficulty
              </p>
              <Button onClick={handleTopicalQuestions}>
                <Tag className="h-4 w-4 mr-2" />
                Go to Topical Questions
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="common-questions" className="mt-6">
            <div className="text-center py-16">
              <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Common Questions</h3>
              <p className="text-muted-foreground">
                Coming soon - Frequently asked questions across sessions
              </p>
            </div>
          </TabsContent>

          <TabsContent value="challenging" className="mt-6">
            <div className="text-center py-16">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Challenging Collection
              </h3>
              <p className="text-muted-foreground">
                Coming soon - Most challenging questions collection
              </p>
            </div>
          </TabsContent>

          <TabsContent value="6markers" className="mt-6">
            <div className="text-center py-16">
              <Bookmark className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                6-Marker Collection
              </h3>
              <p className="text-muted-foreground">
                Coming soon - All 6-mark questions in one place
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Download Dialog */}
        {showDownloadDialog && (
          <DownloadDialog onClose={() => setShowDownloadDialog(false)} />
        )}
      </div>
    </div>
  );
};

export default PastPapers;
