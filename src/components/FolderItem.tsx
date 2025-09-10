import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Folder,
  FolderOpen,
  Book,
  FileQuestion,
  Brain,
  FileText,
  StickyNote,
  Calculator,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  GripVertical,
  MoreHorizontal,
  FolderPlus,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Folder as FolderType, DashboardCalculation } from "@/hooks/useFolders";
import { SyllabusObjectiveCard } from "./SyllabusObjectiveCard";
import { NoteEditor } from "./NoteEditor";
import { SubfolderDialog } from "./SubfolderDialog";
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

interface FolderItemProps {
  folder: FolderType;
  index: number;
  childFolders: FolderType[];
  onUpdate: (id: string, updates: Partial<FolderType>) => void;
  onDelete: (id: string) => void;
  onCreateSubfolder: (
    name: string,
    icon: string,
    color: string,
    parentId: string
  ) => void;
  onAddNote: (folderId: string, title: string, content: string) => void;
  onUpdateNote: (folderId: string, noteId: string, updates: any) => void;
  onDeleteNote: (folderId: string, noteId: string) => void;
  onRemoveSyllabusObjective: (folderId: string, objectiveId: string) => void;
  onMoveSyllabusObjective: (
    fromFolderId: string,
    toFolderId: string,
    objectiveId: string
  ) => boolean;
  onAddCalculation: (
    folderId: string,
    calculation: DashboardCalculation
  ) => void;
  onDeleteCalculation: (folderId: string, calculationId: string) => void;
  onMoveCalculation: (
    fromFolderId: string,
    toFolderId: string,
    calculationId: string
  ) => boolean;
  viewMode: "list" | "grid";
  allFolders?: FolderType[];
  isFirst?: boolean;
}

const iconComponents = {
  folder: Folder,
  "folder-open": FolderOpen,
  book: Book,
  "file-question": FileQuestion,
  brain: Brain,
  "file-text": FileText,
  "sticky-note": StickyNote,
  calculator: Calculator,
};

const colorClasses = {
  blue: "text-blue-500",
  green: "text-green-500",
  purple: "text-purple-500",
  red: "text-red-500",
  orange: "text-orange-500",
  yellow: "text-yellow-500",
  pink: "text-pink-500",
  indigo: "text-indigo-500",
};

export const FolderItem: React.FC<FolderItemProps> = ({
  folder,
  index,
  childFolders,
  onUpdate,
  onDelete,
  onCreateSubfolder,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onRemoveSyllabusObjective,
  onMoveSyllabusObjective,
  onAddCalculation,
  onDeleteCalculation,
  onMoveCalculation,
  viewMode,
  allFolders = [],
  isFirst = false,
}) => {
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubfoldersExpanded, setIsSubfoldersExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingIcon, setIsEditingIcon] = useState(false);
  const [editName, setEditName] = useState(folder.name);
  const [editIcon, setEditIcon] = useState(folder.icon);
  const [editColor, setEditColor] = useState(folder.color);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [showSubfolderDialog, setShowSubfolderDialog] = useState(false);
  const [expandedSubfolders, setExpandedSubfolders] = useState<Set<string>>(
    new Set()
  );
  const [editingSubfolder, setEditingSubfolder] = useState<string | null>(null);
  const [editSubfolderName, setEditSubfolderName] = useState("");

  const IconComponent =
    iconComponents[folder.icon as keyof typeof iconComponents] || Folder;
  const colorClass =
    colorClasses[folder.color as keyof typeof colorClasses] || "text-blue-500";

  const handleSave = () => {
    onUpdate(folder.id, { name: editName });
    setIsEditing(false);
  };

  const handleIconSave = () => {
    onUpdate(folder.id, { icon: editIcon, color: editColor });
    setIsEditingIcon(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    }
    if (e.key === "Escape") {
      setEditName(folder.name);
      setIsEditing(false);
    }
  };

  const getTotalItems = () => {
    const items = folder.items || {
      bookmarkedLessons: [],
      questions: [],
      quizzes: [],
      pastPapers: [],
      syllabusObjectives: [],
      calculations: [],
    };
    return (
      (items.bookmarkedLessons?.length || 0) +
      (items.questions?.length || 0) +
      (items.quizzes?.length || 0) +
      (items.pastPapers?.length || 0) +
      (items.syllabusObjectives?.length || 0) +
      (items.calculations?.length || 0) +
      (folder.notes?.length || 0)
    );
  };

  const toggleSubfolderExpansion = (subfolderId: string) => {
    const newExpanded = new Set(expandedSubfolders);
    if (newExpanded.has(subfolderId)) {
      newExpanded.delete(subfolderId);
    } else {
      newExpanded.add(subfolderId);
    }
    setExpandedSubfolders(newExpanded);
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const objectiveData = e.dataTransfer.getData(
      "application/x-syllabus-objective"
    );
    const calculationData = e.dataTransfer.getData("application/x-calculation");

    if (objectiveData) {
      try {
        const { fromFolderId, objective } = JSON.parse(objectiveData);
        if (fromFolderId !== folder.id) {
          onMoveSyllabusObjective(
            fromFolderId,
            folder.id,
            objective.objectiveId
          );
        }
      } catch (e) {
        console.error("Failed to parse objective drop data");
      }
    }

    if (calculationData) {
      try {
        const { fromFolderId, calculation } = JSON.parse(calculationData);
        if (fromFolderId !== folder.id) {
          onMoveCalculation(fromFolderId, folder.id, calculation.id);
        }
      } catch (e) {
        console.error("Failed to parse calculation drop data");
      }
    }
  };

  const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
  };

  // Get calculations with proper typing
  const calculations = folder.items?.calculations || [];

  // Subfolder component with drag and drop and expansion
  const SubfolderItem: React.FC<{ subfolder: FolderType }> = ({
    subfolder,
  }) => {
    const SubIconComponent =
      iconComponents[subfolder.icon as keyof typeof iconComponents] || Folder;
    const subColorClass =
      colorClasses[subfolder.color as keyof typeof colorClasses] ||
      "text-blue-500";
    const isSubfolderExpanded = expandedSubfolders.has(subfolder.id);
    const subfolderItems = subfolder.items || {
      syllabusObjectives: [],
      calculations: [],
    };
    const totalSubfolderItems =
      (subfolderItems.syllabusObjectives?.length || 0) +
      (subfolderItems.calculations?.length || 0) +
      (subfolder.notes?.length || 0);
    const isEditingThis = editingSubfolder === subfolder.id;

    const handleSubfolderSave = () => {
      onUpdate(subfolder.id, { name: editSubfolderName });
      setEditingSubfolder(null);
    };

    const handleSubfolderKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSubfolderSave();
      }
      if (e.key === "Escape") {
        setEditSubfolderName(subfolder.name);
        setEditingSubfolder(null);
      }
    };

    const startEditingSubfolder = () => {
      setEditingSubfolder(subfolder.id);
      setEditSubfolderName(subfolder.name);
    };

    const handleSubfolderDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const objectiveData = e.dataTransfer.getData(
        "application/x-syllabus-objective"
      );
      const calculationData = e.dataTransfer.getData(
        "application/x-calculation"
      );

      if (objectiveData) {
        try {
          const { fromFolderId, objective } = JSON.parse(objectiveData);
          if (fromFolderId !== subfolder.id) {
            onMoveSyllabusObjective(
              fromFolderId,
              subfolder.id,
              objective.objectiveId
            );
          }
        } catch (e) {
          console.error("Failed to parse objective drop data");
        }
      }

      if (calculationData) {
        try {
          const { fromFolderId, calculation } = JSON.parse(calculationData);
          if (fromFolderId !== subfolder.id) {
            onMoveCalculation(fromFolderId, subfolder.id, calculation.id);
          }
        } catch (e) {
          console.error("Failed to parse calculation drop data");
        }
      }
    };

    return (
      <div>
        <Card
          className="cursor-pointer hover:bg-muted/50 border-l-4 border-l-primary/20 group"
          onDrop={handleSubfolderDrop}
          onDragOver={onDragOver}
        >
          <CardContent className="p-3 animate-fade-in">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSubfolderExpansion(subfolder.id)}
                className="p-1 h-auto"
              >
                {isSubfolderExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
              <SubIconComponent className={`h-5 w-5 ${subColorClass}`} />
              <div className="flex-1">
                {isEditingThis ? (
                  <Input
                    value={editSubfolderName}
                    onChange={(e) => setEditSubfolderName(e.target.value)}
                    onBlur={handleSubfolderSave}
                    onKeyDown={handleSubfolderKeyPress}
                    className="text-sm font-medium"
                    autoFocus
                  />
                ) : (
                  <p className="text-sm font-medium truncate">
                    {subfolder.name}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {totalSubfolderItems} items
                </p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={startEditingSubfolder}
                  className="h-6 w-6 p-0"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(subfolder.id)}
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expanded subfolder content */}
        {isSubfolderExpanded && (
          <div className="ml-8 mt-2 space-y-2">
            {/* Subfolder calculations */}
            {subfolderItems.calculations &&
              subfolderItems.calculations.length > 0 && (
                <div className="space-y-2">
                  {subfolderItems.calculations.map((calc) => (
                    <Card
                      key={calc.id}
                      className="border-l-4 border-l-primary cursor-move group"
                      draggable
                      onDragStart={(e) => {
                        const dragData = JSON.stringify({
                          type: "calculation",
                          fromFolderId: subfolder.id,
                          calculation: calc,
                        });
                        e.dataTransfer.setData(
                          "application/x-calculation",
                          dragData
                        );
                      }}
                    >
                      <CardContent className="pt-3 pb-3 animate-fade-in">
                        <div className="flex justify-between items-start mb-1">
                          <div className="text-sm font-bold">
                            {calc.grade} ({calc.ums})
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right text-xs text-muted-foreground">
                              <div>
                                {calc.year}{" "}
                                {calc.session.charAt(0).toUpperCase() +
                                  calc.session.slice(1)}
                              </div>
                              <div>
                                {new Date(calc.timestamp).toLocaleDateString()}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                onDeleteCalculation(subfolder.id, calc.id)
                              }
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Raw Mark:{" "}
                          <span className="font-medium">{calc.rawMark}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

            {/* Subfolder syllabus objectives */}
            {subfolderItems.syllabusObjectives &&
              subfolderItems.syllabusObjectives.length > 0 && (
                <div className="space-y-2">
                  {subfolderItems.syllabusObjectives.map((objective) => (
                    <SyllabusObjectiveCard
                      key={objective.id}
                      objective={objective}
                      folderId={subfolder.id}
                      onRemove={() =>
                        onRemoveSyllabusObjective(
                          subfolder.id,
                          objective.objectiveId
                        )
                      }
                    />
                  ))}
                </div>
              )}

            {/* Subfolder notes */}
            {subfolder.notes && subfolder.notes.length > 0 && (
              <div className="space-y-2">
                {subfolder.notes.map((note) => (
                  <Card
                    key={note.id}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <CardContent
                      className="p-3 animate-fade-in"
                      onClick={() => setSelectedNote(note)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium text-sm">{note.title}</h5>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {note.content.substring(0, 100)}...
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteNote(subfolder.id, note.id);
                          }}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (viewMode === "grid") {
    return (
      <Draggable
        draggableId={folder.id}
        index={index}
        isDragDisabled={folder.parentId !== null}
      >
        {(provided, snapshot) => (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`cursor-pointer hover:shadow-md transition-shadow relative group ${
              snapshot.isDragging ? "rotate-2 shadow-lg" : ""
            }`}
            onClick={() => setIsExpanded(!isExpanded)}
            onDrop={onDrop}
            onDragOver={onDragOver}
          >
            <div
              {...provided.dragHandleProps}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardContent className="p-4 animate-fade-in">
              <div className="flex flex-col items-center text-center space-y-2">
                <IconComponent className={`h-8 w-8 ${colorClass}`} />
                <div className="w-full">
                  {isEditing ? (
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={handleSave}
                      onKeyDown={handleKeyPress}
                      className="text-center"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <h3 className="font-medium text-sm truncate">
                      {folder.name}
                    </h3>
                  )}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {getTotalItems()} items
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </Draggable>
    );
  }

  return (
    <Draggable
      draggableId={folder.id}
      index={index}
      isDragDisabled={folder.parentId !== null}
    >
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <Card
            className={`mb-3 group ${
              snapshot.isDragging ? "shadow-lg rotate-1" : ""
            }`}
            onDrop={onDrop}
            onDragOver={onDragOver}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    {...provided.dragHandleProps}
                    className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-1"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingIcon(true)}
                    className="p-2"
                  >
                    <IconComponent className={`h-10 w-10 ${colorClass}`} />
                  </Button>

                  <div className="flex-1">
                    {isEditing ? (
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={handleKeyPress}
                        className="font-medium"
                        autoFocus
                      />
                    ) : (
                      <CardTitle className="text-lg">{folder.name}</CardTitle>
                    )}
                    <CardDescription className="mt-1">
                      {getTotalItems()} items • {childFolders.length} subfolders
                    </CardDescription>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`${
                          isFirst
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                        } transition-opacity`}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48">
                      <div className="space-y-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => onAddNote(folder.id, "New Note", "")}
                        >
                          <StickyNote className="h-4 w-4 mr-2" />
                          Add Note
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => setShowSubfolderDialog(true)}
                        >
                          <FolderPlus className="h-4 w-4 mr-2" />
                          Add Subfolder
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => setIsEditing(true)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Rename
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-destructive"
                          onClick={() => onDelete(folder.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardHeader>

            {isExpanded && (
              <CardContent className="pt-0 animate-fade-in">
                <div className="space-y-4">
                  {/* Calculations Section */}
                  {calculations.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Calculator className="h-4 w-4" />
                        Saved Calculations ({calculations.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {calculations.map((calc) => (
                          <Card
                            key={calc.id}
                            className="border-l-4 border-l-primary cursor-move group"
                            draggable
                            onDragStart={(e) => {
                              const dragData = JSON.stringify({
                                type: "calculation",
                                fromFolderId: folder.id,
                                calculation: calc,
                              });
                              e.dataTransfer.setData(
                                "application/x-calculation",
                                dragData
                              );
                            }}
                          >
                            <CardContent className="pt-3 pb-3 animate-fade-in">
                              <div className="flex justify-between items-start mb-1">
                                <div className="text-sm font-bold">
                                  {calc.grade} ({calc.ums})
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="text-right text-xs text-muted-foreground">
                                    <div>
                                      {calc.year}{" "}
                                      {calc.session.charAt(0).toUpperCase() +
                                        calc.session.slice(1)}
                                    </div>
                                    <div>
                                      {new Date(
                                        calc.timestamp
                                      ).toLocaleDateString()}
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      onDeleteCalculation(folder.id, calc.id)
                                    }
                                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Raw Mark:{" "}
                                <span className="font-medium">
                                  {calc.rawMark}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Syllabus Objectives Section */}
                  {folder.items?.syllabusObjectives &&
                    folder.items.syllabusObjectives.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Brain className="h-4 w-4" />
                          Syllabus Objectives (
                          {folder.items.syllabusObjectives.length})
                        </h4>
                        <div className="space-y-2">
                          {folder.items.syllabusObjectives.map((objective) => (
                            <SyllabusObjectiveCard
                              key={objective.id}
                              objective={objective}
                              folderId={folder.id}
                              onRemove={() =>
                                onRemoveSyllabusObjective(
                                  folder.id,
                                  objective.objectiveId
                                )
                              }
                            />
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Notes Section */}
                  {folder.notes && folder.notes.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <StickyNote className="h-4 w-4" />
                        Notes ({folder.notes.length})
                      </h4>
                      <div className="space-y-2">
                        {folder.notes.map((note) => (
                          <Card
                            key={note.id}
                            className="cursor-pointer hover:bg-muted/50"
                          >
                            <CardContent
                              className="p-3 animate-fade-in"
                              onClick={() => setSelectedNote(note)}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="font-medium text-sm">
                                    {note.title}
                                  </h5>
                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {note.content.substring(0, 100)}...
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteNote(folder.id, note.id);
                                  }}
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
                  )}

                  {/* Child Folders */}
                  {childFolders.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                          <FolderPlus className="h-4 w-4" />
                          Subfolders ({childFolders.length})
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setIsSubfoldersExpanded(!isSubfoldersExpanded)
                          }
                        >
                          {isSubfoldersExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      {isSubfoldersExpanded && (
                        <div className="space-y-2">
                          {childFolders.map((childFolder) => (
                            <SubfolderItem
                              key={childFolder.id}
                              subfolder={childFolder}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>

          {/* Icon and Color Editor Dialog */}
          {isEditingIcon && (
            <Dialog open={isEditingIcon} onOpenChange={setIsEditingIcon}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Change Folder Icon & Color</DialogTitle>
                  <DialogDescription>
                    Choose a new icon and color for your folder.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Icon</label>
                    <div className="mt-2">
                      <FolderIconSelector
                        selectedIcon={editIcon}
                        onIconSelect={setEditIcon}
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
                            editColor === option.name ? "default" : "outline"
                          }
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setEditColor(option.name)}
                        >
                          <div
                            className={`h-4 w-4 rounded-full ${option.class}`}
                          />
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditingIcon(false);
                      setEditIcon(folder.icon);
                      setEditColor(folder.color);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleIconSave}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* Note Editor Dialog */}
          {selectedNote && (
            <Dialog
              open={!!selectedNote}
              onOpenChange={() => setSelectedNote(null)}
            >
              <DialogContent className="max-w-4xl max-h-[90vh]">
                <NoteEditor
                  note={selectedNote}
                  folderId={folder.id}
                  onUpdate={onUpdateNote}
                  onDelete={onDeleteNote}
                />
              </DialogContent>
            </Dialog>
          )}

          {/* Subfolder Dialog */}
          <SubfolderDialog
            open={showSubfolderDialog}
            onOpenChange={setShowSubfolderDialog}
            onCreateSubfolder={(name, icon, color) =>
              onCreateSubfolder(name, icon, color, folder.id)
            }
          />
        </div>
      )}
    </Draggable>
  );
};
