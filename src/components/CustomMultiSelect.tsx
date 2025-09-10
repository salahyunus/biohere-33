import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, X } from "lucide-react";

interface Option {
  value: string;
  label: string;
  color?: string;
}

interface CustomMultiSelectProps {
  options: Option[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  placeholder: string;
  className?: string;
}

export const CustomMultiSelect: React.FC<CustomMultiSelectProps> = ({
  options,
  selectedValues,
  onSelectionChange,
  placeholder,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (value: string) => {
    const newSelection = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onSelectionChange(newSelection);
  };

  const handleRemove = (value: string) => {
    onSelectionChange(selectedValues.filter((v) => v !== value));
  };

  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option.value)
  );

  return (
    <div className={className}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between min-h-10 h-auto"
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {selectedValues.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : selectedValues.length <= 3 ? (
                selectedOptions.map((option) => (
                  <Badge
                    key={option.value}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {option.color && (
                      <div className={`w-2 h-2 rounded-full ${option.color}`} />
                    )}
                    {option.label}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(option.value);
                      }}
                    />
                  </Badge>
                ))
              ) : (
                <Badge variant="secondary">
                  {selectedValues.length} selected
                </Badge>
              )}
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-2" align="start">
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-2 p-2 hover:bg-muted rounded cursor-pointer"
                onClick={() => handleToggle(option.value)}
              >
                <Checkbox
                  checked={selectedValues.includes(option.value)}
                  onChange={() => handleToggle(option.value)}
                />
                <div className="flex items-center gap-2 flex-1">
                  {option.color && (
                    <div className={`w-3 h-3 rounded-full ${option.color}`} />
                  )}
                  <span>{option.label}</span>
                </div>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
