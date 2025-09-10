import React, { useState } from "react";
import { X, Plus, Folder } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SyllabusObjective } from "@/hooks/useSyllabusData";
import { useFolders } from "@/hooks/useFolders";
import { CreateFolderDialog } from "./CreateFolderDialog";

interface ObjectiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  objective: SyllabusObjective;
  onUpdate: (updates: Partial<SyllabusObjective>) => void;
}

const predefinedTags = [
  "important",
  "difficult",
  "easy",
  "review",
  "memorize",
  "understand",
  "apply",
];

export const ObjectiveDialog: React.FC<ObjectiveDialogProps> = ({
  open,
  onOpenChange,
  objective,
  onUpdate,
}) => {
  const [tags, setTags] = useState<string[]>(objective.tags || []);
  const [newTag, setNewTag] = useState("");
  const [comment, setComment] = useState(objective.comment || "");
  const [selectedFolderId, setSelectedFolderId] = useState(
    objective.folderId || "none"
  );
  const [showCreateFolder, setShowCreateFolder] = useState(false);

  const { getRootFolders, addSyllabusObjective, removeSyllabusObjective } =
    useFolders();
  const folders = getRootFolders();

  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setNewTag("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = () => {
    console.log("Saving objective updates:", {
      tags,
      comment,
      folderId: selectedFolderId === "none" ? undefined : selectedFolderId,
    });

    const updates = {
      tags,
      comment,
      folderId: selectedFolderId === "none" ? undefined : selectedFolderId,
    };

    // If there was a previous folder association, remove it
    if (objective.folderId && objective.folderId !== selectedFolderId) {
      removeSyllabusObjective(objective.folderId, objective.id);
    }

    // If a new folder is selected, add the objective to it
    if (selectedFolderId !== "none") {
      addSyllabusObjective(
        selectedFolderId,
        objective.id,
        objective.text,
        "Unknown Unit", // You might want to pass this from parent
        "Unknown Topic" // You might want to pass this from parent
      );
    }

    onUpdate(updates);
    onOpenChange(false);
  };

  const handleFolderCreated = (folderId: string) => {
    setSelectedFolderId(folderId);
    setShowCreateFolder(false);
  };

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case "important":
        return "bg-red-500 hover:bg-red-600";
      case "difficult":
        return "bg-orange-500 hover:bg-orange-600";
      case "easy":
        return "bg-green-500 hover:bg-green-600";
      case "review":
        return "bg-yellow-500 hover:bg-yellow-600";
      default:
        return "bg-blue-500 hover:bg-blue-600";
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Objective</DialogTitle>
            <DialogDescription className="text-sm">
              {objective.text}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Tags Section */}
            <div>
              <Label className="text-sm font-medium">Tags</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <Badge
                    key={index}
                    className={`text-white cursor-pointer ${getTagColor(tag)}`}
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Add custom tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddTag(newTag)}
                  className="text-sm"
                />
                <Button
                  size="sm"
                  onClick={() => handleAddTag(newTag)}
                  disabled={!newTag || tags.includes(newTag)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-1 mt-2">
                {predefinedTags
                  .filter((tag) => !tags.includes(tag))
                  .map((tag) => (
                    <Button
                      key={tag}
                      variant="outline"
                      size="sm"
                      className="text-xs h-6"
                      onClick={() => handleAddTag(tag)}
                    >
                      {tag}
                    </Button>
                  ))}
              </div>
            </div>

            {/* Comment Section */}
            <div>
              <Label className="text-sm font-medium">Comment</Label>
              <Textarea
                placeholder="Add a personal note or comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-2 text-sm"
                rows={3}
              />
            </div>

            {/* Folder Selection */}
            <div>
              <Label className="text-sm font-medium">Save to Folder</Label>
              <div className="flex gap-2 mt-2">
                <Select
                  value={selectedFolderId}
                  onValueChange={setSelectedFolderId}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a folder (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {folders.map((folder) => (
                      <SelectItem key={folder.id} value={folder.id}>
                        {folder.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowCreateFolder(true)}
                  title="Create new folder"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CreateFolderDialog
        open={showCreateFolder}
        onOpenChange={setShowCreateFolder}
        onFolderCreated={handleFolderCreated}
      />
    </>
  );
};
