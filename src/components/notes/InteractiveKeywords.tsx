import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { EyeOff, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveKeywordsProps {
  content: {
    keywords: Array<{
      id: string;
      term: string;
      definition: string;
    }>;
  };
}

export const InteractiveKeywords: React.FC<InteractiveKeywordsProps> = ({
  content,
}) => {
  const [hiddenKeywords, setHiddenKeywords] = useState<Record<string, boolean>>(
    {}
  );
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [completedKeywords, setCompletedKeywords] = useState<
    Record<string, boolean>
  >({});

  const hideKeyword = (keywordId: string) => {
    setHiddenKeywords((prev) => ({ ...prev, [keywordId]: true }));
    setInputValues((prev) => ({ ...prev, [keywordId]: "" }));
  };

  const handleInputChange = (keywordId: string, value: string) => {
    const keyword = content.keywords.find((k) => k.id === keywordId);
    if (!keyword) return;

    setInputValues((prev) => ({ ...prev, [keywordId]: value }));

    // Check if input is correct so far
    const isCorrectSoFar = keyword.term
      .toLowerCase()
      .startsWith(value.toLowerCase());

    if (value.toLowerCase() === keyword.term.toLowerCase()) {
      setCompletedKeywords((prev) => ({ ...prev, [keywordId]: true }));
    }
  };

  const completeKeyword = (keywordId: string) => {
    setHiddenKeywords((prev) => ({ ...prev, [keywordId]: false }));
    setCompletedKeywords((prev) => ({ ...prev, [keywordId]: false }));
    setInputValues((prev) => ({ ...prev, [keywordId]: "" }));
  };

  const getInputStyle = (keywordId: string) => {
    const keyword = content.keywords.find((k) => k.id === keywordId);
    const value = inputValues[keywordId] || "";

    if (!keyword || !value) return "";

    if (completedKeywords[keywordId]) {
      return "border-green-500 bg-green-50";
    }

    const isCorrectSoFar = keyword.term
      .toLowerCase()
      .startsWith(value.toLowerCase());
    return isCorrectSoFar ? "border-primary" : "border-red-500 bg-red-50";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interactive Keywords</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {content.keywords.map((keyword) => (
            <div key={keyword.id} className="relative">
              {hiddenKeywords[keyword.id] ? (
                <div className="space-y-2">
                  <Input
                    value={inputValues[keyword.id] || ""}
                    onChange={(e) =>
                      handleInputChange(keyword.id, e.target.value)
                    }
                    placeholder="Type the keyword..."
                    className={cn("text-sm", getInputStyle(keyword.id))}
                  />
                  {completedKeywords[keyword.id] && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute -top-1 -right-1 h-6 w-6 bg-green-500 text-white hover:bg-green-600"
                      onClick={() => completeKeyword(keyword.id)}
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ) : (
                <Badge
                  variant="secondary"
                  className="relative group cursor-help p-2 text-xs"
                  title={keyword.definition}
                >
                  {keyword.term}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute -top-1 -right-1 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => hideKeyword(keyword.id)}
                  >
                    <EyeOff className="h-2 w-2" />
                  </Button>
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
