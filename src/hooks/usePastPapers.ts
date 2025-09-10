import { useState, useEffect, useCallback } from "react";
import {
  savePaperToDashboard as savePaperToDashboardHelper,
  saveBookmarkToDashboard,
} from "@/utils/dashboardHelpers";
import {
  pastPapersData,
  getPastPaperById,
  type PastPaperData,
  type PaperQuestionData,
} from "@/data/pastPapersData";

export interface PastPaper {
  id: string;
  year: number;
  session: string;
  subject: string;
  paperNumber: number;
  questionPdfUrl: string;
  markSchemePdfUrl: string;
  examinerReportUrl?: string;
  questions: PaperQuestion[];
  isBookmarked: boolean;
  bookmarkedQuestions: string[];
  comments: Record<string, string>;
  tags: Record<string, string[]>;
  solvedInfo?: {
    completed: boolean;
    difficulty: "easy" | "medium" | "hard";
    score?: number;
    totalMarks?: number;
    timeTaken?: number; // in minutes
    completedAt: string;
    grade?: string;
    ums?: number;
  };
}

export interface PaperQuestion {
  id: string;
  number: string;
  question: string;
  answer: string;
  marks: number;
  topic?: string;
}

export interface BookmarkedPaper {
  paperId: string;
  bookmarkedAt: string;
  bookmarkedQuestions?: string[];
}

export interface SearchResult {
  paperId: string;
  year: number;
  session: string;
  questionNumber: string;
  question: string;
  answer: string;
  marks: number;
  matchType: "question" | "answer" | "both";
}

const PAST_PAPERS_STORAGE_KEY = "biology-app-past-papers";
const BOOKMARKS_STORAGE_KEY = "biology-app-paper-bookmarks";
const COMMENTS_STORAGE_KEY = "biology-app-paper-comments";
const TAGS_STORAGE_KEY = "biology-app-paper-tags";
const SOLVED_PAPERS_STORAGE_KEY = "biology-app-solved-papers";

// Convert data structure to PastPaper format
const convertToPastPaper = (paperData: PastPaperData): PastPaper => {
  const savedComments = JSON.parse(
    localStorage.getItem(COMMENTS_STORAGE_KEY) || "{}"
  );
  const savedTags = JSON.parse(localStorage.getItem(TAGS_STORAGE_KEY) || "{}");
  const savedBookmarks = JSON.parse(
    localStorage.getItem(BOOKMARKS_STORAGE_KEY) || "[]"
  );
  const savedSolved = JSON.parse(
    localStorage.getItem(SOLVED_PAPERS_STORAGE_KEY) || "{}"
  );

  const bookmark = savedBookmarks.find(
    (b: BookmarkedPaper) => b.paperId === paperData.id
  );

  return {
    ...paperData,
    isBookmarked: !!bookmark,
    bookmarkedQuestions: bookmark?.bookmarkedQuestions || [],
    comments: savedComments[paperData.id] || {},
    tags: savedTags[paperData.id] || {},
    solvedInfo: savedSolved[paperData.id],
  };
};

export const usePastPapers = () => {
  const [pastPapers, setPastPapers] = useState<PastPaper[]>([]);
  const [bookmarkedPapers, setBookmarkedPapers] = useState<BookmarkedPaper[]>(
    []
  );
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // Force re-render to show changes immediately
  const forceUpdate = () => setUpdateTrigger((prev) => prev + 1);

  useEffect(() => {
    // Convert static data to PastPaper format with user data
    const convertedPapers = pastPapersData.map(convertToPastPaper);
    setPastPapers(convertedPapers);

    // Load bookmarks
    const savedBookmarks = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    if (savedBookmarks) {
      setBookmarkedPapers(JSON.parse(savedBookmarks));
    }
  }, [updateTrigger]);

  const saveBookmarks = (bookmarks: BookmarkedPaper[]) => {
    setBookmarkedPapers(bookmarks);
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
    forceUpdate();
  };

  const saveComments = (paperId: string, comments: Record<string, string>) => {
    const allComments = JSON.parse(
      localStorage.getItem(COMMENTS_STORAGE_KEY) || "{}"
    );
    allComments[paperId] = comments;
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(allComments));
    forceUpdate();
  };

  const saveTags = (paperId: string, tags: Record<string, string[]>) => {
    const allTags = JSON.parse(localStorage.getItem(TAGS_STORAGE_KEY) || "{}");
    allTags[paperId] = tags;
    localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(allTags));
    forceUpdate();
  };

  const saveSolvedInfo = (
    paperId: string,
    solvedInfo: PastPaper["solvedInfo"]
  ) => {
    const allSolved = JSON.parse(
      localStorage.getItem(SOLVED_PAPERS_STORAGE_KEY) || "{}"
    );
    if (solvedInfo) {
      allSolved[paperId] = solvedInfo;
    } else {
      delete allSolved[paperId];
    }
    localStorage.setItem(SOLVED_PAPERS_STORAGE_KEY, JSON.stringify(allSolved));
    forceUpdate();
  };

  const getFilteredPapers = (searchTerm: string) => {
    if (!searchTerm.trim()) return pastPapers;

    const term = searchTerm.toLowerCase();
    return pastPapers.filter(
      (paper) =>
        paper.year.toString().includes(term) ||
        paper.session.toLowerCase().includes(term) ||
        paper.questions.some(
          (q) =>
            q.question.toLowerCase().includes(term) ||
            q.answer.toLowerCase().includes(term)
        )
    );
  };

  const searchInContent = useCallback(
    (searchTerm: string): SearchResult[] => {
      if (!searchTerm.trim() || searchTerm.length < 3) return [];

      const results: SearchResult[] = [];
      const term = searchTerm.toLowerCase();

      pastPapers.forEach((paper) => {
        paper.questions.forEach((question) => {
          const questionMatch = question.question.toLowerCase().includes(term);
          const answerMatch = question.answer.toLowerCase().includes(term);

          if (questionMatch || answerMatch) {
            results.push({
              paperId: paper.id,
              year: paper.year,
              session: paper.session,
              questionNumber: question.number,
              question: question.question,
              answer: question.answer,
              marks: question.marks,
              matchType:
                questionMatch && answerMatch
                  ? "both"
                  : questionMatch
                  ? "question"
                  : "answer",
            });
          }
        });
      });

      return results;
    },
    [pastPapers]
  );

  const savePaperToDashboard = (paper: PastPaper) => {
    return savePaperToDashboardHelper(paper);
  };

  const saveBookmarksToDashboard = (
    paper: PastPaper,
    questionNumbers?: string[]
  ) => {
    return saveBookmarkToDashboard(paper, questionNumbers);
  };

  const bookmarkPaper = (paperId: string, questionNumbers?: string[]) => {
    const paper = pastPapers.find((p) => p.id === paperId);
    if (!paper) return;

    const existingBookmark = bookmarkedPapers.find(
      (b) => b.paperId === paperId
    );

    if (existingBookmark) {
      // Update existing bookmark
      const updatedBookmarks = bookmarkedPapers.map((b) =>
        b.paperId === paperId
          ? { ...b, bookmarkedQuestions: questionNumbers || [] }
          : b
      );
      saveBookmarks(updatedBookmarks);
    } else {
      // Add new bookmark
      const newBookmark: BookmarkedPaper = {
        paperId,
        bookmarkedAt: new Date().toISOString(),
        bookmarkedQuestions: questionNumbers || [],
      };
      saveBookmarks([...bookmarkedPapers, newBookmark]);
    }

    // Save to dashboard
    saveBookmarksToDashboard(paper, questionNumbers);
  };

  const removeBookmark = (paperId: string) => {
    const updatedBookmarks = bookmarkedPapers.filter(
      (b) => b.paperId !== paperId
    );
    saveBookmarks(updatedBookmarks);
  };

  const addComment = (
    paperId: string,
    questionNumber: string,
    comment: string
  ) => {
    const paper = pastPapers.find((p) => p.id === paperId);
    if (!paper) return;

    const updatedComments = { ...paper.comments, [questionNumber]: comment };
    saveComments(paperId, updatedComments);
  };

  const removeComment = (paperId: string, questionNumber: string) => {
    const paper = pastPapers.find((p) => p.id === paperId);
    if (!paper) return;

    const updatedComments = { ...paper.comments };
    delete updatedComments[questionNumber];
    saveComments(paperId, updatedComments);
  };

  const addTag = (paperId: string, questionNumber: string, tag: string) => {
    const paper = pastPapers.find((p) => p.id === paperId);
    if (!paper) return;

    const currentTags = paper.tags[questionNumber] || [];
    const updatedTags = {
      ...paper.tags,
      [questionNumber]: [...currentTags, tag],
    };
    saveTags(paperId, updatedTags);
  };

  const removeTag = (paperId: string, questionNumber: string, tag: string) => {
    const paper = pastPapers.find((p) => p.id === paperId);
    if (!paper) return;

    const currentTags = paper.tags[questionNumber] || [];
    const updatedTags = {
      ...paper.tags,
      [questionNumber]: currentTags.filter((t) => t !== tag),
    };
    saveTags(paperId, updatedTags);
  };

  const logSolvedPaper = (
    paperId: string,
    solvedInfo: PastPaper["solvedInfo"]
  ) => {
    saveSolvedInfo(paperId, solvedInfo);
    return { paperId, solvedInfo };
  };

  const removeSolvedLog = (paperId: string) => {
    saveSolvedInfo(paperId, undefined);
  };

  const getBookmarkedPapers = (): PastPaper[] => {
    return pastPapers.filter((paper) => paper.isBookmarked);
  };

  const getSolvedPapers = (): PastPaper[] => {
    return pastPapers.filter((paper) => paper.solvedInfo?.completed);
  };

  return {
    pastPapers,
    bookmarkedPapers,
    getFilteredPapers,
    searchInContent,
    bookmarkPaper,
    removeBookmark,
    addComment,
    removeComment,
    addTag,
    removeTag,
    logSolvedPaper,
    removeSolvedLog,
    savePaperToDashboard,
    getBookmarkedPapers,
    getSolvedPapers,
    forceUpdate,
  };
};
