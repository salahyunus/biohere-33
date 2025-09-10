import { useState, useEffect } from "react";
import {
  gradeBoundariesData,
  getAvailableSessions,
  getAvailableYears,
  getAvailableGrades,
} from "../data/gradeBoundaries";

export interface SavedCalculation {
  id: string;
  year: string;
  session: string;
  rawMark: number;
  grade: string;
  ums: number;
  timestamp: number;
}

export interface BoundaryAnalysis {
  min: { value: number; year: string; session: string };
  max: { value: number; year: string; session: string };
  average: number;
  mode: number;
  trend: "increasing" | "decreasing" | "stable";
  trendDescription: string;
  safetyRecommendation: number;
}

export const useGradeBoundaryData = () => {
  const [savedCalculations, setSavedCalculations] = useState<
    SavedCalculation[]
  >([]);

  useEffect(() => {
    const saved = localStorage.getItem("grade-boundary-calculations");
    if (saved) {
      setSavedCalculations(JSON.parse(saved));
    }
  }, []);

  const saveCalculation = (
    calculation: Omit<SavedCalculation, "id" | "timestamp">
  ) => {
    const newCalculation: SavedCalculation = {
      ...calculation,
      id: `calc-${Date.now()}`,
      timestamp: Date.now(),
    };

    const updated = [...savedCalculations, newCalculation];
    setSavedCalculations(updated);
    localStorage.setItem(
      "grade-boundary-calculations",
      JSON.stringify(updated)
    );
  };

  const deleteCalculation = (id: string) => {
    const updated = savedCalculations.filter((calc) => calc.id !== id);
    setSavedCalculations(updated);
    localStorage.setItem(
      "grade-boundary-calculations",
      JSON.stringify(updated)
    );
  };

  const calculateGradeAndUMS = (
    year: string,
    session: string,
    rawMark: number
  ): { grade: string; ums: number } | null => {
    const yearData = gradeBoundariesData[year];
    if (!yearData || !yearData[session]) return null;

    const sessionData = yearData[session];

    for (const grade of getAvailableGrades()) {
      const gradeData = sessionData[grade];
      if (!gradeData) continue;

      const umsList = Object.keys(gradeData)
        .map(Number)
        .sort((a, b) => b - a);

      for (const ums of umsList) {
        if (rawMark >= gradeData[ums]) {
          return { grade, ums };
        }
      }
    }

    return { grade: "U", ums: 0 };
  };

  const getBoundaryAnalysis = (
    selectedGrades: string[],
    selectedYears: string[],
    selectedSessions: string[],
    aggregationType: "separate" | "average"
  ): BoundaryAnalysis => {
    const boundaries: Array<{ value: number; year: string; session: string }> =
      [];

    selectedYears.forEach((year) => {
      const availableSessions = getAvailableSessions(year);
      const sessionsToAnalyze = selectedSessions.filter((s) =>
        availableSessions.includes(s)
      );

      if (aggregationType === "average" && sessionsToAnalyze.length > 1) {
        selectedGrades.forEach((grade) => {
          const sessionBoundaries = sessionsToAnalyze
            .map((session) => {
              const gradeData = gradeBoundariesData[year]?.[session]?.[grade];
              if (!gradeData) return null;
              return Math.min(...Object.values(gradeData));
            })
            .filter((b) => b !== null) as number[];

          if (sessionBoundaries.length > 0) {
            const avgBoundary =
              sessionBoundaries.reduce((a, b) => a + b, 0) /
              sessionBoundaries.length;
            boundaries.push({ value: avgBoundary, year, session: "avg" });
          }
        });
      } else {
        sessionsToAnalyze.forEach((session) => {
          selectedGrades.forEach((grade) => {
            const gradeData = gradeBoundariesData[year]?.[session]?.[grade];
            if (gradeData) {
              const minBoundary = Math.min(...Object.values(gradeData));
              boundaries.push({ value: minBoundary, year, session });
            }
          });
        });
      }
    });

    if (boundaries.length === 0) {
      return {
        min: { value: 0, year: "", session: "" },
        max: { value: 0, year: "", session: "" },
        average: 0,
        mode: 0,
        trend: "stable",
        trendDescription: "No data available",
        safetyRecommendation: 0,
      };
    }

    const values = boundaries.map((b) => b.value);
    const min = boundaries.reduce((prev, curr) =>
      prev.value < curr.value ? prev : curr
    );
    const max = boundaries.reduce((prev, curr) =>
      prev.value > curr.value ? prev : curr
    );
    const average = values.reduce((a, b) => a + b, 0) / values.length;

    // Calculate mode
    const frequencyMap: Record<number, number> = {};
    values.forEach((val) => {
      frequencyMap[val] = (frequencyMap[val] || 0) + 1;
    });
    const mode = Number(
      Object.keys(frequencyMap).reduce((a, b) =>
        frequencyMap[Number(a)] > frequencyMap[Number(b)] ? a : b
      )
    );

    // Calculate trend
    const yearlyAverages: Record<string, number> = {};
    boundaries.forEach(({ value, year }) => {
      if (!yearlyAverages[year]) yearlyAverages[year] = 0;
      yearlyAverages[year] += value;
    });

    Object.keys(yearlyAverages).forEach((year) => {
      const count = boundaries.filter((b) => b.year === year).length;
      yearlyAverages[year] /= count;
    });

    const years = Object.keys(yearlyAverages).sort();
    let trend: "increasing" | "decreasing" | "stable" = "stable";

    if (years.length > 1) {
      const firstYear = yearlyAverages[years[0]];
      const lastYear = yearlyAverages[years[years.length - 1]];
      const difference = lastYear - firstYear;

      if (difference > 2) trend = "increasing";
      else if (difference < -2) trend = "decreasing";
    }

    const trendDescription =
      trend === "increasing"
        ? "Grade boundaries are getting harder over time"
        : trend === "decreasing"
        ? "Grade boundaries are getting easier over time"
        : "Grade boundaries remain relatively stable";

    const safetyRecommendation = Math.ceil(max.value * 1.1);

    return {
      min,
      max,
      average: Math.round(average * 10) / 10,
      mode,
      trend,
      trendDescription,
      safetyRecommendation,
    };
  };

  const getChartData = (
    selectedGrades: string[],
    selectedYears: string[],
    selectedSessions: string[],
    aggregationType: "separate" | "average"
  ) => {
    const data: Array<{ year: string; session?: string; [key: string]: any }> =
      [];

    selectedYears.forEach((year) => {
      const availableSessions = getAvailableSessions(year);
      const sessionsToAnalyze = selectedSessions.filter((s) =>
        availableSessions.includes(s)
      );

      if (aggregationType === "average" && sessionsToAnalyze.length > 1) {
        const yearData: any = { year, session: "avg" };

        selectedGrades.forEach((grade) => {
          const sessionBoundaries = sessionsToAnalyze
            .map((session) => {
              const gradeData = gradeBoundariesData[year]?.[session]?.[grade];
              if (!gradeData) return null;
              return Math.min(...Object.values(gradeData));
            })
            .filter((b) => b !== null) as number[];

          if (sessionBoundaries.length > 0) {
            yearData[grade] =
              Math.round(
                (sessionBoundaries.reduce((a, b) => a + b, 0) /
                  sessionBoundaries.length) *
                  10
              ) / 10;
          }
        });

        data.push(yearData);
      } else {
        sessionsToAnalyze.forEach((session) => {
          const sessionData: any = { year, session };

          selectedGrades.forEach((grade) => {
            const gradeData = gradeBoundariesData[year]?.[session]?.[grade];
            if (gradeData) {
              sessionData[grade] = Math.min(...Object.values(gradeData));
            }
          });

          data.push(sessionData);
        });
      }
    });

    return data;
  };

  return {
    gradeBoundariesData,
    getAvailableSessions,
    getAvailableYears,
    getAvailableGrades,
    calculateGradeAndUMS,
    getBoundaryAnalysis,
    getChartData,
    savedCalculations,
    saveCalculation,
    deleteCalculation,
  };
};
