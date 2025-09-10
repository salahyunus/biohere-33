import { useState, useEffect } from "react";

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface SyllabusObjectiveLink {
  id: string;
  objectiveId: string;
  objectiveText: string;
  unitTitle: string;
  topicTitle: string;
  addedAt: string;
}

export interface DashboardCalculation {
  id: string;
  year: string;
  session: string;
  rawMark: number;
  grade: string;
  ums: number;
  timestamp: number;
}

export interface Folder {
  id: string;
  name: string;
  icon: string;
  color: string;
  parentId: string | null;
  order: number;
  notes: Note[];
  items: {
    bookmarkedLessons: string[];
    questions: string[];
    quizzes: string[];
    pastPapers: string[];
    syllabusObjectives: SyllabusObjectiveLink[];
    calculations: DashboardCalculation[];
  };
}

const FOLDERS_STORAGE_KEY = "biology-app-folders";
const SYLLABUS_STORAGE_KEY = "syllabus-units";
const FOLDERS_UPDATED_EVENT = "biology-app-folders-updated";

// Helper to resolve objective metadata from stored syllabus units
const resolveObjectiveMeta = (objectiveId: string) => {
  try {
    const units = JSON.parse(
      localStorage.getItem(SYLLABUS_STORAGE_KEY) || "[]"
    );
    for (const unit of units) {
      // unit.topics
      for (const topic of unit.topics || []) {
        const foundInTopic = (topic.objectives || []).find(
          (o: any) => o.id === objectiveId
        );
        if (foundInTopic) {
          return {
            objectiveText: foundInTopic.text,
            unitTitle: unit.title || "Unknown Unit",
            topicTitle: topic.title || "Unknown Topic",
          };
        }
        // subtopics
        for (const sub of topic.subtopics || []) {
          const foundInSub = (sub.objectives || []).find(
            (o: any) => o.id === objectiveId
          );
          if (foundInSub) {
            return {
              objectiveText: foundInSub.text,
              unitTitle: unit.title || "Unknown Unit",
              topicTitle: `${topic.title || "Unknown Topic"} › ${
                sub.title || ""
              }`.trim(),
            };
          }
        }
      }
    }
  } catch (e) {
    // silent fallback
  }
  return {
    objectiveText: "Objective",
    unitTitle: "Unknown Unit",
    topicTitle: "Unknown Topic",
  };
};

export const useFolders = () => {
  const [folders, setFolders] = useState<Folder[]>([]);

  useEffect(() => {
    const savedFolders = localStorage.getItem(FOLDERS_STORAGE_KEY);
    if (savedFolders) {
      setFolders(JSON.parse(savedFolders));
    }

    // Sync across components/tabs when storage or custom event fires
    const handleSync = () => {
      const updated = localStorage.getItem(FOLDERS_STORAGE_KEY);
      if (updated) {
        setFolders(JSON.parse(updated));
      } else {
        setFolders([]);
      }
    };

    window.addEventListener("storage", (e) => {
      if (e.key === FOLDERS_STORAGE_KEY) handleSync();
    });
    window.addEventListener(FOLDERS_UPDATED_EVENT, handleSync as EventListener);

    return () => {
      window.removeEventListener(
        FOLDERS_UPDATED_EVENT,
        handleSync as EventListener
      );
      // storage listener cannot be removed easily by inline function; acceptable as it's global and harmless
    };
  }, []);

  const broadcastUpdate = () => {
    window.dispatchEvent(new Event(FOLDERS_UPDATED_EVENT));
  };

  const saveFolders = (newFolders: Folder[]) => {
    setFolders(newFolders);
    localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(newFolders));
    broadcastUpdate();
  };

  const createFolder = (
    name: string,
    icon: string,
    color: string = "blue",
    parentId: string | null = null
  ) => {
    const siblingFolders = folders.filter((f) => f.parentId === parentId);
    const newFolder: Folder = {
      id: crypto.randomUUID(),
      name,
      icon,
      color,
      parentId,
      order: siblingFolders.length,
      notes: [],
      items: {
        bookmarkedLessons: [],
        questions: [],
        quizzes: [],
        pastPapers: [],
        syllabusObjectives: [],
        calculations: [],
      },
    };

    saveFolders([...folders, newFolder]);
    return newFolder;
  };

  const updateFolder = (id: string, updates: Partial<Folder>) => {
    const updatedFolders = folders.map((folder) =>
      folder.id === id ? { ...folder, ...updates } : folder
    );
    saveFolders(updatedFolders);
  };

  const deleteFolder = (id: string) => {
    const updatedFolders = folders.filter(
      (folder) => folder.id !== id && folder.parentId !== id
    );
    saveFolders(updatedFolders);
  };

  const reorderFolders = (
    startIndex: number,
    endIndex: number,
    parentId: string | null = null
  ) => {
    const siblingFolders = folders
      .filter((f) => f.parentId === parentId)
      .sort((a, b) => a.order - b.order);
    const [removed] = siblingFolders.splice(startIndex, 1);
    siblingFolders.splice(endIndex, 0, removed);

    const updatedFolders = folders.map((folder) => {
      if (folder.parentId === parentId) {
        const newIndex = siblingFolders.findIndex((f) => f.id === folder.id);
        return { ...folder, order: newIndex };
      }
      return folder;
    });

    saveFolders(updatedFolders);
  };

  const addNote = (folderId: string, title: string, content: string) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedFolders = folders.map((folder) =>
      folder.id === folderId
        ? { ...folder, notes: [...(folder.notes || []), newNote] }
        : folder
    );
    saveFolders(updatedFolders);
    return newNote;
  };

  const updateNote = (
    folderId: string,
    noteId: string,
    updates: Partial<Note>
  ) => {
    const updatedFolders = folders.map((folder) =>
      folder.id === folderId
        ? {
            ...folder,
            notes: (folder.notes || []).map((note) =>
              note.id === noteId
                ? { ...note, ...updates, updatedAt: new Date().toISOString() }
                : note
            ),
          }
        : folder
    );
    saveFolders(updatedFolders);
  };

  const deleteNote = (folderId: string, noteId: string) => {
    const updatedFolders = folders.map((folder) =>
      folder.id === folderId
        ? {
            ...folder,
            notes: (folder.notes || []).filter((note) => note.id !== noteId),
          }
        : folder
    );
    saveFolders(updatedFolders);
  };

  const addSyllabusObjective = (
    folderId: string,
    objectiveId: string,
    objectiveText?: string,
    unitTitle?: string,
    topicTitle?: string
  ) => {
    // Check if objective already exists in this folder
    const folder = folders.find((f) => f.id === folderId);
    if (
      folder?.items?.syllabusObjectives?.some(
        (obj) => obj.objectiveId === objectiveId
      )
    ) {
      return null; // Already exists, don't add duplicate
    }

    // Resolve missing metadata so cards never show "Unknown"
    const resolved =
      !objectiveText ||
      !unitTitle ||
      !topicTitle ||
      unitTitle === "Unknown Unit" ||
      topicTitle === "Unknown Topic"
        ? resolveObjectiveMeta(objectiveId)
        : { objectiveText, unitTitle, topicTitle };

    const newObjectiveLink: SyllabusObjectiveLink = {
      id: crypto.randomUUID(),
      objectiveId,
      objectiveText: resolved.objectiveText,
      unitTitle: resolved.unitTitle,
      topicTitle: resolved.topicTitle,
      addedAt: new Date().toISOString(),
    };

    const updatedFolders = folders.map((folder) =>
      folder.id === folderId
        ? {
            ...folder,
            items: {
              ...folder.items,
              syllabusObjectives: [
                ...(folder.items.syllabusObjectives || []),
                newObjectiveLink,
              ],
            },
          }
        : folder
    );
    saveFolders(updatedFolders);
    return newObjectiveLink;
  };

  const removeSyllabusObjective = (folderId: string, objectiveId: string) => {
    const updatedFolders = folders.map((folder) =>
      folder.id === folderId
        ? {
            ...folder,
            items: {
              ...folder.items,
              syllabusObjectives: (
                folder.items.syllabusObjectives || []
              ).filter((obj) => obj.objectiveId !== objectiveId),
            },
          }
        : folder
    );
    saveFolders(updatedFolders);
  };

  // Enhanced move function with better error handling
  const moveSyllabusObjective = (
    fromFolderId: string,
    toFolderId: string,
    objectiveId: string
  ) => {
    if (fromFolderId === toFolderId) return false;

    // Check if target folder exists
    const targetFolder = folders.find((f) => f.id === toFolderId);
    if (!targetFolder) return false;

    // Check if objective already exists in target folder
    if (
      targetFolder.items?.syllabusObjectives?.some(
        (obj) => obj.objectiveId === objectiveId
      )
    ) {
      return false; // Already exists, don't create duplicate
    }

    let objectiveToMove: SyllabusObjectiveLink | null = null;

    // Remove from source folder
    const afterRemoval = folders.map((folder) => {
      if (folder.id === fromFolderId) {
        const remain = (folder.items.syllabusObjectives || []).filter((obj) => {
          if (!objectiveToMove && obj.objectiveId === objectiveId) {
            objectiveToMove = obj;
            return false;
          }
          return true;
        });
        return {
          ...folder,
          items: { ...folder.items, syllabusObjectives: remain },
        };
      }
      return folder;
    });

    // If not found in source, try to resolve from syllabus data
    if (!objectiveToMove) {
      const meta = resolveObjectiveMeta(objectiveId);
      objectiveToMove = {
        id: crypto.randomUUID(),
        objectiveId,
        objectiveText: meta.objectiveText,
        unitTitle: meta.unitTitle,
        topicTitle: meta.topicTitle,
        addedAt: new Date().toISOString(),
      };
    }

    // Add to target folder
    const updated = afterRemoval.map((folder) => {
      if (folder.id === toFolderId) {
        return {
          ...folder,
          items: {
            ...folder.items,
            syllabusObjectives: [
              ...(folder.items.syllabusObjectives || []),
              objectiveToMove as SyllabusObjectiveLink,
            ],
          },
        };
      }
      return folder;
    });

    saveFolders(updated);
    return true;
  };

  // Add calculation functions
  const addCalculationToFolder = (
    folderId: string,
    calculation: DashboardCalculation
  ) => {
    const updatedFolders = folders.map((folder) =>
      folder.id === folderId
        ? {
            ...folder,
            items: {
              ...folder.items,
              calculations: [...(folder.items.calculations || []), calculation],
            },
          }
        : folder
    );
    saveFolders(updatedFolders);
  };

  const deleteCalculationFromFolder = (
    folderId: string,
    calculationId: string
  ) => {
    const updatedFolders = folders.map((folder) =>
      folder.id === folderId
        ? {
            ...folder,
            items: {
              ...folder.items,
              calculations: (folder.items.calculations || []).filter(
                (calc) => calc.id !== calculationId
              ),
            },
          }
        : folder
    );
    saveFolders(updatedFolders);
  };

  const moveCalculationToFolder = (
    fromFolderId: string,
    toFolderId: string,
    calculationId: string
  ) => {
    if (fromFolderId === toFolderId) return false;

    let calculationToMove: DashboardCalculation | null = null;

    // Remove from source folder
    const afterRemoval = folders.map((folder) => {
      if (folder.id === fromFolderId) {
        const remain = (folder.items.calculations || []).filter((calc) => {
          if (!calculationToMove && calc.id === calculationId) {
            calculationToMove = calc;
            return false;
          }
          return true;
        });
        return { ...folder, items: { ...folder.items, calculations: remain } };
      }
      return folder;
    });

    if (!calculationToMove) return false;

    // Add to target folder
    const updated = afterRemoval.map((folder) => {
      if (folder.id === toFolderId) {
        return {
          ...folder,
          items: {
            ...folder.items,
            calculations: [
              ...(folder.items.calculations || []),
              calculationToMove as DashboardCalculation,
            ],
          },
        };
      }
      return folder;
    });

    saveFolders(updated);
    return true;
  };

  // Helper to check if a folder can accept drops
  const canAcceptDrop = (folderId: string, objectiveId: string) => {
    const folder = folders.find((f) => f.id === folderId);
    return (
      folder &&
      !folder.items?.syllabusObjectives?.some(
        (obj) => obj.objectiveId === objectiveId
      )
    );
  };

  const getRootFolders = () =>
    folders
      .filter((f) => f.parentId === null)
      .sort((a, b) => a.order - b.order);

  const getChildFolders = (parentId: string) =>
    folders
      .filter((f) => f.parentId === parentId)
      .sort((a, b) => a.order - b.order);

  const getAllFolders = () => folders;

  return {
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
    canAcceptDrop,
    getRootFolders,
    getChildFolders,
    getAllFolders,
  };
};
