import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calculator, Home, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGradeBoundaryData } from "@/hooks/useGradeBoundaryData";
import { GradeBoundaryChart } from "@/components/GradeBoundaryChart";
import { BoundaryAnalysis } from "@/components/BoundaryAnalysis";
import { GradeAnalysisCards } from "@/components/GradeAnalysisCards";
import { UMSCalculator } from "@/components/UMSCalculator";
import { AnalysisFilters } from "@/components/AnalysisFilters";
import { ExportDialog } from "@/components/ExportDialog";

const GradeBoundary: React.FC = () => {
  const navigate = useNavigate();
  const [selectedYears, setSelectedYears] = useState<string[]>([
    "2023",
    "2024",
  ]);
  const [selectedSessions, setSelectedSessions] = useState<string[]>([
    "jan",
    "june",
    "oct",
  ]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>(["A*"]);
  const [aggregationType, setAggregationType] = useState<
    "separate" | "average"
  >("separate");

  const {
    getAvailableYears,
    getBoundaryAnalysis,
    getChartData,
    savedCalculations,
  } = useGradeBoundaryData();

  useEffect(() => {
    const savedFilters = localStorage.getItem("grade-boundary-filters");
    if (savedFilters) {
      const filters = JSON.parse(savedFilters);
      setSelectedYears(filters.years || ["2023", "2024"]);
      setSelectedSessions(filters.sessions || ["jan", "june", "oct"]);
      setSelectedGrades(filters.grades || ["A*"]);
      setAggregationType(filters.aggregationType || "separate");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "grade-boundary-filters",
      JSON.stringify({
        years: selectedYears,
        sessions: selectedSessions,
        grades: selectedGrades,
        aggregationType,
      })
    );
  }, [selectedYears, selectedSessions, selectedGrades, aggregationType]);

  const analysisData = getBoundaryAnalysis(
    selectedGrades,
    selectedYears,
    selectedSessions,
    aggregationType
  );
  const chartData = getChartData(
    selectedGrades,
    selectedYears,
    selectedSessions,
    aggregationType
  );

  const exportData = {
    selectedYears: selectedYears.join(", "),
    selectedSessions: selectedSessions.join(", "),
    selectedGrades: selectedGrades.join(", "),
    aggregationType,
    minBoundary: `${Math.round(analysisData.min.value)} (${
      analysisData.min.session === "avg"
        ? `${analysisData.min.year} Avg`
        : `${analysisData.min.session} ${analysisData.min.year}`
    })`,
    maxBoundary: `${Math.round(analysisData.max.value)} (${
      analysisData.max.session === "avg"
        ? `${analysisData.max.year} Avg`
        : `${analysisData.max.session} ${analysisData.max.year}`
    })`,
    average: Math.round(analysisData.average),
    mode: Math.round(analysisData.mode),
    trend: analysisData.trend,
    safetyRecommendation: analysisData.safetyRecommendation,
  };

  return (
    <div className="p-6 animate-fade-in max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-full p-3">
              <Calculator className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                Grade Boundary Analysis & UMS Calculator
              </h1>
              <p className="text-muted-foreground">
                Analyze grade trends and calculate your UMS scores with
                precision
              </p>
            </div>
          </div>
          <Button onClick={() => navigate("/")} variant="outline">
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
        </div>
      </div>

      <Tabs defaultValue="analysis" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analysis">Boundary Analysis</TabsTrigger>
          <TabsTrigger value="calculator">UMS Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-6">
          <AnalysisFilters
            selectedYears={selectedYears}
            selectedSessions={selectedSessions}
            selectedGrades={selectedGrades}
            aggregationType={aggregationType}
            availableYears={getAvailableYears()}
            onYearChange={setSelectedYears}
            onSessionChange={setSelectedSessions}
            onGradeChange={setSelectedGrades}
            onAggregationChange={setAggregationType}
          />

          {selectedYears.length > 0 &&
            selectedGrades.length > 0 &&
            selectedSessions.length > 0 && (
              <>
                <BoundaryAnalysis
                  analysis={analysisData}
                  selectedGrades={selectedGrades}
                />

                <GradeAnalysisCards
                  selectedGrades={selectedGrades}
                  selectedYears={selectedYears}
                  selectedSessions={selectedSessions}
                  aggregationType={aggregationType}
                  getBoundaryAnalysis={getBoundaryAnalysis}
                />

                <Card>
                  <CardContent className="pt-6">
                    <GradeBoundaryChart
                      data={chartData}
                      selectedGrades={selectedGrades}
                    />
                  </CardContent>
                </Card>

                <div className="flex justify-center">
                  <ExportDialog
                    data={exportData}
                    title="Grade Boundary Analysis"
                  >
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Analysis
                    </Button>
                  </ExportDialog>
                </div>
              </>
            )}
        </TabsContent>

        <TabsContent value="calculator" className="space-y-6">
          <UMSCalculator />

          {savedCalculations.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">
                  Recent Calculations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedCalculations
                    .slice(-6)
                    .reverse()
                    .map((calc) => (
                      <Card
                        key={calc.id}
                        className="border-l-4 border-l-primary"
                      >
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="text-lg font-bold">
                              {calc.grade} ({calc.ums})
                            </div>
                            <div className="text-right text-sm text-muted-foreground">
                              <div>
                                {calc.year}{" "}
                                {calc.session.charAt(0).toUpperCase() +
                                  calc.session.slice(1)}
                              </div>
                              <div>
                                {new Date(calc.timestamp).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Raw Mark:{" "}
                            <span className="font-medium">{calc.rawMark}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GradeBoundary;
