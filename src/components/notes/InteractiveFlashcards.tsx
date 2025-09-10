import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Save, ChevronLeft, ChevronRight } from "lucide-react";

interface InteractiveFlashcardsProps {
  content: {
    cards: Array<{
      id: string;
      front: string;
      back: string;
    }>;
  };
}

export const InteractiveFlashcards: React.FC<InteractiveFlashcardsProps> = ({
  content,
}) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % content.cards.length);
    setFlipped(false);
  };

  const prevCard = () => {
    setCurrentCard(
      (prev) => (prev - 1 + content.cards.length) % content.cards.length
    );
    setFlipped(false);
  };

  const card = content.cards[currentCard];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Remember by Flashcards
            <Badge variant="outline">
              {currentCard + 1} / {content.cards.length}
            </Badge>
          </CardTitle>
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className="min-h-[200px] bg-accent rounded-lg p-6 flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-accent/80"
          onClick={() => setFlipped(!flipped)}
        >
          <div className="text-center">
            <p className="text-lg font-medium">
              {flipped ? card.back : card.front}
            </p>
            {!flipped && (
              <p className="text-sm text-muted-foreground mt-2">
                Click to reveal answer
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={prevCard}
            disabled={content.cards.length <= 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setFlipped(!flipped)}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Flip
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={nextCard}
            disabled={content.cards.length <= 1}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
