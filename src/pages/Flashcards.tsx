import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DynamicFlashcardFilters } from "@/components/flashcards/DynamicFlashcardFilters";
import { FlashcardViewer } from "@/components/flashcards/FlashcardViewer";
import { EnhancedFlashcardCustomizer } from "@/components/flashcards/EnhancedFlashcardCustomizer";
import { MyFlashcardsSection } from "@/components/flashcards/MyFlashcardsSection";
import { PlayModeViewer } from "@/components/flashcards/PlayModeViewer";
import { CreateFlashcardDialog } from "@/components/flashcards/CreateFlashcardDialog";
import { EnhancedExportDialog } from "@/components/flashcards/EnhancedExportDialog";
import { ResponsiveFlashcardComponent } from "@/components/flashcards/ResponsiveFlashcardComponent";
import { flashcardsData, FlashcardSet, Flashcard } from "@/data/flashcards";
import { Settings, Play, BookOpen, Save, Plus, Fullscreen } from "lucide-react";
import { toast } from "sonner";

export interface FlashcardSettings {
  backgroundColor: string;
  fontFamily: string;
  fontColor: string;
  fontSize: number;
  cardSize: "small" | "medium" | "large";
  reverseMode: boolean;
  shuffleCards: boolean;
  showImages: boolean;
}

type ViewMode = "browse" | "study" | "my-flashcards" | "play-mode";

const defaultSettings: FlashcardSettings = {
  backgroundColor: "hsl(var(--card))",
  fontFamily: "Sora",
  fontColor: "hsl(var(--foreground))",
  fontSize: 16,
  cardSize: "medium",
  reverseMode: false,
  shuffleCards: false,
  showImages: true,
};

const Flashcards: React.FC = () => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedSubtopics, setSelectedSubtopics] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [filteredFlashcards, setFilteredFlashcards] = useState<Flashcard[]>([]);
  const [settings, setSettings] = useState<FlashcardSettings>(defaultSettings);
  const [currentView, setCurrentView] = useState<ViewMode>("browse");
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [selectedSet, setSelectedSet] = useState<FlashcardSet | null>(null);
  const [myFlashcards, setMyFlashcards] = useState<FlashcardSet[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("my-flashcards");
    if (saved) {
      setMyFlashcards(JSON.parse(saved));
    }
  }, []);

  // Dynamic filtering - updates as user selects filters
  useEffect(() => {
    let filtered: Flashcard[] = [];

    flashcardsData.forEach((set) => {
      if (selectedTopics.length === 0 || selectedTopics.includes(set.topic)) {
        set.cards.forEach((card) => {
          const matchesSubtopic =
            selectedSubtopics.length === 0 ||
            (card.subtopic && selectedSubtopics.includes(card.subtopic));
          const matchesDifficulty =
            selectedDifficulty.length === 0 ||
            selectedDifficulty.includes(card.difficulty);

          if (matchesSubtopic && matchesDifficulty) {
            filtered.push({ ...card, setId: set.id });
          }
        });
      }
    });

    if (settings.shuffleCards) {
      filtered = [...filtered].sort(() => Math.random() - 0.5);
    }

    setFilteredFlashcards(filtered);
  }, [
    selectedTopics,
    selectedSubtopics,
    selectedDifficulty,
    settings.shuffleCards,
  ]);

  const saveToMyFlashcards = (cards: Flashcard[], name: string) => {
    const newSet: FlashcardSet = {
      id: `custom-${Date.now()}`,
      name,
      topic: "Custom",
      description: `Custom flashcard set with ${cards.length} cards`,
      cards: cards.map((card) => ({ ...card, setId: undefined })),
      isCustom: true,
    };

    const updatedSets = [...myFlashcards, newSet];
    setMyFlashcards(updatedSets);
    localStorage.setItem("my-flashcards", JSON.stringify(updatedSets));
    toast.success(`Saved "${name}" to My Flashcards!`);
  };

  const saveIndividualCard = (card: Flashcard) => {
    // Check if there's an existing "Individual Cards" set
    let individualSet = myFlashcards.find(
      (set) => set.name === "Individual Cards"
    );

    if (individualSet) {
      // Add to existing set
      const updatedCard = {
        ...card,
        id: `individual-${Date.now()}`,
        setId: undefined,
      };
      individualSet.cards.push(updatedCard);
      individualSet.description = `${individualSet.cards.length} individual flashcards`;
    } else {
      // Create new individual set
      individualSet = {
        id: `individual-${Date.now()}`,
        name: "Individual Cards",
        topic: "Mixed",
        description: "1 individual flashcard",
        cards: [{ ...card, id: `individual-${Date.now()}`, setId: undefined }],
        isCustom: true,
      };
      myFlashcards.push(individualSet);
    }

    localStorage.setItem("my-flashcards", JSON.stringify(myFlashcards));
    setMyFlashcards([...myFlashcards]);
    toast.success("Card saved to Individual Cards!");
  };

  const createNewFlashcard = (card: Flashcard) => {
    let customSet = myFlashcards.find((set) => set.name === "My Custom Cards");

    if (customSet) {
      customSet.cards.push(card);
      customSet.description = `${customSet.cards.length} custom flashcards`;
    } else {
      customSet = {
        id: `custom-created-${Date.now()}`,
        name: "My Custom Cards",
        topic: "Custom",
        description: "1 custom flashcard",
        cards: [card],
        isCustom: true,
      };
      myFlashcards.push(customSet);
    }

    localStorage.setItem("my-flashcards", JSON.stringify(myFlashcards));
    setMyFlashcards([...myFlashcards]);
    toast.success("Custom flashcard created!");
  };

  const startStudySession = () => {
    if (filteredFlashcards.length > 0) {
      const studySet: FlashcardSet = {
        id: "filtered-study",
        name: "Filtered Cards",
        topic: "Mixed",
        description: `${filteredFlashcards.length} filtered flashcards`,
        cards: filteredFlashcards,
      };
      setSelectedSet(studySet);
      setCurrentView("study");
    }
  };

  // View handlers
  if (currentView === "play-mode" && selectedSet) {
    return (
      <PlayModeViewer
        flashcards={selectedSet.cards}
        settings={settings}
        onExit={() => setCurrentView("browse")}
      />
    );
  }

  if (currentView === "study" && selectedSet) {
    return (
      <FlashcardViewer
        flashcards={selectedSet.cards}
        settings={settings}
        onBack={() => setCurrentView("browse")}
        onSaveSet={(cards, name) => saveToMyFlashcards(cards, name)}
        onPlayMode={() => setCurrentView("play-mode")}
        onSaveCard={saveIndividualCard}
      />
    );
  }

  if (currentView === "my-flashcards") {
    return (
      <MyFlashcardsSection
        myFlashcards={myFlashcards}
        settings={settings}
        onBack={() => setCurrentView("browse")}
        onStudySet={(set) => {
          setSelectedSet(set);
          setCurrentView("study");
        }}
        onDeleteSet={(setId) => {
          const updated = myFlashcards.filter((set) => set.id !== setId);
          setMyFlashcards(updated);
          localStorage.setItem("my-flashcards", JSON.stringify(updated));
          toast.success("Flashcard set deleted");
        }}
      />
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Flashcards</h1>
          <p className="text-muted-foreground">
            Study with interactive flashcards
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={currentView === "browse" ? "default" : "outline"}
            onClick={() => setCurrentView("browse")}
            size="sm"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Browse Sets
          </Button>
          <Button
            // variant={currentView === "my-flashcards" ? "default" : "outline"}
            onClick={() => setCurrentView("my-flashcards")}
            size="sm"
          >
            <Save className="h-4 w-4 mr-2" />
            My Flashcards ({myFlashcards.length})
          </Button>
          <CreateFlashcardDialog onCreateCard={createNewFlashcard}>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Card
            </Button>
          </CreateFlashcardDialog>
          <Button
            variant="outline"
            onClick={() => setShowCustomizer(!showCustomizer)}
            size="sm"
          >
            <Settings className="h-4 w-4 mr-2" />
            Customize
          </Button>
        </div>
      </div>

      {showCustomizer && (
        <EnhancedFlashcardCustomizer
          settings={settings}
          onSettingsChange={setSettings}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <DynamicFlashcardFilters
            selectedTopics={selectedTopics}
            selectedSubtopics={selectedSubtopics}
            selectedDifficulty={selectedDifficulty}
            onTopicsChange={setSelectedTopics}
            onSubtopicsChange={setSelectedSubtopics}
            onDifficultyChange={setSelectedDifficulty}
            filteredCount={filteredFlashcards.length}
            onStartStudy={startStudySession}
          />
        </div>

        <div className="lg:col-span-3">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-lg md:text-xl font-semibold">
                Available Sets ({flashcardsData.length})
              </h2>
              {filteredFlashcards.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <Button onClick={startStudySession} size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Study All ({filteredFlashcards.length})
                  </Button>
                  <Button
                    onClick={() => {
                      const studySet: FlashcardSet = {
                        id: "play-mode-set",
                        name: "Play Mode",
                        topic: "Mixed",
                        description: `${filteredFlashcards.length} cards`,
                        cards: filteredFlashcards,
                      };
                      setSelectedSet(studySet);
                      setCurrentView("play-mode");
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <Fullscreen className="h-4 w-4 mr-2" />
                    Play Mode
                  </Button>
                  <EnhancedExportDialog
                    flashcards={filteredFlashcards}
                    title="Filtered Flashcards"
                  >
                    <Button variant="outline" size="sm">
                      Export
                    </Button>
                  </EnhancedExportDialog>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {flashcardsData.map((set) => (
                <Card
                  key={set.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold line-clamp-2">{set.name}</h3>
                      <span className="text-sm text-muted-foreground ml-2">
                        {set.cards.length} cards
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {set.topic}
                    </p>
                    <p className="text-sm mb-4 line-clamp-2">
                      {set.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedSet(set);
                          setCurrentView("study");
                        }}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Study
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => saveToMyFlashcards(set.cards, set.name)}
                      >
                        <Save className="h-3 w-3 mr-1" />
                        Save
                      </Button>
                      <EnhancedExportDialog
                        flashcards={set.cards}
                        title={set.name}
                      >
                        <Button variant="outline" size="sm">
                          Export
                        </Button>
                      </EnhancedExportDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcards;
