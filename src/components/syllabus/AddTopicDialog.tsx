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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSyllabusData } from "@/hooks/useSyllabusData";

interface AddTopicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTopic: (unitId: string, title: string) => void;
}

export const AddTopicDialog: React.FC<AddTopicDialogProps> = ({
  open,
  onOpenChange,
  onAddTopic,
}) => {
  const [title, setTitle] = useState("");
  const [selectedUnitId, setSelectedUnitId] = useState("");
  const { units } = useSyllabusData();

  const handleAdd = () => {
    if (title.trim() && selectedUnitId) {
      onAddTopic(selectedUnitId, title.trim());
      setTitle("");
      setSelectedUnitId("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Custom Topic</DialogTitle>
          <DialogDescription>
            Create a new topic to organize your custom objectives.
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

          <div>
            <Label className="text-sm font-medium">Topic Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter topic title"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="mt-2"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!title.trim() || !selectedUnitId}
          >
            Add Topic
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
