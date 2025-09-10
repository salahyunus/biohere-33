export interface DashboardCalculation {
  id: string;
  year: string;
  session: string;
  rawMark: number;
  grade: string;
  ums: number;
  timestamp: number;
}

export interface DashboardPaper {
  id: string;
  paperId: string;
  title: string;
  year: number;
  session: string;
  questionPdfUrl: string;
  markSchemePdfUrl: string;
  examinerReportUrl?: string;
  addedAt: string;
}

export interface DashboardBookmark {
  id: string;
  paperId: string;
  paperTitle: string;
  questionNumbers: string[];
  bookmarkedAt: string;
  questionPdfUrl: string;
  markSchemePdfUrl: string;
}

export interface DashboardFolder {
  id: string;
  name: string;
  icon: string;
  color: string;
  parentId: string | null;
  order: number;
  notes: any[];
  items: {
    bookmarkedLessons: string[];
    questions: string[];
    quizzes: string[];
    pastPapers: string[];
    syllabusObjectives: any[];
    calculations?: DashboardCalculation[];
    papers?: DashboardPaper[];
    bookmarks?: DashboardBookmark[];
  };
}

const FOLDERS_STORAGE_KEY = "biology-app-folders";
const FOLDERS_UPDATED_EVENT = "biology-app-folders-updated";

export const saveToDashboard = (
  calculation: Omit<DashboardCalculation, "id" | "timestamp">
) => {
  try {
    // Get existing folders
    const existingFolders: DashboardFolder[] = JSON.parse(
      localStorage.getItem(FOLDERS_STORAGE_KEY) || "[]"
    );

    // Find or create "Saved Results" folder
    let savedResultsFolder = existingFolders.find(
      (folder) => folder.name === "Saved Results"
    );

    if (!savedResultsFolder) {
      // Create new folder
      const maxOrder = existingFolders.filter(
        (f) => f.parentId === null
      ).length;
      savedResultsFolder = {
        id: `folder-saved-results-${Date.now()}`,
        name: "Saved Results",
        icon: "calculator",
        color: "blue",
        parentId: null,
        order: maxOrder,
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
      existingFolders.push(savedResultsFolder);
    }

    // Ensure calculations array exists
    if (!savedResultsFolder.items.calculations) {
      savedResultsFolder.items.calculations = [];
    }

    // Create new calculation
    const newCalculation: DashboardCalculation = {
      ...calculation,
      id: `calc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    // Add calculation to folder
    savedResultsFolder.items.calculations.push(newCalculation);

    // Update the folder in the array
    const updatedFolders = existingFolders.map((folder) =>
      folder.id === savedResultsFolder!.id ? savedResultsFolder! : folder
    );

    // Save to localStorage
    localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(updatedFolders));

    // Broadcast update
    window.dispatchEvent(new Event(FOLDERS_UPDATED_EVENT));

    return true;
  } catch (error) {
    console.error("Error saving to dashboard:", error);
    return false;
  }
};

export const savePaperToDashboard = (paper: any) => {
  try {
    const existingFolders: DashboardFolder[] = JSON.parse(
      localStorage.getItem(FOLDERS_STORAGE_KEY) || "[]"
    );

    let papersFolder = existingFolders.find(
      (folder) => folder.name === "Papers"
    );

    if (!papersFolder) {
      const maxOrder = existingFolders.filter(
        (f) => f.parentId === null
      ).length;
      papersFolder = {
        id: `folder-papers-${Date.now()}`,
        name: "Papers",
        icon: "fileText",
        color: "blue",
        parentId: null,
        order: maxOrder,
        notes: [],
        items: {
          bookmarkedLessons: [],
          questions: [],
          quizzes: [],
          pastPapers: [],
          syllabusObjectives: [],
          calculations: [],
          papers: [],
        },
      };
      existingFolders.push(papersFolder);
    }

    if (!papersFolder.items.papers) {
      papersFolder.items.papers = [];
    }

    // Check if paper already exists
    const existingPaper = papersFolder.items.papers.find(
      (p) => p.paperId === paper.id
    );
    if (existingPaper) {
      return true; // Already exists
    }

    const newPaper: DashboardPaper = {
      id: `paper-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      paperId: paper.id,
      title: `${paper.year} ${paper.session}`,
      year: paper.year,
      session: paper.session,
      questionPdfUrl: paper.questionPdfUrl,
      markSchemePdfUrl: paper.markSchemePdfUrl,
      examinerReportUrl: paper.examinerReportUrl,
      addedAt: new Date().toISOString(),
    };

    papersFolder.items.papers.push(newPaper);

    const updatedFolders = existingFolders.map((folder) =>
      folder.id === papersFolder!.id ? papersFolder! : folder
    );

    localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(updatedFolders));
    window.dispatchEvent(new Event(FOLDERS_UPDATED_EVENT));

    return true;
  } catch (error) {
    console.error("Error saving paper to dashboard:", error);
    return false;
  }
};

export const saveBookmarkToDashboard = (
  paper: any,
  questionNumbers?: string[]
) => {
  try {
    const existingFolders: DashboardFolder[] = JSON.parse(
      localStorage.getItem(FOLDERS_STORAGE_KEY) || "[]"
    );

    let bookmarksFolder = existingFolders.find(
      (folder) => folder.name === "Bookmarks"
    );

    if (!bookmarksFolder) {
      const maxOrder = existingFolders.filter(
        (f) => f.parentId === null
      ).length;
      bookmarksFolder = {
        id: `folder-bookmarks-${Date.now()}`,
        name: "Bookmarks",
        icon: "bookmark",
        color: "yellow",
        parentId: null,
        order: maxOrder,
        notes: [],
        items: {
          bookmarkedLessons: [],
          questions: [],
          quizzes: [],
          pastPapers: [],
          syllabusObjectives: [],
          calculations: [],
          bookmarks: [],
        },
      };
      existingFolders.push(bookmarksFolder);
    }

    if (!bookmarksFolder.items.bookmarks) {
      bookmarksFolder.items.bookmarks = [];
    }

    // Remove existing bookmark for this paper if any
    bookmarksFolder.items.bookmarks = bookmarksFolder.items.bookmarks.filter(
      (bookmark: DashboardBookmark) => bookmark.paperId !== paper.id
    );

    const newBookmark: DashboardBookmark = {
      id: `bookmark-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      paperId: paper.id,
      paperTitle: `${paper.year} ${paper.session}`,
      questionNumbers: questionNumbers || [],
      bookmarkedAt: new Date().toISOString(),
      questionPdfUrl: paper.questionPdfUrl,
      markSchemePdfUrl: paper.markSchemePdfUrl,
    };

    bookmarksFolder.items.bookmarks.push(newBookmark);

    const updatedFolders = existingFolders.map((folder) =>
      folder.id === bookmarksFolder!.id ? bookmarksFolder! : folder
    );

    localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(updatedFolders));
    window.dispatchEvent(new Event(FOLDERS_UPDATED_EVENT));

    return true;
  } catch (error) {
    console.error("Error saving bookmark to dashboard:", error);
    return false;
  }
};

export const getDashboardCalculations = (): DashboardCalculation[] => {
  try {
    const folders: DashboardFolder[] = JSON.parse(
      localStorage.getItem(FOLDERS_STORAGE_KEY) || "[]"
    );
    const savedResultsFolder = folders.find(
      (folder) => folder.name === "Saved Results"
    );
    return savedResultsFolder?.items?.calculations || [];
  } catch (error) {
    console.error("Error getting dashboard calculations:", error);
    return [];
  }
};
