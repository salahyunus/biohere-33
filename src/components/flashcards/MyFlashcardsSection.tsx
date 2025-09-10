import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlashcardSet } from "@/data/flashcards";
import { FlashcardSettings } from "@/pages/Flashcards";
import { ChevronLeft, Play, Trash2, Edit, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ExportDialog } from "@/components/ExportDialog";

interface MyFlashcardsSectionProps {
  myFlashcards: FlashcardSet[];
  settings: FlashcardSettings;
  onBack: () => void;
  onStudySet: (set: FlashcardSet) => void;
  onDeleteSet: (setId: string) => void;
}

export const MyFlashcardsSection: React.FC<MyFlashcardsSectionProps> = ({
  myFlashcards,
  settings,
  onBack,
  onStudySet,
  onDeleteSet,
}) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newSetName, setNewSetName] = useState("");
  const [newSetDescription, setNewSetDescription] = useState("");

  const handleCreateSet = () => {
    // This would create a new empty set - functionality can be extended
    setShowCreateDialog(false);
    setNewSetName("");
    setNewSetDescription("");
  };

  if (myFlashcards.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <Button onClick={onBack} variant="ghost" className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Browse
        </Button>

        <Card className="max-w-md mx-auto">
          <CardContent className="animate-fade-in p-8 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                No Saved Flashcards
              </h3>
              <p className="text-muted-foreground mb-4">
                Save flashcard sets from the browse section to start building
                your collection.
              </p>
              <Button onClick={onBack}>Browse Flashcards</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="ghost">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Browse
          </Button>
          <div>
            <h1 className="text-2xl font-bold">My Flashcards</h1>
            <p className="text-muted-foreground">
              {myFlashcards.length} saved set
              {myFlashcards.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Set
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Flashcard Set</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="set-name">Set Name</Label>
                <Input
                  id="set-name"
                  value={newSetName}
                  onChange={(e) => setNewSetName(e.target.value)}
                  placeholder="Enter set name"
                />
              </div>
              <div>
                <Label htmlFor="set-description">Description</Label>
                <Textarea
                  id="set-description"
                  value={newSetDescription}
                  onChange={(e) => setNewSetDescription(e.target.value)}
                  placeholder="Enter description"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateSet} disabled={!newSetName.trim()}>
                  Create
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myFlashcards.map((set) => (
          <Card key={set.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">
                    {set.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {set.topic}
                  </p>
                </div>
                {set.isCustom && (
                  <Badge variant="outline" className="ml-2">
                    Custom
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {set.description}
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">
                  {set.cards.length} cards
                </span>
                <div className="flex items-center gap-1">
                  {set.cards.slice(0, 3).map((card, index) => (
                    <Badge
                      key={index}
                      variant={
                        card.difficulty === "easy"
                          ? "default"
                          : card.difficulty === "medium"
                          ? "secondary"
                          : "destructive"
                      }
                      className="text-xs"
                    >
                      {card.difficulty[0].toUpperCase()}
                    </Badge>
                  ))}
                  {set.cards.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{set.cards.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => onStudySet(set)}
                  className="flex-1"
                >
                  <Play className="h-3 w-3 mr-1" />
                  Study
                </Button>
                <ExportDialog
                  data={{
                    name: set.name,
                    cards: set.cards.length,
                    topic: set.topic,
                  }}
                  title={set.name}
                >
                  <Button variant="outline" size="sm">
                    Export
                  </Button>
                </ExportDialog>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteSet(set.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
