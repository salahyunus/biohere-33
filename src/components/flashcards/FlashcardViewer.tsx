import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ResponsiveFlashcardComponent } from "./ResponsiveFlashcardComponent";
import { EnhancedFlashcardCustomizer } from "./EnhancedFlashcardCustomizer";
import { Flashcard } from "@/data/flashcards";
import { FlashcardSettings } from "@/pages/Flashcards";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  Shuffle,
  RotateCcw,
  Save,
  Settings,
  Fullscreen,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface FlashcardViewerProps {
  flashcards: Flashcard[];
  settings: FlashcardSettings;
  onBack: () => void;
  onSaveSet: (cards: Flashcard[], name: string) => void;
  onPlayMode?: () => void;
  onSaveCard?: (card: Flashcard) => void;
  onSettingsChange?: (settings: FlashcardSettings) => void;
}

export const FlashcardViewer: React.FC<FlashcardViewerProps> = ({
  flashcards: initialFlashcards,
  settings,
  onBack,
  onSaveSet,
  onPlayMode,
  onSaveCard,
  onSettingsChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flashcards, setFlashcards] = useState(initialFlashcards);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [setName, setSetName] = useState("");
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    let cards = [...initialFlashcards];
    if (localSettings.shuffleCards) {
      cards = cards.sort(() => Math.random() - 0.5);
    }
    setFlashcards(cards);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [initialFlashcards, localSettings.shuffleCards]);

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

  const shuffleCards = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const resetCards = () => {
    setFlashcards(initialFlashcards);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleSaveSet = () => {
    if (setName.trim()) {
      onSaveSet(flashcards, setName.trim());
      setShowSaveDialog(false);
      setSetName("");
    }
  };

  const handleSettingsChange = (newSettings: FlashcardSettings) => {
    setLocalSettings(newSettings);
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
  };

  if (flashcards.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <Button onClick={onBack} variant="ghost" className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div className="text-center py-12">
          <p className="text-muted-foreground">No flashcards to display</p>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-6xl">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
          <Button onClick={onBack} variant="ghost">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={shuffleCards}>
              <Shuffle className="h-4 w-4 mr-1" />
              Shuffle
            </Button>
            <Button variant="outline" size="sm" onClick={resetCards}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
            {onPlayMode && (
              <Button variant="outline" size="sm" onClick={onPlayMode}>
                <Fullscreen className="h-4 w-4 mr-1" />
                Play Mode
              </Button>
            )}
            <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Save className="h-4 w-4 mr-1" />
                  Save Set
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Flashcard Set</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="set-name">Set Name</Label>
                    <Input
                      id="set-name"
                      value={setName}
                      onChange={(e) => setSetName(e.target.value)}
                      placeholder="Enter set name"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowSaveDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveSet} disabled={!setName.trim()}>
                      Save
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Collapsible open={showSettings} onOpenChange={setShowSettings}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-1" />
                  Settings
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>
        </div>

        <Collapsible open={showSettings} onOpenChange={setShowSettings}>
          <CollapsibleContent>
            <div className="mb-6">
              <EnhancedFlashcardCustomizer
                settings={localSettings}
                onSettingsChange={handleSettingsChange}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Card {currentIndex + 1} of {flashcards.length}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <div className="flex flex-col items-center space-y-6">
        <div className="w-full flex justify-center">
          <ResponsiveFlashcardComponent
            flashcard={currentCard}
            settings={localSettings}
            isFlipped={isFlipped}
            onFlip={() => setIsFlipped(!isFlipped)}
            onSaveCard={onSaveCard}
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            variant="outline"
            onClick={prevCard}
            disabled={currentIndex === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <Button
            variant="outline"
            onClick={() => setIsFlipped(!isFlipped)}
            className="min-w-32"
          >
            {isFlipped ? "Show Question" : "Show Answer"}
          </Button>

          <Button
            variant="outline"
            onClick={nextCard}
            disabled={currentIndex === flashcards.length - 1}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {currentIndex === flashcards.length - 1 && (
          <Card className="p-4 bg-primary/5 border-primary/20">
            <p className="text-center font-medium">
              🎉 You've completed all flashcards! Great job!
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
