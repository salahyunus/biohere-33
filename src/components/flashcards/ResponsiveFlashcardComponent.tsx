import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flashcard } from "@/data/flashcards";
import { FlashcardSettings } from "@/pages/Flashcards";
import { Badge } from "@/components/ui/badge";
import { KeywordTooltip } from "./KeywordTooltip";
import { AlertTriangle, Star, Zap, BookOpen, Save, Plus } from "lucide-react";

interface ResponsiveFlashcardComponentProps {
  flashcard: Flashcard;
  settings: FlashcardSettings;
  isFlipped: boolean;
  onFlip: () => void;
  onSaveCard?: (card: Flashcard) => void;
  isFullscreen?: boolean;
}

const getCardSizeClasses = (size: string, isFullscreen = false) => {
  if (isFullscreen) {
    return "w-full h-full max-w-4xl max-h-[80vh]";
  }

  switch (size) {
    case "small":
      return "w-full max-w-sm h-64 md:w-80 md:h-48";
    case "large":
      return "w-full max-w-2xl h-96 md:w-[600px] md:h-80";
    default:
      return "w-full max-w-lg h-80 md:w-96 md:h-64";
  }
};

const getIconForTag = (tag: string) => {
  switch (tag.toLowerCase()) {
    case "important":
      return <Star className="h-3 w-3 md:h-4 md:w-4" />;
    case "advanced":
      return <Zap className="h-3 w-3 md:h-4 md:w-4" />;
    case "challenging":
      return <AlertTriangle className="h-3 w-3 md:h-4 md:w-4" />;
    default:
      return <BookOpen className="h-3 w-3 md:h-4 md:w-4" />;
  }
};

export const ResponsiveFlashcardComponent: React.FC<
  ResponsiveFlashcardComponentProps
> = ({
  flashcard,
  settings,
  isFlipped,
  onFlip,
  onSaveCard,
  isFullscreen = false,
}) => {
  const cardSizeClasses = getCardSizeClasses(settings.cardSize, isFullscreen);
  const displayQuestion = settings.reverseMode
    ? flashcard.answer
    : flashcard.question;
  const displayAnswer = settings.reverseMode
    ? flashcard.question
    : flashcard.answer;

  // Dynamic content sizing based on length
  const getContentClasses = (content: string) => {
    const length = content.length;
    if (length > 500) return "text-xs md:text-sm";
    if (length > 200) return "text-sm md:text-base";
    return "text-base md:text-lg";
  };

  return (
    <div className={`relative ${cardSizeClasses} perspective-1000`}>
      <div
        className={`relative w-full h-full duration-700 transform-style-preserve-3d transition-transform cursor-pointer ${
          isFlipped ? "rotate-y-180" : ""
        }`}
        onClick={onFlip}
      >
        {/* Front Side */}
        <Card
          className={`absolute inset-0 backface-hidden hover:shadow-lg transition-shadow ${cardSizeClasses}`}
          style={{
            backgroundColor: settings.backgroundColor,
            fontFamily: settings.fontFamily,
            color: settings.fontColor,
          }}
        >
          <CardContent className="p-3 md:p-6 h-full flex flex-col justify-between">
            <div className="flex-1 flex items-center justify-center min-h-0">
              <div className="text-center space-y-2 md:space-y-4 max-w-full overflow-hidden">
                <div
                  className={getContentClasses(displayQuestion)}
                  style={{
                    fontSize: isFullscreen
                      ? "1.25rem"
                      : `${settings.fontSize}px`,
                  }}
                >
                  <KeywordTooltip text={displayQuestion} />
                </div>
                {flashcard.imageUrl && settings.showImages && (
                  <img
                    src={flashcard.imageUrl}
                    alt="Flashcard content"
                    className="max-w-full max-h-24 md:max-h-32 mx-auto rounded-lg object-contain"
                  />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                {flashcard.tags.slice(0, 2).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs flex items-center gap-1"
                  >
                    {getIconForTag(tag)}
                    <span className="hidden md:inline">{tag}</span>
                  </Badge>
                ))}
                {flashcard.tags.length > 2 && (
                  <span className="text-xs text-muted-foreground">
                    +{flashcard.tags.length - 2}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Badge
                  variant={
                    flashcard.difficulty === "easy"
                      ? "default"
                      : flashcard.difficulty === "medium"
                      ? "secondary"
                      : "destructive"
                  }
                  className="text-xs"
                >
                  {flashcard.difficulty}
                </Badge>
                {onSaveCard && !isFullscreen && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSaveCard(flashcard);
                    }}
                    className="h-6 w-6 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back Side */}
        <Card
          className={`absolute inset-0 backface-hidden rotate-y-180 hover:shadow-lg transition-shadow ${cardSizeClasses}`}
          style={{
            backgroundColor: settings.backgroundColor,
            fontFamily: settings.fontFamily,
            color: settings.fontColor,
          }}
        >
          <CardContent className="p-3 md:p-6 h-full flex flex-col justify-between">
            <div className="flex-1 flex items-center justify-center min-h-0">
              <div className="text-center space-y-2 md:space-y-4 max-w-full overflow-hidden">
                <div
                  className={getContentClasses(displayAnswer)}
                  style={{
                    fontSize: isFullscreen
                      ? "1.25rem"
                      : `${settings.fontSize}px`,
                  }}
                >
                  <KeywordTooltip text={displayAnswer} />
                </div>
                {flashcard.answerImageUrl && settings.showImages && (
                  <img
                    src={flashcard.answerImageUrl}
                    alt="Answer content"
                    className="max-w-full max-h-24 md:max-h-32 mx-auto rounded-lg object-contain"
                  />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">
                {flashcard.subtopic || flashcard.topic}
              </span>
              <div className="flex items-center gap-2">
                {onSaveCard && !isFullscreen && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSaveCard(flashcard);
                    }}
                    className="h-6 w-6 p-0"
                  >
                    <Save className="h-3 w-3" />
                  </Button>
                )}
                <span className="text-xs text-muted-foreground">
                  {isFullscreen ? "Tap to flip" : "Click to flip back"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
