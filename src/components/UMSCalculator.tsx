import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Save, Calculator, Home, Download } from "lucide-react";
import { useGradeBoundaryData } from "@/hooks/useGradeBoundaryData";
import { useToast } from "@/hooks/use-toast";
import { ExportDialog } from "@/components/ExportDialog";
import { useNavigate } from "react-router-dom";
import {
  saveToDashboard,
  getDashboardCalculations,
} from "@/utils/dashboardHelpers";

interface UMSCalculatorProps {
  onSaveCalculation?: (calculation: any) => void;
}

export const UMSCalculator: React.FC<UMSCalculatorProps> = ({
  onSaveCalculation,
}) => {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [rawMark, setRawMark] = useState<string>("");
  const [result, setResult] = useState<{ grade: string; ums: number } | null>(
    null
  );

  const {
    getAvailableYears,
    getAvailableSessions,
    calculateGradeAndUMS,
    saveCalculation,
    gradeBoundariesData,
  } = useGradeBoundaryData();

  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const savedState = localStorage.getItem("ums-calculator-state");
    if (savedState) {
      const state = JSON.parse(savedState);
      setSelectedYear(state.year || "");
      setSelectedSession(state.session || "");
      setRawMark(state.rawMark || "");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "ums-calculator-state",
      JSON.stringify({
        year: selectedYear,
        session: selectedSession,
        rawMark,
      })
    );
  }, [selectedYear, selectedSession, rawMark]);

  useEffect(() => {
    if (selectedYear && selectedSession && rawMark) {
      const mark = parseInt(rawMark);
      if (!isNaN(mark) && mark >= 0 && mark <= 90) {
        const calculatedResult = calculateGradeAndUMS(
          selectedYear,
          selectedSession,
          mark
        );
        setResult(calculatedResult);
      } else {
        setResult(null);
      }
    } else {
      setResult(null);
    }
  }, [selectedYear, selectedSession, rawMark, calculateGradeAndUMS]);

  const handleSave = () => {
    if (result && selectedYear && selectedSession && rawMark) {
      const calculation = {
        year: selectedYear,
        session: selectedSession,
        rawMark: parseInt(rawMark),
        grade: result.grade,
        ums: result.ums,
      };

      saveCalculation(calculation);
      onSaveCalculation?.(calculation);

      // Save to the existing system
      const success = saveToDashboard(calculation);

      if (success) {
        toast({
          title: "Calculation Saved",
          description: `Saved to dashboard: ${result.grade} (${result.ums}) for ${selectedYear} ${selectedSession}`,
        });
      } else {
        toast({
          title: "Save Failed",
          description:
            "Could not save calculation to dashboard. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const getGradeEmoji = (grade: string) => {
    const emojis = {
      "A*": "🏆",
      A: "🥇",
      B: "🥈",
      C: "🥉",
      U: "📚",
    };
    return emojis[grade as keyof typeof emojis] || "📚";
  };

  const getMotivationalMessage = (grade: string) => {
    const messages = {
      "A*": {
        title: "Outstanding! Exceptional performance!",
        desc: "You're performing at the highest level. Keep up the excellent work!",
      },
      A: {
        title: "Excellent work! Great achievement!",
        desc: "You're doing really well. Just a bit more effort for that A*!",
      },
      B: {
        title: "Good job! Solid performance!",
        desc: "You're on the right track. Push a little harder for that A grade!",
      },
      C: {
        title: "Making progress! Keep going!",
        desc: "You're building momentum. Focus on improvement for better grades!",
      },
      U: {
        title: "Room for improvement!",
        desc: "Don't give up! Every expert was once a beginner. Keep practicing!",
      },
    };
    return messages[grade as keyof typeof messages] || messages["U"];
  };

  const getBoundaries = () => {
    if (!selectedYear || !selectedSession) return {};
    const sessionData = gradeBoundariesData[selectedYear]?.[selectedSession];
    if (!sessionData) return {};

    const boundaries: { [grade: string]: number } = {};
    Object.keys(sessionData).forEach((grade) => {
      const gradeData = sessionData[grade];
      if (gradeData) {
        boundaries[grade] = Math.min(...Object.values(gradeData));
      }
    });
    return boundaries;
  };

  const resultExportData = result
    ? {
        year: selectedYear,
        session:
          selectedSession.charAt(0).toUpperCase() + selectedSession.slice(1),
        rawMark: rawMark,
        grade: result.grade,
        umsScore: result.ums,
        calculatedOn: new Date().toLocaleDateString(),
      }
    : {};

  const dashboardCalculations = getDashboardCalculations();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">UMS Calculator</h1>
          <p className="text-muted-foreground">
            Calculate your UMS score and grade
          </p>
        </div>
        <Button onClick={() => navigate("/")} variant="outline">
          <Home className="h-4 w-4 mr-2" />
          Home
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Enter Your Details
          </CardTitle>
          <CardDescription>
            Select year, session, and enter your raw mark to see your grade and
            UMS
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableYears().map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="session">Session</Label>
              <Select
                value={selectedSession}
                onValueChange={setSelectedSession}
                disabled={!selectedYear}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select session" />
                </SelectTrigger>
                <SelectContent>
                  {selectedYear &&
                    getAvailableSessions(selectedYear).map((session) => (
                      <SelectItem key={session} value={session}>
                        {session.charAt(0).toUpperCase() + session.slice(1)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="raw-mark">Raw Mark</Label>
              <Input
                id="raw-mark"
                type="number"
                min="0"
                max="90"
                value={rawMark}
                onChange={(e) => setRawMark(e.target.value)}
                placeholder="Enter raw mark"
                disabled={!selectedSession}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-2 border-primary">
          <CardContent className="pt-6 animate-fade-in">
            <div className="text-center space-y-6">
              <div className="text-6xl">{getGradeEmoji(result.grade)}</div>

              <div className="space-y-2">
                <p className="text-muted-foreground">Your Grade</p>
                <div className="flex items-center justify-center gap-4">
                  <Badge
                    variant={result.grade === "A*" ? "default" : "secondary"}
                    className="text-4xl px-6 py-3 font-bold"
                  >
                    {result.grade}
                  </Badge>
                  <div className="text-4xl font-bold text-primary">
                    {result.ums}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">UMS Score</p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="font-semibold text-lg">
                  {getMotivationalMessage(result.grade).title}
                </p>
                <p className="text-muted-foreground">
                  {getMotivationalMessage(result.grade).desc}
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <Button onClick={handleSave} className="flex-1 max-w-xs">
                  <Save className="h-4 w-4 mr-2" />
                  Save to Dashboard
                </Button>
                <Button variant="outline" className="flex-1 max-w-xs">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Boundaries
                </Button>
                <ExportDialog
                  data={resultExportData}
                  title="UMS Calculation Result"
                >
                  <Button variant="outline" className="flex-1 max-w-xs">
                    <Download className="h-4 w-4 mr-2" />
                    Export Result
                  </Button>
                </ExportDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedYear &&
        selectedSession &&
        Object.keys(getBoundaries()).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>
                Grade Boundaries for {selectedYear}{" "}
                {selectedSession.charAt(0).toUpperCase() +
                  selectedSession.slice(1)}
              </CardTitle>
            </CardHeader>
            <CardContent className="animate-fade-in">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {Object.entries(getBoundaries()).map(([grade, boundary]) => (
                  <Card key={grade} className="text-center">
                    <CardContent className="pt-4 animate-fade-in">
                      <div className="text-2xl font-bold">{grade}</div>
                      <div className="text-lg text-muted-foreground">
                        {boundary}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      {dashboardCalculations.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Recent Calculations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardCalculations
                .slice(-6)
                .reverse()
                .map((calc) => (
                  <Card key={calc.id} className="border-l-4 border-l-primary">
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
      <p className="text-muted-foreground">
        <span className="font-bold">June 2020</span> and{" "}
        <span className="font-bold">June 2021</span> had no exams due to the
        Covid-19 Pandemic, so you may not find grade boundaries for these
        sessions but october boundaries are used on this site for that two
        sessions.
      </p>
    </div>
  );
};
