import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BoundaryAnalysis } from "@/hooks/useGradeBoundaryData";

interface GradeAnalysisCardsProps {
  selectedGrades: string[];
  selectedYears: string[];
  selectedSessions: string[];
  aggregationType: "separate" | "average";
  getBoundaryAnalysis: (
    grades: string[],
    years: string[],
    sessions: string[],
    type: "separate" | "average"
  ) => BoundaryAnalysis;
}

const gradeColors = {
  "Full UMS": "bg-gray-500",
  "A*": "bg-green-500",
  A: "bg-blue-500",
  B: "bg-purple-500",
  C: "bg-orange-500",
};

export const GradeAnalysisCards: React.FC<GradeAnalysisCardsProps> = ({
  selectedGrades,
  selectedYears,
  selectedSessions,
  aggregationType,
  getBoundaryAnalysis,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Individual Grade Analysis</h3>
        <Badge variant="outline">{selectedGrades.length} grades selected</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {selectedGrades.map((grade) => {
          const analysis = getBoundaryAnalysis(
            [grade],
            selectedYears,
            selectedSessions,
            aggregationType
          );

          return (
            <Card key={grade} className="relative overflow-hidden">
              <div
                className={`absolute top-0 left-0 w-full h-1 ${
                  gradeColors[grade as keyof typeof gradeColors]
                }`}
              />

              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-sm">
                  <span className="font-bold">
                    {grade === "Full UMS" ? "Full UMS" : `Grade ${grade}`}
                  </span>
                  <Badge variant="secondary" className="text-sm px-2 py-0.5">
                    {analysis.mode}
                  </Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 pt-0 animate-fade-in">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-muted-foreground">
                      {analysis.average}
                    </div>
                    <div className="text-xs text-muted-foreground">Avg</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">
                      {analysis.min.value}
                    </div>
                    <div className="text-xs text-muted-foreground">Min</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-red-600">
                      {analysis.max.value}
                    </div>
                    <div className="text-xs text-muted-foreground">Max</div>
                  </div>
                </div>

                <div className="text-center pt-2 border-t">
                  <Badge
                    variant={
                      analysis.trend === "stable" ? "secondary" : "outline"
                    }
                    className={`text-xs ${
                      analysis.trend === "increasing"
                        ? "text-red-600"
                        : analysis.trend === "decreasing"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {analysis.trend.charAt(0).toUpperCase() +
                      analysis.trend.slice(1)}
                  </Badge>
                </div>

                <div className="text-xs text-muted-foreground text-center">
                  Safety:{" "}
                  <span className="font-semibold">
                    {analysis.safetyRecommendation}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
