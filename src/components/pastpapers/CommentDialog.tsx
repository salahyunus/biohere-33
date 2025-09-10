import React, { useState } from "react";
import { MessageSquare, Tag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { type PastPaper, usePastPapers } from "@/hooks/usePastPapers";

interface CommentDialogProps {
  paper: PastPaper;
  questionNumber: string;
  onClose: () => void;
}

export const CommentDialog: React.FC<CommentDialogProps> = ({
  paper,
  questionNumber,
  onClose,
}) => {
  const [comment, setComment] = useState(paper.comments[questionNumber] || "");
  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState(paper.tags[questionNumber] || []);

  const { addComment, addTag, removeTag } = usePastPapers();

  const handleSaveComment = () => {
    if (comment.trim()) {
      addComment(paper.id, questionNumber, comment);
    }
    onClose();
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      addTag(paper.id, questionNumber, newTag.trim());
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
    removeTag(paper.id, questionNumber, tagToRemove);
  };

  const quickTags = [
    "Important",
    "Remember",
    "Difficult",
    "Review Later",
    "Common Question",
  ];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Question {questionNumber} - {paper.year} {paper.session}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              placeholder="Add your comment or notes about this question..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <Label>Tags</Label>

            {/* Current Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag} ×
                  </Badge>
                ))}
              </div>
            )}

            {/* Quick Tags */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">
                Quick Tags:
              </Label>
              <div className="flex flex-wrap gap-1">
                {quickTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => {
                      if (!tags.includes(tag)) {
                        const updatedTags = [...tags, tag];
                        setTags(updatedTags);
                        addTag(paper.id, questionNumber, tag);
                      }
                    }}
                  >
                    + {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Custom Tag Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Add custom tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
              />
              <Button onClick={handleAddTag} variant="outline" size="sm">
                Add Tag
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSaveComment}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Save Comment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
