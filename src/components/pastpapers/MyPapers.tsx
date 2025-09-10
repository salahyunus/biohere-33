import React, { useState } from "react";
import {
  Bookmark,
  Trophy,
  MessageSquare,
  Tag,
  FileText,
  Star,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePastPapers } from "@/hooks/usePastPapers";
import { PastPaperCard } from "./PastPaperCard";
import { useNavigate } from "react-router-dom";

export const MyPapers: React.FC = () => {
  const { getBookmarkedPapers, getSolvedPapers, pastPapers } = usePastPapers();
  const navigate = useNavigate();

  const bookmarkedPapers = getBookmarkedPapers();
  const solvedPapers = getSolvedPapers();

  // Get papers with comments
  const papersWithComments = pastPapers.filter(
    (paper) => Object.keys(paper.comments).length > 0
  );

  // Get papers with tags
  const papersWithTags = pastPapers.filter(
    (paper) => Object.keys(paper.tags).length > 0
  );

  const formatSession = (session: string) => {
    return session.charAt(0).toUpperCase() + session.slice(1);
  };

  const QuickStatsCard: React.FC<{
    title: string;
    count: number;
    icon: React.ReactNode;
    color: string;
    onClick?: () => void;
  }> = ({ title, count, icon, color, onClick }) => (
    <Card
      className={`cursor-pointer hover:shadow-md transition-shadow ${
        onClick ? "hover:bg-muted/30" : ""
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{count}</p>
          </div>
          <div className={`p-2 rounded-full ${color}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Papers</h1>
            <p className="text-muted-foreground">
              Your bookmarked papers, solved papers, comments, and tags in one
              place
            </p>
          </div>
          <Button onClick={() => navigate("/past-papers")} variant="outline">
            Back to All Papers
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <QuickStatsCard
            title="Bookmarked Papers"
            count={bookmarkedPapers.length}
            icon={<Bookmark className="h-5 w-5 text-yellow-600" />}
            color="bg-yellow-100"
          />
          <QuickStatsCard
            title="Solved Papers"
            count={solvedPapers.length}
            icon={<Trophy className="h-5 w-5 text-green-600" />}
            color="bg-green-100"
          />
          <QuickStatsCard
            title="Papers with Comments"
            count={papersWithComments.length}
            icon={<MessageSquare className="h-5 w-5 text-blue-600" />}
            color="bg-blue-100"
          />
          <QuickStatsCard
            title="Papers with Tags"
            count={papersWithTags.length}
            icon={<Tag className="h-5 w-5 text-purple-600" />}
            color="bg-purple-100"
          />
        </div>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="bookmarked" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="bookmarked" className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            Bookmarked ({bookmarkedPapers.length})
          </TabsTrigger>
          <TabsTrigger value="solved" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Solved ({solvedPapers.length})
          </TabsTrigger>
          <TabsTrigger value="commented" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Commented ({papersWithComments.length})
          </TabsTrigger>
          <TabsTrigger value="tagged" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Tagged ({papersWithTags.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bookmarked" className="mt-6">
          {bookmarkedPapers.length > 0 ? (
            <div className="space-y-6">
              {/* Group by year */}
              {Object.entries(
                bookmarkedPapers.reduce((acc, paper) => {
                  if (!acc[paper.year]) acc[paper.year] = [];
                  acc[paper.year].push(paper);
                  return acc;
                }, {} as Record<number, typeof bookmarkedPapers>)
              )
                .sort(([a], [b]) => Number(b) - Number(a))
                .map(([year, papers]) => (
                  <div key={year} className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <span>{year}</span>
                      <Badge variant="outline">
                        {papers.length} bookmarked
                      </Badge>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {papers.map((paper) => (
                        <PastPaperCard key={paper.id} paper={paper} />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Bookmark className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No Bookmarked Papers
              </h3>
              <p className="text-muted-foreground mb-4">
                Start bookmarking papers to see them here
              </p>
              <Button onClick={() => navigate("/past-papers")}>
                Browse Papers
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="solved" className="mt-6">
          {solvedPapers.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {solvedPapers
                  .sort(
                    (a, b) =>
                      new Date(b.solvedInfo?.completedAt || "").getTime() -
                      new Date(a.solvedInfo?.completedAt || "").getTime()
                  )
                  .map((paper) => (
                    <div key={paper.id} className="relative">
                      <PastPaperCard paper={paper} />
                      {paper.solvedInfo && (
                        <div className="absolute top-2 right-2">
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
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Solved Papers</h3>
              <p className="text-muted-foreground mb-4">
                Log your paper attempts to track your progress
              </p>
              <Button onClick={() => navigate("/past-papers")}>
                Start Solving
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="commented" className="mt-6">
          {papersWithComments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {papersWithComments.map((paper) => (
                <PastPaperCard key={paper.id} paper={paper} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Comments Added</h3>
              <p className="text-muted-foreground mb-4">
                Add comments to questions to see them here
              </p>
              <Button onClick={() => navigate("/past-papers")}>
                Browse Papers
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="tagged" className="mt-6">
          {papersWithTags.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {papersWithTags.map((paper) => (
                <PastPaperCard key={paper.id} paper={paper} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Tag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Tags Added</h3>
              <p className="text-muted-foreground mb-4">
                Tag questions to organize and find them easily
              </p>
              <Button onClick={() => navigate("/past-papers")}>
                Browse Papers
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
