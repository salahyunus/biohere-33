import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Filter, ChevronDown } from "lucide-react";
import { CustomMultiSelect } from "./CustomMultiSelect";

interface AnalysisFiltersProps {
  selectedYears: string[];
  selectedSessions: string[];
  selectedGrades: string[];
  aggregationType: "separate" | "average";
  availableYears: string[];
  onYearChange: (years: string[]) => void;
  onSessionChange: (sessions: string[]) => void;
  onGradeChange: (grades: string[]) => void;
  onAggregationChange: (type: "separate" | "average") => void;
}

const gradeOptions = [
  { value: "Full UMS", label: "Full UMS (120)", color: "bg-gray-500" },
  { value: "A*", label: "Grade A*", color: "bg-green-500" },
  { value: "A", label: "Grade A", color: "bg-blue-500" },
  { value: "B", label: "Grade B", color: "bg-purple-500" },
  { value: "C", label: "Grade C", color: "bg-orange-500" },
];

const sessionOptions = [
  { value: "jan", label: "January" },
  { value: "june", label: "June" },
  { value: "oct", label: "October" },
];

export const AnalysisFilters: React.FC<AnalysisFiltersProps> = ({
  selectedYears,
  selectedSessions,
  selectedGrades,
  aggregationType,
  availableYears,
  onYearChange,
  onSessionChange,
  onGradeChange,
  onAggregationChange,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const yearOptions = availableYears.map((year) => ({
    value: year,
    label: year,
  }));

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Analysis Filters
              </div>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </CardTitle>
            <CardDescription>
              Configure your analysis parameters to view grade boundary trends
            </CardDescription>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-3">
                <Label className="font-medium">Years</Label>
                <CustomMultiSelect
                  options={yearOptions}
                  selectedValues={selectedYears}
                  onSelectionChange={onYearChange}
                  placeholder="Select years"
                />
              </div>

              <div className="space-y-3">
                <Label className="font-medium">Sessions</Label>
                <CustomMultiSelect
                  options={sessionOptions}
                  selectedValues={selectedSessions}
                  onSelectionChange={onSessionChange}
                  placeholder="Select sessions"
                />
              </div>

              <div className="space-y-3">
                <Label className="font-medium">Grades</Label>
                <CustomMultiSelect
                  options={gradeOptions}
                  selectedValues={selectedGrades}
                  onSelectionChange={onGradeChange}
                  placeholder="Select grades"
                />
              </div>

              <div className="space-y-3">
                <Label className="font-medium">Data Aggregation</Label>
                <Select
                  value={aggregationType}
                  onValueChange={(value: "separate" | "average") =>
                    onAggregationChange(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="separate">Show Separately</SelectItem>
                    <SelectItem value="average">Show as Average</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {aggregationType === "separate"
                    ? "Show each session individually"
                    : "Show yearly averages of selected sessions"}
                </p>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
