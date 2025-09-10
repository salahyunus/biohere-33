import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ResponsiveFlashcardComponent } from "./ResponsiveFlashcardComponent";
import { Flashcard } from "@/data/flashcards";
import { FlashcardSettings } from "@/pages/Flashcards";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

interface PlayModeViewerProps {
  flashcards: Flashcard[];
  settings: FlashcardSettings;
  onExit: () => void;
}

export const PlayModeViewer: React.FC<PlayModeViewerProps> = ({
  flashcards,
  settings,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          prevCard();
          break;
        case "ArrowRight":
          nextCard();
          break;
        case " ":
          e.preventDefault();
          setIsFlipped(!isFlipped);
          break;
        case "Escape":
          onExit();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [currentIndex, isFlipped, onExit]);

  const nextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  if (flashcards.length === 0) return null;

  const currentCard = flashcards[currentIndex];

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="text-sm text-muted-foreground">
          Card {currentIndex + 1} of {flashcards.length}
        </div>
        <Button variant="ghost" size="sm" onClick={onExit}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <ResponsiveFlashcardComponent
          flashcard={currentCard}
          settings={settings}
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped(!isFlipped)}
          isFullscreen={true}
        />
      </div>

      {/* Bottom controls */}
      <div className="flex items-center justify-center gap-4 p-4 border-t">
        <Button
          variant="outline"
          onClick={prevCard}
          disabled={currentIndex === 0}
          size="lg"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Previous
        </Button>

        <Button
          variant="outline"
          onClick={nextCard}
          disabled={currentIndex === flashcards.length - 1}
          size="lg"
        >
          Next
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{
            width: `${((currentIndex + 1) / flashcards.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};
