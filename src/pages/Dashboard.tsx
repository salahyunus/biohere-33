import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { Plus, Grid3X3, List, Home, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFolders } from "@/hooks/useFolders";
import { FolderItem } from "@/components/FolderItem";
import { CreateFolderDialog } from "@/components/syllabus/CreateFolderDialog";
import { cn } from "@/lib/utils";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const {
    folders,
    createFolder,
    updateFolder,
    deleteFolder,
    reorderFolders,
    addNote,
    updateNote,
    deleteNote,
    addSyllabusObjective,
    removeSyllabusObjective,
    moveSyllabusObjective,
    addCalculationToFolder,
    deleteCalculationFromFolder,
    moveCalculationToFolder,
    getRootFolders,
    getChildFolders,
    getAllFolders,
  } = useFolders();

  useEffect(() => {
    const saved = localStorage.getItem("dashboard-view-mode");
    if (saved) {
      setViewMode(saved as "list" | "grid");
    }
  }, []);

  const handleViewModeChange = (mode: "list" | "grid") => {
    setViewMode(mode);
    localStorage.setItem("dashboard-view-mode", mode);
  };

  const handleFolderCreated = (folderId: string) => {
    // Folder created successfully - the UI will update automatically through the hook
    console.log("Folder created with ID:", folderId);
  };

  const handleCreateSubfolder = (
    name: string,
    icon: string,
    color: string,
    parentId: string
  ) => {
    return createFolder(name, icon, color, parentId);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (
      source.droppableId === "folders" &&
      destination.droppableId === "folders"
    ) {
      reorderFolders(source.index, destination.index);
    }
  };

  const rootFolders = getRootFolders();

  return (
    <div className="p-6 animate-fade-in max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-full p-3">
              <FolderPlus className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Study Dashboard</h1>
              <p className="text-muted-foreground">
                Organize your study materials with folders and notes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => navigate("/")} variant="outline">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">My Folders</h2>

          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleViewModeChange("list")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleViewModeChange("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>

            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Folder
            </Button>
          </div>
        </div>

        {rootFolders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FolderPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No folders yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first folder to start organizing your study
                materials
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Folder
              </Button>
            </CardContent>
          </Card>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
              droppableId="folders"
              direction={
                isMobile || viewMode === "list" ? "vertical" : "horizontal"
              }
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "space-y-4",
                    viewMode === "grid" &&
                      "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 space-y-0"
                  )}
                >
                  {rootFolders.map((folder, index) => (
                    <FolderItem
                      key={folder.id}
                      folder={folder}
                      index={index}
                      childFolders={getChildFolders(folder.id)}
                      onUpdate={updateFolder}
                      onDelete={deleteFolder}
                      onCreateSubfolder={handleCreateSubfolder}
                      onAddNote={addNote}
                      onUpdateNote={updateNote}
                      onDeleteNote={deleteNote}
                      onRemoveSyllabusObjective={removeSyllabusObjective}
                      onMoveSyllabusObjective={moveSyllabusObjective}
                      onAddCalculation={addCalculationToFolder}
                      onDeleteCalculation={deleteCalculationFromFolder}
                      onMoveCalculation={moveCalculationToFolder}
                      viewMode={viewMode}
                      allFolders={getAllFolders()}
                      isFirst={index === 0}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>

      <CreateFolderDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreateFolder={createFolder}
        onFolderCreated={handleFolderCreated}
      />
    </div>
  );
};

export default Dashboard;
