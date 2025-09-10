import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Flashcard } from "@/data/flashcards";
import { FlashcardSettings } from "@/pages/Flashcards";
import { Badge } from "@/components/ui/badge";
import { KeywordTooltip } from "./KeywordTooltip";
import { AlertTriangle, Star, Zap, BookOpen } from "lucide-react";

interface FlashcardComponentProps {
  flashcard: Flashcard;
  settings: FlashcardSettings;
  isFlipped: boolean;
  onFlip: () => void;
}

const getCardSizeClasses = (size: string) => {
  switch (size) {
    case "small":
      return "w-80 h-48";
    case "large":
      return "w-[600px] h-80";
    default:
      return "w-96 h-64";
  }
};

const getIconForTag = (tag: string) => {
  switch (tag.toLowerCase()) {
    case "important":
      return <Star className="h-4 w-4" />;
    case "advanced":
      return <Zap className="h-4 w-4" />;
    case "challenging":
      return <AlertTriangle className="h-4 w-4" />;
    default:
      return <BookOpen className="h-4 w-4" />;
  }
};

export const FlashcardComponent: React.FC<FlashcardComponentProps> = ({
  flashcard,
  settings,
  isFlipped,
  onFlip,
}) => {
  const cardSizeClasses = getCardSizeClasses(settings.cardSize);
  const displayQuestion = settings.reverseMode
    ? flashcard.answer
    : flashcard.question;
  const displayAnswer = settings.reverseMode
    ? flashcard.question
    : flashcard.answer;

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
            fontSize: `${settings.fontSize}px`,
          }}
        >
          <CardContent className="animate-fade-in p-6 h-full flex flex-col justify-between">
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <KeywordTooltip text={displayQuestion} />
                {flashcard.imageUrl && settings.showImages && (
                  <img
                    src={flashcard.imageUrl}
                    alt="Flashcard content"
                    className="max-w-full max-h-32 mx-auto rounded-lg object-contain"
                  />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {flashcard.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs flex items-center gap-1"
                  >
                    {getIconForTag(tag)}
                    {tag}
                  </Badge>
                ))}
              </div>
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
            fontSize: `${settings.fontSize}px`,
          }}
        >
          <CardContent className="animate-fade-in p-6 h-full flex flex-col justify-between">
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <KeywordTooltip text={displayAnswer} />
                {flashcard.answerImageUrl && settings.showImages && (
                  <img
                    src={flashcard.answerImageUrl}
                    alt="Answer content"
                    className="max-w-full max-h-32 mx-auto rounded-lg object-contain"
                  />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {flashcard.subtopic || flashcard.topic}
              </span>
              <span className="text-xs text-muted-foreground">
                Click to flip back
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
