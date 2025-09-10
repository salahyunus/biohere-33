export interface MarkPoint {
  id: string;
  keywords: string[];
  synonyms?: string[];
  marks: number;
}

export interface WrittenQuestion {
  id: string;
  number: string;
  question: string;
  totalMarks: number;
  markScheme: MarkPoint[];
  modelAnswer: string;
  hasImages?: boolean;
}

export interface WrittenPaper {
  id: string;
  year: number;
  session: string;
  subject: string;
  paperNumber: number;
  duration: number; // in minutes
  totalMarks: number;
  questionPdfUrl: string;
  markSchemePdfUrl: string;
  examinerReportUrl?: string;
  questions: WrittenQuestion[];
}

export interface UserAnswer {
  questionId: string;
  answer: string;
  submittedAt?: string;
  marksAwarded?: number;
  maxMarks: number;
  isSubmitted: boolean;
}

export interface WrittenProgress {
  paperId: string;
  year: number;
  session: string;
  answers: Record<string, UserAnswer>;
  currentQuestionIndex: number;
  timeSpent: number;
  startedAt: string;
  lastUpdated: string;
  isCompleted: boolean;
  totalMarksAwarded?: number;
  submissionMode: "question-by-question" | "submit-at-end";
  viewMode: "play-mode" | "exam-view";
}

// Sample data with unique papers
const samplePapers: WrittenPaper[] = [
  {
    id: "2024-june-p2",
    year: 2024,
    session: "june",
    subject: "Biology",
    paperNumber: 2,
    duration: 105,
    totalMarks: 70,
    questionPdfUrl:
      "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf",
    markSchemePdfUrl:
      "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf",
    examinerReportUrl:
      "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf",
    questions: [
      {
        id: "1a",
        number: "1(a)",
        question:
          "Explain the process of photosynthesis and its importance in ecosystems.",
        totalMarks: 6,
        markScheme: [
          {
            id: "1a-1",
            keywords: ["light energy", "solar energy"],
            synonyms: ["sunlight", "light"],
            marks: 1,
          },
          {
            id: "1a-2",
            keywords: ["carbon dioxide", "CO2"],
            marks: 1,
          },
          {
            id: "1a-3",
            keywords: ["water", "H2O"],
            marks: 1,
          },
          {
            id: "1a-4",
            keywords: ["glucose", "sugar"],
            synonyms: ["carbohydrate"],
            marks: 1,
          },
          {
            id: "1a-5",
            keywords: ["oxygen", "O2"],
            marks: 1,
          },
          {
            id: "1a-6",
            keywords: ["primary producer", "food chain base"],
            synonyms: ["producer", "autotroph"],
            marks: 1,
          },
        ],
        modelAnswer:
          "Photosynthesis is the process by which plants convert light energy from the sun into chemical energy (glucose) using carbon dioxide from the atmosphere and water. This process produces oxygen as a byproduct. Photosynthesis is crucial for ecosystems as it forms the base of food chains, providing energy for all other organisms, produces oxygen for respiration, and removes carbon dioxide from the atmosphere.",
        hasImages: true,
      },
      {
        id: "1b",
        number: "1(b)",
        question:
          "Describe the structure of a chloroplast and explain how it is adapted for photosynthesis.",
        totalMarks: 8,
        markScheme: [
          {
            id: "1b-1",
            keywords: ["double membrane", "envelope"],
            marks: 1,
          },
          {
            id: "1b-2",
            keywords: ["thylakoids"],
            marks: 1,
          },
          {
            id: "1b-3",
            keywords: ["grana", "stacks"],
            marks: 1,
          },
          {
            id: "1b-4",
            keywords: ["stroma"],
            marks: 1,
          },
          {
            id: "1b-5",
            keywords: ["chlorophyll"],
            marks: 1,
          },
          {
            id: "1b-6",
            keywords: ["large surface area", "increased absorption"],
            synonyms: ["more light capture"],
            marks: 1,
          },
          {
            id: "1b-7",
            keywords: ["light reactions", "light-dependent"],
            marks: 1,
          },
          {
            id: "1b-8",
            keywords: ["Calvin cycle", "light-independent"],
            synonyms: ["dark reactions"],
            marks: 1,
          },
        ],
        modelAnswer:
          "Chloroplasts have a double membrane (envelope) that controls entry of substances. Inside are thylakoids arranged in stacks called grana, surrounded by the stroma. Thylakoids contain chlorophyll which captures light energy. The grana provide a large surface area for light absorption. Light reactions occur in the thylakoids, while the Calvin cycle (light-independent reactions) occurs in the stroma, containing enzymes for carbon fixation.",
        hasImages: true,
      },
    ],
  },
  {
    id: "2024-january-p2",
    year: 2024,
    session: "january",
    subject: "Biology",
    paperNumber: 2,
    duration: 105,
    totalMarks: 75,
    questionPdfUrl:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    markSchemePdfUrl:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    examinerReportUrl:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    questions: [
      {
        id: "2a",
        number: "2(a)",
        question: "Describe the structure and function of cell membranes.",
        totalMarks: 7,
        markScheme: [
          {
            id: "2a-1",
            keywords: ["phospholipid bilayer"],
            marks: 1,
          },
          {
            id: "2a-2",
            keywords: ["hydrophilic head", "phosphate group"],
            marks: 1,
          },
          {
            id: "2a-3",
            keywords: ["hydrophobic tail", "fatty acid"],
            marks: 1,
          },
          {
            id: "2a-4",
            keywords: ["protein channels"],
            synonyms: ["channel proteins"],
            marks: 1,
          },
          {
            id: "2a-5",
            keywords: ["selective permeability"],
            synonyms: ["semi-permeable"],
            marks: 1,
          },
          {
            id: "2a-6",
            keywords: ["cholesterol"],
            marks: 1,
          },
          {
            id: "2a-7",
            keywords: ["glycoproteins", "cell recognition"],
            marks: 1,
          },
        ],
        modelAnswer:
          "Cell membranes consist of a phospholipid bilayer with hydrophilic phosphate heads facing outward and hydrophobic fatty acid tails facing inward. Embedded proteins form channels for transport. The membrane is selectively permeable, controlling what enters and exits. Cholesterol maintains fluidity, while glycoproteins aid in cell recognition.",
        hasImages: false,
      },
    ],
  },
  {
    id: "2023-june-p2",
    year: 2023,
    session: "june",
    subject: "Biology",
    paperNumber: 2,
    duration: 105,
    totalMarks: 80,
    questionPdfUrl:
      "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    markSchemePdfUrl:
      "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    examinerReportUrl:
      "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    questions: [
      {
        id: "3a",
        number: "3(a)",
        question: "Explain the process of cellular respiration and its stages.",
        totalMarks: 9,
        markScheme: [
          {
            id: "3a-1",
            keywords: ["glycolysis"],
            marks: 1,
          },
          {
            id: "3a-2",
            keywords: ["cytoplasm"],
            marks: 1,
          },
          {
            id: "3a-3",
            keywords: ["Krebs cycle", "citric acid cycle"],
            marks: 1,
          },
          {
            id: "3a-4",
            keywords: ["mitochondria"],
            marks: 1,
          },
          {
            id: "3a-5",
            keywords: ["electron transport chain"],
            marks: 1,
          },
          {
            id: "3a-6",
            keywords: ["ATP synthesis"],
            marks: 1,
          },
          {
            id: "3a-7",
            keywords: ["oxygen", "final electron acceptor"],
            marks: 1,
          },
          {
            id: "3a-8",
            keywords: ["carbon dioxide", "waste product"],
            marks: 1,
          },
          {
            id: "3a-9",
            keywords: ["water", "byproduct"],
            marks: 1,
          },
        ],
        modelAnswer:
          "Cellular respiration occurs in three stages: glycolysis in the cytoplasm breaks down glucose, the Krebs cycle in mitochondria processes pyruvate, and the electron transport chain produces ATP using oxygen as the final electron acceptor, producing CO2 and water as waste.",
        hasImages: true,
      },
      {
        id: "3b",
        number: "3(b)",
        question: "Compare aerobic and anaerobic respiration.",
        totalMarks: 6,
        markScheme: [
          {
            id: "3b-1",
            keywords: ["oxygen requirement"],
            marks: 1,
          },
          {
            id: "3b-2",
            keywords: ["ATP yield", "38 ATP", "2 ATP"],
            marks: 1,
          },
          {
            id: "3b-3",
            keywords: ["end products"],
            marks: 1,
          },
          {
            id: "3b-4",
            keywords: ["lactic acid", "ethanol"],
            marks: 1,
          },
          {
            id: "3b-5",
            keywords: ["complete oxidation", "partial oxidation"],
            marks: 1,
          },
          {
            id: "3b-6",
            keywords: ["efficiency"],
            marks: 1,
          },
        ],
        modelAnswer:
          "Aerobic respiration requires oxygen and produces 38 ATP molecules with CO2 and water as end products through complete oxidation. Anaerobic respiration occurs without oxygen, produces only 2 ATP, and creates lactic acid or ethanol through partial oxidation, making it less efficient.",
        hasImages: false,
      },
    ],
  },
  {
    id: "2023-january-p2",
    year: 2023,
    session: "january",
    subject: "Biology",
    paperNumber: 2,
    duration: 105,
    totalMarks: 85,
    questionPdfUrl:
      "https://file-examples.com/storage/feb68bb9f5e9b4c6b1d6994/2017/10/file_example_PDF_500_kB.pdf",
    markSchemePdfUrl:
      "https://file-examples.com/storage/feb68bb9f5e9b4c6b1d6994/2017/10/file_example_PDF_500_kB.pdf",
    questions: [
      {
        id: "4a",
        number: "4(a)",
        question:
          "Describe the structure of DNA and explain its replication process.",
        totalMarks: 10,
        markScheme: [
          {
            id: "4a-1",
            keywords: ["double helix"],
            marks: 1,
          },
          {
            id: "4a-2",
            keywords: ["antiparallel strands"],
            marks: 1,
          },
          {
            id: "4a-3",
            keywords: ["complementary base pairing"],
            marks: 1,
          },
          {
            id: "4a-4",
            keywords: ["adenine", "thymine"],
            marks: 1,
          },
          {
            id: "4a-5",
            keywords: ["guanine", "cytosine"],
            marks: 1,
          },
          {
            id: "4a-6",
            keywords: ["DNA helicase"],
            marks: 1,
          },
          {
            id: "4a-7",
            keywords: ["DNA polymerase"],
            marks: 1,
          },
          {
            id: "4a-8",
            keywords: ["semi-conservative"],
            marks: 1,
          },
          {
            id: "4a-9",
            keywords: ["leading strand"],
            marks: 1,
          },
          {
            id: "4a-10",
            keywords: ["lagging strand", "Okazaki fragments"],
            marks: 1,
          },
        ],
        modelAnswer:
          "DNA has a double helix structure with antiparallel strands held by complementary base pairing (A-T, G-C). Replication is semi-conservative: helicase unwinds the strands, DNA polymerase adds nucleotides to the leading strand continuously and the lagging strand in Okazaki fragments.",
        hasImages: true,
      },
    ],
  },
  {
    id: "2022-june-p2",
    year: 2022,
    session: "june",
    subject: "Biology",
    paperNumber: 2,
    duration: 105,
    totalMarks: 70,
    questionPdfUrl: "https://www.africau.edu/images/default/sample.pdf",
    markSchemePdfUrl: "https://www.africau.edu/images/default/sample.pdf",
    examinerReportUrl: "https://www.africau.edu/images/default/sample.pdf",
    questions: [
      {
        id: "5a",
        number: "5(a)",
        question: "Explain enzyme structure and function.",
        totalMarks: 8,
        markScheme: [
          {
            id: "5a-1",
            keywords: ["protein structure"],
            marks: 1,
          },
          {
            id: "5a-2",
            keywords: ["active site"],
            marks: 1,
          },
          {
            id: "5a-3",
            keywords: ["substrate binding"],
            marks: 1,
          },
          {
            id: "5a-4",
            keywords: ["induced fit model"],
            marks: 1,
          },
          {
            id: "5a-5",
            keywords: ["activation energy"],
            marks: 1,
          },
          {
            id: "5a-6",
            keywords: ["catalyst"],
            marks: 1,
          },
          {
            id: "5a-7",
            keywords: ["enzyme-substrate complex"],
            marks: 1,
          },
          {
            id: "5a-8",
            keywords: ["product formation"],
            marks: 1,
          },
        ],
        modelAnswer:
          "Enzymes are proteins with specific active sites that bind substrates through induced fit. They act as catalysts, lowering activation energy to form enzyme-substrate complexes, facilitating product formation and then releasing products unchanged.",
        hasImages: false,
      },
      {
        id: "5b",
        number: "5(b)",
        question: "Discuss factors affecting enzyme activity.",
        totalMarks: 7,
        markScheme: [
          {
            id: "5b-1",
            keywords: ["temperature"],
            marks: 1,
          },
          {
            id: "5b-2",
            keywords: ["pH"],
            marks: 1,
          },
          {
            id: "5b-3",
            keywords: ["substrate concentration"],
            marks: 1,
          },
          {
            id: "5b-4",
            keywords: ["enzyme concentration"],
            marks: 1,
          },
          {
            id: "5b-5",
            keywords: ["competitive inhibition"],
            marks: 1,
          },
          {
            id: "5b-6",
            keywords: ["non-competitive inhibition"],
            marks: 1,
          },
          {
            id: "5b-7",
            keywords: ["denaturation"],
            marks: 1,
          },
        ],
        modelAnswer:
          "Enzyme activity is affected by temperature (increases until denaturation), pH (optimal range), substrate/enzyme concentration (until saturation), and inhibitors (competitive and non-competitive) that can reduce activity or cause denaturation.",
        hasImages: true,
      },
    ],
  },
];

export const getAvailableYears = (): number[] => {
  return Array.from(new Set(samplePapers.map((p) => p.year))).sort(
    (a, b) => b - a
  );
};

export const getAvailableSessions = (year: number): string[] => {
  return Array.from(
    new Set(samplePapers.filter((p) => p.year === year).map((p) => p.session))
  );
};

export const getWrittenPaper = (
  year: number,
  session: string
): WrittenPaper | undefined => {
  return samplePapers.find((p) => p.year === year && p.session === session);
};

export { samplePapers };
