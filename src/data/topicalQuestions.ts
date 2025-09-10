export interface TopicalQuestion {
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
  syllabusObjective: string;
  difficulty: "easy" | "medium" | "hard";
  questionTypes: string[];
  hasImages: boolean;
  examinerTips?: string[];
  commonMisconceptions?: string[];
}

export const topicalQuestionsData: TopicalQuestion[] = [
  {
    id: "2025-jan-1a",
    year: 2025,
    session: "jan",
    paperId: "2025-jan-p1",
    questionNumber: "1a",
    question:
      "**Define** photosynthesis and explain its importance in ecosystems.",
    answer:
      "Photosynthesis is the process by which plants convert *light energy* into **chemical energy** (glucose) using carbon dioxide and water. It is crucial for ecosystems as it provides the primary source of energy for most food chains, produces oxygen for respiration, and removes carbon dioxide from the atmosphere.",
    marks: 4,
    topic: "Photosynthesis",
    subtopic: "Light reactions",
    syllabusObjective: "9.1.1",
    difficulty: "easy",
    questionTypes: ["definition", "explanation"],
    hasImages: false,
    examinerTips: [
      "Always include the word 'process' in definitions",
      "Mention both reactants and products",
    ],
    commonMisconceptions: [
      "Students often forget to mention that light energy is converted to chemical energy",
    ],
  },
  {
    id: "2025-jan-1b",
    year: 2025,
    session: "jan",
    paperId: "2025-jan-p1",
    questionNumber: "1b",
    question:
      "Describe the structure and function of **chloroplasts**. Include a labeled diagram.",
    answer:
      "Chloroplasts are double-membrane organelles containing thylakoids arranged in stacks called *grana*. They contain **chlorophyll** which captures light energy. The stroma contains enzymes for the Calvin cycle. Function includes light-dependent and light-independent reactions of photosynthesis.",
    marks: 6,
    topic: "Cell Biology",
    subtopic: "Organelles",
    syllabusObjective: "2.3.2",
    difficulty: "medium",
    questionTypes: ["6-marker", "diagram", "structure-function"],
    hasImages: true,
    examinerTips: [
      "Always label diagrams clearly",
      "Link structure to function",
    ],
    commonMisconceptions: [
      "Students confuse thylakoids with cristae from mitochondria",
    ],
  },
  {
    id: "2024-june-2a",
    year: 2024,
    session: "june",
    paperId: "2024-june-p1",
    questionNumber: "2a",
    question:
      "Explain the process of **mitosis** and its significance in multicellular organisms.",
    answer:
      "Mitosis is nuclear division producing two genetically identical diploid cells. Stages include *prophase*, *metaphase*, *anaphase*, and *telophase*. Significance includes growth, repair, asexual reproduction, and maintaining chromosome number.",
    marks: 8,
    topic: "Cell Division",
    subtopic: "Mitosis",
    syllabusObjective: "3.1.1",
    difficulty: "hard",
    questionTypes: ["repeated", "process", "significance"],
    hasImages: false,
    examinerTips: [
      "Describe each stage in sequence",
      "Always mention genetic identity of daughter cells",
    ],
    commonMisconceptions: [
      "Students often confuse mitosis with meiosis stages",
    ],
  },
  {
    id: "2024-oct-1a",
    year: 2024,
    session: "oct",
    paperId: "2024-oct-p1",
    questionNumber: "1a",
    question: "What is the function of **ATP** in cellular processes?",
    answer:
      "ATP (Adenosine Triphosphate) is the universal energy currency of cells. It provides energy for metabolic reactions, active transport, muscle contraction, and biosynthesis through hydrolysis of phosphate bonds.",
    marks: 3,
    topic: "Biochemistry",
    subtopic: "Energy transfer",
    syllabusObjective: "8.1.1",
    difficulty: "easy",
    questionTypes: ["definition", "function", "repeated"],
    hasImages: false,
    examinerTips: [
      "Mention it's the universal energy currency",
      "Give specific examples of uses",
    ],
    commonMisconceptions: ["Students think ATP stores energy long-term"],
  },
  {
    id: "2023-june-3b",
    year: 2023,
    session: "june",
    paperId: "2023-june-p1",
    questionNumber: "3b",
    question: "Compare and contrast **aerobic** and **anaerobic** respiration.",
    answer:
      "Both break down glucose to release energy. **Aerobic** respiration requires oxygen, produces 38 ATP, and forms CO₂ and water. **Anaerobic** respiration occurs without oxygen, produces 2 ATP, and forms lactate (animals) or ethanol (plants/yeast). Aerobic is more efficient.",
    marks: 6,
    topic: "Respiration",
    subtopic: "Types of respiration",
    syllabusObjective: "8.2.1",
    difficulty: "medium",
    questionTypes: ["6-marker", "comparison", "common"],
    hasImages: false,
    examinerTips: [
      "Use a table for comparisons",
      "Mention efficiency differences",
    ],
    commonMisconceptions: [
      "Students think anaerobic respiration doesn't produce ATP",
    ],
  },
];

export const getAvailableTopics = (): string[] => {
  const topics = [...new Set(topicalQuestionsData.map((q) => q.topic))];
  return topics.sort();
};

export const getAvailableSubtopics = (selectedTopics?: string[]): string[] => {
  let filteredQuestions = topicalQuestionsData;
  if (selectedTopics && selectedTopics.length > 0) {
    filteredQuestions = topicalQuestionsData.filter((q) =>
      selectedTopics.includes(q.topic)
    );
  }
  const subtopics = [
    ...new Set(filteredQuestions.map((q) => q.subtopic).filter(Boolean)),
  ];
  return subtopics.sort();
};

export const getAvailableSyllabusObjectives = (): string[] => {
  const objectives = [
    ...new Set(topicalQuestionsData.map((q) => q.syllabusObjective)),
  ];
  return objectives.sort();
};

export const getAvailableQuestionTypes = (): string[] => {
  const types = [
    ...new Set(topicalQuestionsData.flatMap((q) => q.questionTypes)),
  ];
  return types.sort();
};
