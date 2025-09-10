export interface QuizQuestion {
  id: string;
  year: number;
  session: string;
  paperId: string;
  questionNumber: string;
  question: string;
  answer: string;
  marks: number;
  topic: string;
  subtopic?: string;
  difficulty: "easy" | "medium" | "hard";
  questionType:
    | "mcq"
    | "6-marker"
    | "labelling"
    | "calculation"
    | "definition"
    | "explanation"
    | "diagram";
  hasImages: boolean;
  imageUrl?: string;
  answerImageUrl?: string;
  mcqOptions?: {
    A: string;
    B: string;
    C: string;
    D: string;
    correctAnswer: "A" | "B" | "C" | "D";
  };
  parts?: {
    partId: string;
    partLabel: string;
    question: string;
    answer: string;
    marks: number;
  }[];
}

export interface QuizTopic {
  id: string;
  name: string;
  subtopics: {
    id: string;
    name: string;
    questionCount: number;
  }[];
}

export interface QuizFilters {
  yearRange: { start: number; end: number };
  sessions: string[];
  difficulties: ("easy" | "medium" | "hard")[];
  topics: string[];
  subtopics: string[];
  questionTypes: string[];
  includeImages: boolean;
  totalMarks: number;
}

export interface GeneratedQuiz {
  id: string;
  name: string;
  questions: QuizQuestion[];
  totalMarks: number;
  estimatedTime: number;
  createdAt: string;
  filters: QuizFilters;
}

export interface SavedQuestion extends QuizQuestion {
  savedAt: string;
  tags: string[];
  comment?: string;
  isImportant: boolean;
}

// Sample topics with subtopics
export const quizTopics: QuizTopic[] = [
  {
    id: "cell-biology",
    name: "Cell Biology",
    subtopics: [
      { id: "cell-structure", name: "Cell Structure", questionCount: 45 },
      { id: "organelles", name: "Organelles", questionCount: 32 },
      { id: "cell-membrane", name: "Cell Membrane", questionCount: 28 },
      { id: "transport", name: "Transport", questionCount: 38 },
    ],
  },
  {
    id: "photosynthesis",
    name: "Photosynthesis",
    subtopics: [
      { id: "light-reactions", name: "Light Reactions", questionCount: 35 },
      { id: "calvin-cycle", name: "Calvin Cycle", questionCount: 25 },
      {
        id: "factors-affecting",
        name: "Factors Affecting Photosynthesis",
        questionCount: 30,
      },
    ],
  },
  {
    id: "respiration",
    name: "Respiration",
    subtopics: [
      { id: "aerobic", name: "Aerobic Respiration", questionCount: 40 },
      { id: "anaerobic", name: "Anaerobic Respiration", questionCount: 22 },
      { id: "energy-transfer", name: "Energy Transfer", questionCount: 18 },
    ],
  },
  {
    id: "genetics",
    name: "Genetics",
    subtopics: [
      { id: "inheritance", name: "Inheritance", questionCount: 50 },
      { id: "gene-expression", name: "Gene Expression", questionCount: 33 },
      { id: "mutations", name: "Mutations", questionCount: 27 },
    ],
  },
  {
    id: "ecology",
    name: "Ecology",
    subtopics: [
      { id: "ecosystems", name: "Ecosystems", questionCount: 42 },
      {
        id: "population-dynamics",
        name: "Population Dynamics",
        questionCount: 29,
      },
      { id: "conservation", name: "Conservation", questionCount: 24 },
    ],
  },
];

// Sample quiz questions
export const sampleQuizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    year: 2024,
    session: "june",
    paperId: "2024-june-p1",
    questionNumber: "1(a)",
    question: "Define photosynthesis and explain its importance in ecosystems.",
    answer:
      "Photosynthesis is the process by which plants convert light energy into chemical energy (glucose) using carbon dioxide and water. It is crucial for ecosystems as it provides the primary source of energy for most food chains, produces oxygen for respiration, and removes carbon dioxide from the atmosphere.",
    marks: 6,
    topic: "Photosynthesis",
    subtopic: "Light Reactions",
    difficulty: "medium",
    questionType: "6-marker",
    hasImages: false,
  },
  {
    id: "q2",
    year: 2024,
    session: "oct",
    paperId: "2024-oct-p1",
    questionNumber: "2",
    question:
      "Which of the following best describes the function of mitochondria?",
    answer: "C - Site of aerobic respiration and ATP production",
    marks: 1,
    topic: "Cell Biology",
    subtopic: "Organelles",
    difficulty: "easy",
    questionType: "mcq",
    hasImages: false,
    mcqOptions: {
      A: "Site of protein synthesis",
      B: "Controls entry and exit of substances",
      C: "Site of aerobic respiration and ATP production",
      D: "Contains genetic material",
      correctAnswer: "C",
    },
  },
  {
    id: "q3",
    year: 2023,
    session: "june",
    paperId: "2023-june-p2",
    questionNumber: "3(b)",
    question:
      "Describe the structure of a chloroplast and explain how it is adapted for photosynthesis.",
    answer:
      "Chloroplasts have a double membrane (envelope) that controls entry of substances. Inside are thylakoids arranged in stacks called grana, surrounded by the stroma. Thylakoids contain chlorophyll which captures light energy. The grana provide a large surface area for light absorption.",
    marks: 8,
    topic: "Photosynthesis",
    subtopic: "Light Reactions",
    difficulty: "hard",
    questionType: "6-marker",
    hasImages: true,
    imageUrl:
      "https://dummyimage.com/400x300/4CAF50/ffffff&text=Chloroplast+Diagram",
  },
];

export const getQuestionsByFilters = (filters: QuizFilters): QuizQuestion[] => {
  let filtered = sampleQuizQuestions.filter((q) => {
    // Year range filter
    if (q.year < filters.yearRange.start || q.year > filters.yearRange.end)
      return false;

    // Session filter
    if (filters.sessions.length > 0 && !filters.sessions.includes(q.session))
      return false;

    // Difficulty filter
    if (
      filters.difficulties.length > 0 &&
      !filters.difficulties.includes(q.difficulty)
    )
      return false;

    // Topic filter
    if (filters.topics.length > 0 && !filters.topics.includes(q.topic))
      return false;

    // Subtopic filter
    if (
      filters.subtopics.length > 0 &&
      q.subtopic &&
      !filters.subtopics.includes(q.subtopic)
    )
      return false;

    // Question type filter
    if (
      filters.questionTypes.length > 0 &&
      !filters.questionTypes.includes(q.questionType)
    )
      return false;

    // Images filter
    if (!filters.includeImages && q.hasImages) return false;

    return true;
  });

  // Generate more questions to reach target marks (mock data)
  const additionalQuestions = [...filtered];
  let currentMarks = filtered.reduce((sum, q) => sum + q.marks, 0);

  while (currentMarks < filters.totalMarks && additionalQuestions.length < 50) {
    const randomQuestion = {
      ...filtered[Math.floor(Math.random() * filtered.length)],
      id: `generated-${Date.now()}-${Math.random()}`,
      questionNumber: `${additionalQuestions.length + 1}`,
    };
    additionalQuestions.push(randomQuestion);
    currentMarks += randomQuestion.marks;
  }

  return additionalQuestions.slice(0, Math.ceil(filters.totalMarks / 6)); // Approximate question count
};

export const generateQuiz = (
  filters: QuizFilters,
  name: string
): GeneratedQuiz => {
  const questions = getQuestionsByFilters(filters);
  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
  const estimatedTime = Math.ceil(totalMarks * 1.5); // 1.5 minutes per mark

  return {
    id: `quiz-${Date.now()}`,
    name,
    questions,
    totalMarks,
    estimatedTime,
    createdAt: new Date().toISOString(),
    filters,
  };
};
