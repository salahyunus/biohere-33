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
import {
  Folder,
  FolderOpen,
  Book,
  FileQuestion,
  Brain,
  FileText,
  StickyNote,
} from "lucide-react";
import { useFolders } from "@/hooks/useFolders";

const iconOptions = [
  { icon: Folder, name: "folder" },
  { icon: FolderOpen, name: "folder-open" },
  { icon: Book, name: "book" },
  { icon: FileQuestion, name: "file-question" },
  { icon: Brain, name: "brain" },
  { icon: FileText, name: "file-text" },
  { icon: StickyNote, name: "sticky-note" },
];

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

interface CreateFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFolderCreated: (folderId: string) => void;
  parentId?: string | null;
  onCreateFolder?: (name: string, icon: string, color: string) => void;
}

export const CreateFolderDialog: React.FC<CreateFolderDialogProps> = ({
  open,
  onOpenChange,
  onFolderCreated,
  parentId = null,
  onCreateFolder,
}) => {
  const [folderName, setFolderName] = useState("");
  const [folderIcon, setFolderIcon] = useState("folder");
  const [folderColor, setFolderColor] = useState("blue");

  const { createFolder } = useFolders();

  const handleCreateFolder = () => {
    if (folderName.trim()) {
      if (onCreateFolder) {
        // Use the provided callback for subfolder creation
        onCreateFolder(folderName.trim(), folderIcon, folderColor);
      } else {
        // Use the hook for root folder creation
        const newFolder = createFolder(
          folderName.trim(),
          folderIcon,
          folderColor,
          parentId
        );
        onFolderCreated(newFolder.id);
      }
      handleClose();
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setFolderName("");
    setFolderIcon("folder");
    setFolderColor("blue");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {parentId ? "Create New Subfolder" : "Create New Folder"}
          </DialogTitle>
          <DialogDescription>
            {parentId
              ? "Create a new subfolder to organize your study materials."
              : "Create a new folder to organize your study materials."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">
              {parentId ? "Subfolder Name" : "Folder Name"}
            </label>
            <Input
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder={
                parentId ? "Enter subfolder name" : "Enter folder name"
              }
              onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Icon</label>
            <div className="flex gap-2 mt-2 flex-wrap">
              {iconOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <Button
                    key={option.name}
                    variant={folderIcon === option.name ? "default" : "outline"}
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setFolderIcon(option.name)}
                  >
                    <IconComponent className="h-5 w-5" />
                  </Button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Color</label>
            <div className="flex gap-2 mt-2 flex-wrap">
              {colorOptions.map((option) => (
                <Button
                  key={option.name}
                  variant={folderColor === option.name ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setFolderColor(option.name)}
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
          <Button onClick={handleCreateFolder} disabled={!folderName.trim()}>
            {parentId ? "Create Subfolder" : "Create Folder"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
