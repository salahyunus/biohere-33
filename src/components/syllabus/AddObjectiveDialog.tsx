import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SyllabusUnit } from "@/hooks/useSyllabusData";

interface AddObjectiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddObjective: (
    unitId: string,
    topicId: string,
    text: string,
    isNewTopic?: boolean,
    newTopicTitle?: string
  ) => void;
  units: SyllabusUnit[];
}

export const AddObjectiveDialog: React.FC<AddObjectiveDialogProps> = ({
  open,
  onOpenChange,
  onAddObjective,
  units = [], // Provide default empty array
}) => {
  const [text, setText] = useState("");
  const [selectedUnitId, setSelectedUnitId] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [topicOption, setTopicOption] = useState<"existing" | "new">(
    "existing"
  );
  const [newTopicTitle, setNewTopicTitle] = useState("");

  console.log("AddObjectiveDialog units:", units);

  const selectedUnit = units?.find((u) => u.id === selectedUnitId);
  const availableTopics = selectedUnit?.topics || [];

  const handleAdd = () => {
    console.log("Adding objective:", {
      text: text.trim(),
      selectedUnitId,
      topicOption,
      selectedTopicId,
      newTopicTitle: newTopicTitle.trim(),
    });

    if (text.trim() && selectedUnitId) {
      if (topicOption === "new" && newTopicTitle.trim()) {
        onAddObjective(
          selectedUnitId,
          "",
          text.trim(),
          true,
          newTopicTitle.trim()
        );
      } else if (topicOption === "existing" && selectedTopicId) {
        onAddObjective(selectedUnitId, selectedTopicId, text.trim());
      }

      // Reset form
      setText("");
      setSelectedUnitId("");
      setSelectedTopicId("");
      setTopicOption("existing");
      setNewTopicTitle("");
      onOpenChange(false);
    }
  };

  const isValid =
    text.trim() &&
    selectedUnitId &&
    ((topicOption === "existing" && selectedTopicId) ||
      (topicOption === "new" && newTopicTitle.trim()));

  if (!Array.isArray(units)) {
    console.error("Units is not an array:", units);
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md animate-scale-in">
        <DialogHeader>
          <DialogTitle>Add Custom Objective</DialogTitle>
          <DialogDescription>
            Create a new learning objective for a topic.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Unit</Label>
            <Select value={selectedUnitId} onValueChange={setSelectedUnitId}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select a unit" />
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedUnitId && (
            <div>
              <Label className="text-sm font-medium">Topic Option</Label>
              <RadioGroup
                value={topicOption}
                onValueChange={(value: "existing" | "new") =>
                  setTopicOption(value)
                }
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="existing" id="existing" />
                  <Label htmlFor="existing">Add to existing topic</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="new" id="new" />
                  <Label htmlFor="new">Create new topic</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {selectedUnitId && topicOption === "existing" && (
            <div>
              <Label className="text-sm font-medium">Topic</Label>
              <Select
                value={selectedTopicId}
                onValueChange={setSelectedTopicId}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
                <SelectContent>
                  {availableTopics.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id}>
                      {topic.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedUnitId && topicOption === "new" && (
            <div>
              <Label className="text-sm font-medium">New Topic Title</Label>
              <Input
                value={newTopicTitle}
                onChange={(e) => setNewTopicTitle(e.target.value)}
                placeholder="Enter new topic title"
                className="mt-2"
              />
            </div>
          )}

          <div>
            <Label className="text-sm font-medium">Objective Text</Label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the learning objective..."
              rows={4}
              className="mt-2"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={!isValid}>
            Add Objective
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
