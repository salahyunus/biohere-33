// MCQ Answer keys for past papers
// Format: Year -> Session -> Answer string (e.g., "ABCDABCD...")

export interface MCQAnswerData {
  [year: number]: {
    [session: string]: string;
  };
}

export const mcqAnswers: MCQAnswerData = {
  2025: {
    jan: "ABCDABCDABCDABCDABCDABCDABCDABCDABCDABCD", // 40 questions
    june: "BCADACBDACBDACBDACBDACBDACBDACBDACBDACBD", // 40 questions
  },
  2024: {
    jan: "CADACBDACBDACBDACBDACBDACBDACBDACBDACBDA", // 40 questions
    june: "DABCDABCDABCDABCDABCDABCDABCDABCDABCDABC", // 40 questions
    oct: "ABCDABCDABCDABCDABCDABCDABCDABCDABCDABCD", // 40 questions
  },
  2023: {
    jan: "BCADBCADBCADBCADBCADBCADBCADBCADBCADBCAD", // 40 questions
    june: "CADBCADBCADBCADBCADBCADBCADBCADBCADBCADB", // 40 questions
    oct: "DABCDABCDABCDABCDABCDABCDABCDABCDABCDABC", // 40 questions
  },
  2022: {
    jan: "ACBDACBDACBDACBDACBDACBDACBDACBDACBDACBD", // 40 questions
    june: "BDACBDACBDACBDACBDACBDACBDACBDACBDACBDAC", // 40 questions
    oct: "CADACBDACBDACBDACBDACBDACBDACBDACBDACBDA", // 40 questions
  },
  2021: {
    jan: "DABCDABCDABCDABCDABCDABCDABCDABCDABCDABC", // 40 questions
    june: "ABCDABCDABCDABCDABCDABCDABCDABCDABCDABCD", // 40 questions
    oct: "BCADBCADBCADBCADBCADBCADBCADBCADBCADBCAD", // 40 questions
  },
};

export const getAnswerKey = (year: number, session: string): string => {
  return mcqAnswers[year]?.[session] || "";
};

export const getAvailableYears = (): number[] => {
  return Object.keys(mcqAnswers)
    .map(Number)
    .sort((a, b) => b - a);
};

export const getAvailableSessions = (year: number): string[] => {
  return Object.keys(mcqAnswers[year] || {});
};

export const getTotalQuestions = (year: number, session: string): number => {
  const answerKey = getAnswerKey(year, session);
  return answerKey.length;
};
