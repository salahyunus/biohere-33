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
import { FolderIconSelector } from "./FolderIconSelector";

const colorOptions = [
  { name: "blue", class: "bg-blue-500" },
  { name: "green", class: "bg-green-500" },
  { name: "purple", class: "bg-purple-500" },
  { name: "red", class: "bg-red-500" },
  { name: "orange", class: "bg-orange-500" },
  { name: "yellow", class: "bg-yellow-500" },
  { name: "pink", class: "bg-pink-500" },
  { name: "indigo", class: "bg-indigo-500" },
];

interface SubfolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateSubfolder: (name: string, icon: string, color: string) => void;
}

export const SubfolderDialog: React.FC<SubfolderDialogProps> = ({
  open,
  onOpenChange,
  onCreateSubfolder,
}) => {
  const [subfolderName, setSubfolderName] = useState("");
  const [subfolderIcon, setSubfolderIcon] = useState("folder");
  const [subfolderColor, setSubfolderColor] = useState("blue");

  const handleCreate = () => {
    if (subfolderName.trim()) {
      onCreateSubfolder(subfolderName.trim(), subfolderIcon, subfolderColor);
      handleClose();
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setSubfolderName("");
    setSubfolderIcon("folder");
    setSubfolderColor("blue");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Subfolder</DialogTitle>
          <DialogDescription>
            Create a new subfolder to organize your study materials.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Subfolder Name</label>
            <Input
              value={subfolderName}
              onChange={(e) => setSubfolderName(e.target.value)}
              placeholder="Enter subfolder name"
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Icon</label>
            <div className="mt-2">
              <FolderIconSelector
                selectedIcon={subfolderIcon}
                onIconSelect={setSubfolderIcon}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Color</label>
            <div className="flex gap-2 mt-2 flex-wrap">
              {colorOptions.map((option) => (
                <Button
                  key={option.name}
                  variant={
                    subfolderColor === option.name ? "default" : "outline"
                  }
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setSubfolderColor(option.name)}
                >
                  <div className={`h-4 w-4 rounded-full ${option.class}`} />
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!subfolderName.trim()}>
            Create Subfolder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
