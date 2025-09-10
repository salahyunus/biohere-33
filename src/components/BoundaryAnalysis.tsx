import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Target,
  BarChart3,
} from "lucide-react";
import { BoundaryAnalysis as BoundaryAnalysisType } from "@/hooks/useGradeBoundaryData";

interface BoundaryAnalysisProps {
  analysis: BoundaryAnalysisType;
  selectedGrades: string[];
}

export const BoundaryAnalysis: React.FC<BoundaryAnalysisProps> = ({
  analysis,
  selectedGrades,
}) => {
  const getTrendIcon = () => {
    switch (analysis.trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case "decreasing":
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getTrendColor = () => {
    switch (analysis.trend) {
      case "increasing":
        return "text-red-600";
      case "decreasing":
        return "text-green-600";
      default:
        return "text-yellow-600";
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 animate-fade-in">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Min Boundary:
              </span>
              <Badge variant="outline" className="text-green-600">
                {analysis.min.value} (
                {analysis.min.session === "avg"
                  ? `${analysis.min.year} Avg`
                  : `${analysis.min.session
                      ?.charAt(0)
                      .toUpperCase()}${analysis.min.session?.slice(1)} ${
                      analysis.min.year
                    }`}
                )
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Max Boundary:
              </span>
              <Badge variant="outline" className="text-red-600">
                {analysis.max.value} (
                {analysis.max.session === "avg"
                  ? `${analysis.max.year} Avg`
                  : `${analysis.max.session
                      ?.charAt(0)
                      .toUpperCase()}${analysis.max.session?.slice(1)} ${
                      analysis.max.year
                    }`}
                )
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Average:</span>
              <Badge variant="secondary">{analysis.average}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Mode:</span>
              <Badge variant="secondary">{analysis.mode}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              {getTrendIcon()}
              Trend Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <Badge
                variant={analysis.trend === "stable" ? "secondary" : "outline"}
                className={getTrendColor()}
              >
                {analysis.trend.charAt(0).toUpperCase() +
                  analysis.trend.slice(1)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {analysis.trendDescription}
            </p>
            <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
              {analysis.trend === "increasing" &&
                "Exams are getting harder - prepare thoroughly!"}
              {analysis.trend === "decreasing" &&
                "Boundaries are getting lower - good news!"}
              {analysis.trend === "stable" &&
                "Boundaries remain consistent - predictable standards."}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Target className="h-4 w-4" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 animate-fade-in">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Safety Target:</span>
            </div>
            <Badge variant="default" className="text-lg px-3 py-1">
              {analysis.safetyRecommendation} marks
            </Badge>
            <p className="text-xs text-muted-foreground">
              Aim for this score to be safe, even if boundaries increase.
            </p>
          </div>

          <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950 p-2 rounded border-l-2 border-blue-500">
            <strong>Remember:</strong> The boundary for{" "}
            {selectedGrades.join(", ")} grade
            {selectedGrades.length > 1 ? "s" : ""} is usually around{" "}
            <strong>{analysis.mode}</strong> marks. Boundaries are unpredictable
            and based on exam difficulty.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
