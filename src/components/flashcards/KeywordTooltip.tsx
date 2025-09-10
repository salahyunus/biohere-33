import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { keywordsData } from "@/data/keywords";

interface KeywordTooltipProps {
  text: string;
}

export const KeywordTooltip: React.FC<KeywordTooltipProps> = ({ text }) => {
  const renderTextWithTooltips = (text: string) => {
    let processedText = text;
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    // Sort keywords by length (longest first) to avoid partial matches
    const sortedKeywords = [...keywordsData].sort(
      (a, b) => b.term.length - a.term.length
    );

    sortedKeywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword.term}\\b`, "gi");
      let match;

      while ((match = regex.exec(processedText)) !== null) {
        // Add text before the keyword
        if (match.index > lastIndex) {
          elements.push(processedText.slice(lastIndex, match.index));
        }

        // Add the keyword with tooltip
        elements.push(
          <TooltipProvider key={`${keyword.term}-${match.index}`}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="border-b border-dashed border-primary/60 cursor-help hover:border-primary">
                  {match[0]}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">{keyword.definition}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );

        lastIndex = match.index + match[0].length;
        regex.lastIndex = lastIndex;
      }
    });

    // Add remaining text
    if (lastIndex < processedText.length) {
      elements.push(processedText.slice(lastIndex));
    }

    return elements.length > 0 ? elements : [text];
  };

  return (
    <div className="whitespace-pre-wrap">{renderTextWithTooltips(text)}</div>
  );
};
