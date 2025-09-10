import { useState, useEffect } from "react";
import {
  WrittenPaper,
  WrittenQuestion,
  MarkPoint,
  UserAnswer,
  WrittenProgress,
} from "@/data/writtenPapers";

const STORAGE_KEY = "written-solver-progress";

export const useWrittenSolver = () => {
  const [progressData, setProgressData] = useState<WrittenProgress[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setProgressData(JSON.parse(saved));
    }
  }, []);

  const saveProgress = (progress: WrittenProgress) => {
    const updated = progressData.filter((p) => p.paperId !== progress.paperId);
    updated.push(progress);
    setProgressData(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const getProgress = (paperId: string): WrittenProgress | undefined => {
    return progressData.find((p) => p.paperId === paperId);
  };

  const createNewProgress = (
    paper: WrittenPaper,
    submissionMode:
      | "question-by-question"
      | "submit-at-end" = "question-by-question",
    viewMode: "play-mode" | "exam-view" = "play-mode"
  ): WrittenProgress => {
    const answers: Record<string, UserAnswer> = {};

    paper.questions.forEach((q) => {
      answers[q.id] = {
        questionId: q.id,
        answer: "",
        maxMarks: q.totalMarks,
        isSubmitted: false,
      };
    });

    return {
      paperId: paper.id,
      year: paper.year,
      session: paper.session,
      answers,
      currentQuestionIndex: 0,
      timeSpent: 0,
      startedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      isCompleted: false,
      submissionMode,
      viewMode,
    };
  };

  const checkAnswer = (answer: string, markScheme: MarkPoint[]): number => {
    let totalMarks = 0;
    const normalizedAnswer = answer.toLowerCase().trim();

    markScheme.forEach((point) => {
      const allKeywords = [...point.keywords, ...(point.synonyms || [])];
      const hasKeyword = allKeywords.some((keyword) =>
        normalizedAnswer.includes(keyword.toLowerCase())
      );

      if (hasKeyword) {
        totalMarks += point.marks;
      }
    });

    return Math.min(
      totalMarks,
      markScheme.reduce((sum, point) => sum + point.marks, 0)
    );
  };

  const submitAnswer = (
    progress: WrittenProgress,
    questionId: string,
    answer: string,
    question: WrittenQuestion
  ): WrittenProgress => {
    const marksAwarded = checkAnswer(answer, question.markScheme);

    const updatedAnswers = {
      ...progress.answers,
      [questionId]: {
        ...progress.answers[questionId],
        answer,
        marksAwarded,
        submittedAt: new Date().toISOString(),
        isSubmitted: true,
      },
    };

    const updatedProgress = {
      ...progress,
      answers: updatedAnswers,
      lastUpdated: new Date().toISOString(),
    };

    saveProgress(updatedProgress);
    return updatedProgress;
  };

  const submitAllAnswers = (
    progress: WrittenProgress,
    paper: WrittenPaper
  ): WrittenProgress => {
    const updatedAnswers = { ...progress.answers };
    let totalMarks = 0;

    paper.questions.forEach((question) => {
      const userAnswer = updatedAnswers[question.id];
      if (userAnswer && !userAnswer.isSubmitted) {
        const marksAwarded = checkAnswer(
          userAnswer.answer,
          question.markScheme
        );
        updatedAnswers[question.id] = {
          ...userAnswer,
          marksAwarded,
          submittedAt: new Date().toISOString(),
          isSubmitted: true,
        };
      }
      totalMarks += updatedAnswers[question.id].marksAwarded || 0;
    });

    const updatedProgress = {
      ...progress,
      answers: updatedAnswers,
      totalMarksAwarded: totalMarks,
      isCompleted: true,
      lastUpdated: new Date().toISOString(),
    };

    saveProgress(updatedProgress);
    return updatedProgress;
  };

  const resetAnswer = (
    progress: WrittenProgress,
    questionId: string
  ): WrittenProgress => {
    const updatedAnswers = {
      ...progress.answers,
      [questionId]: {
        ...progress.answers[questionId],
        answer: "",
        marksAwarded: undefined,
        submittedAt: undefined,
        isSubmitted: false,
      },
    };

    const updatedProgress = {
      ...progress,
      answers: updatedAnswers,
      lastUpdated: new Date().toISOString(),
    };

    saveProgress(updatedProgress);
    return updatedProgress;
  };

  return {
    progressData,
    getProgress,
    createNewProgress,
    saveProgress,
    checkAnswer,
    submitAnswer,
    submitAllAnswers,
    resetAnswer,
  };
};
