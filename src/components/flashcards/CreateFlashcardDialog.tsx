import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { Flashcard } from "@/data/flashcards";

interface CreateFlashcardDialogProps {
  onCreateCard: (card: Flashcard) => void;
  children: React.ReactNode;
}

export const CreateFlashcardDialog: React.FC<CreateFlashcardDialogProps> = ({
  onCreateCard,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [topic, setTopic] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  );
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [answerImageUrl, setAnswerImageUrl] = useState("");

  const resetForm = () => {
    setQuestion("");
    setAnswer("");
    setTopic("");
    setSubtopic("");
    setDifficulty("medium");
    setTags([]);
    setNewTag("");
    setImageUrl("");
    setAnswerImageUrl("");
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleCreate = () => {
    if (!question.trim() || !answer.trim() || !topic.trim()) return;

    const newCard: Flashcard = {
      id: `custom-${Date.now()}-${Math.random()}`,
      question: question.trim(),
      answer: answer.trim(),
      topic: topic.trim(),
      subtopic: subtopic.trim() || undefined,
      difficulty,
      tags,
      imageUrl: imageUrl.trim() || undefined,
      answerImageUrl: answerImageUrl.trim() || undefined,
    };

    onCreateCard(newCard);
    setIsOpen(false);
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Flashcard</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="topic">Topic *</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Biology"
              />
            </div>
            <div>
              <Label htmlFor="subtopic">Subtopic</Label>
              <Input
                id="subtopic"
                value={subtopic}
                onChange={(e) => setSubtopic(e.target.value)}
                placeholder="e.g., Cell Structure"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="question">Question *</Label>
            <Textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your question here..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="answer">Answer *</Label>
            <Textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter the answer here..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select
              value={difficulty}
              onValueChange={(value: "easy" | "medium" | "hard") =>
                setDifficulty(value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
              />
              <Button type="button" onClick={addTag} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="cursor-pointer">
                  {tag}
                  <X className="h-3 w-3 ml-1" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="imageUrl">Question Image URL</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="answerImageUrl">Answer Image URL</Label>
              <Input
                id="answerImageUrl"
                value={answerImageUrl}
                onChange={(e) => setAnswerImageUrl(e.target.value)}
                placeholder="https://example.com/answer-image.jpg"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!question.trim() || !answer.trim() || !topic.trim()}
          >
            Create Flashcard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
