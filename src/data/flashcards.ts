export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
  subtopic?: string;
  tags: string[];
  imageUrl?: string;
  answerImageUrl?: string;
  setId?: string;
}

export interface FlashcardSet {
  id: string;
  name: string;
  topic: string;
  description: string;
  cards: Flashcard[];
  isCustom?: boolean;
}

export const flashcardsData: FlashcardSet[] = [
  // Adding comprehensive Biology topics
  {
    id: "biology-enzyme-kinetics",
    name: "Enzyme Kinetics",
    topic: "Biology",
    description: "Understanding enzyme function and kinetic models",
    cards: [
      {
        id: "enz-1",
        question: "What is the Michaelis-Menten equation?",
        answer:
          "v = (Vmax × [S]) / (Km + [S])\n\nWhere:\nv = initial velocity\nVmax = maximum velocity\n[S] = substrate concentration\nKm = Michaelis constant",
        difficulty: "hard",
        topic: "Biology",
        subtopic: "Enzyme Kinetics",
        tags: ["equation", "kinetics", "advanced"],
      },
      {
        id: "enz-2",
        question: "What does a low Km value indicate?",
        answer:
          "A low Km value indicates high enzyme affinity for its substrate. The enzyme reaches half its maximum velocity at a low substrate concentration.",
        difficulty: "medium",
        topic: "Biology",
        subtopic: "Enzyme Kinetics",
        tags: ["kinetics", "affinity"],
      },
    ],
  },
  {
    id: "biology-metabolism",
    name: "Cellular Metabolism",
    topic: "Biology",
    description: "Energy production and metabolic pathways",
    cards: [
      {
        id: "met-1",
        question: "What are the three stages of cellular respiration?",
        answer:
          "1. Glycolysis - glucose broken down to pyruvate in cytoplasm\n2. Krebs cycle - pyruvate oxidized in mitochondrial matrix\n3. Electron transport chain - ATP production via oxidative phosphorylation",
        difficulty: "medium",
        topic: "Biology",
        subtopic: "Metabolism",
        tags: ["respiration", "ATP", "pathways"],
      },
      {
        id: "met-2",
        question:
          "How many ATP molecules are produced from one glucose molecule?",
        answer:
          "Approximately 30-32 ATP molecules:\n- Glycolysis: 2 ATP (net)\n- Krebs cycle: 2 ATP\n- Electron transport: 26-28 ATP",
        difficulty: "medium",
        topic: "Biology",
        subtopic: "Metabolism",
        tags: ["ATP", "calculation"],
      },
    ],
  },
  {
    id: "biology-photosynthesis",
    name: "Photosynthesis",
    topic: "Biology",
    description: "Light-dependent and independent reactions",
    cards: [
      {
        id: "photo-1",
        question: "What is the overall equation for photosynthesis?",
        answer:
          "6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂\n\nCarbon dioxide + Water + Light energy → Glucose + Oxygen",
        difficulty: "easy",
        topic: "Biology",
        subtopic: "Photosynthesis",
        tags: ["equation", "important"],
      },
      {
        id: "photo-2",
        question: "Where do light-dependent reactions occur?",
        answer:
          "Light-dependent reactions occur in the thylakoid membranes of chloroplasts. They produce ATP, NADPH, and oxygen.",
        difficulty: "medium",
        topic: "Biology",
        subtopic: "Photosynthesis",
        tags: ["location", "thylakoid"],
      },
    ],
  },
  {
    id: "biology-genetics",
    name: "Molecular Genetics",
    topic: "Biology",
    description: "DNA, RNA, and protein synthesis",
    cards: [
      {
        id: "gen-1",
        question: "What is the central dogma of molecular biology?",
        answer:
          "DNA → RNA → Protein\n\nGenetic information flows from DNA to RNA (transcription) then from RNA to protein (translation).",
        difficulty: "easy",
        topic: "Biology",
        subtopic: "Genetics",
        tags: ["central dogma", "important"],
      },
      {
        id: "gen-2",
        question: "What are the differences between DNA and RNA?",
        answer:
          "DNA: Double-stranded, deoxyribose sugar, A-T-G-C bases, stable\nRNA: Single-stranded, ribose sugar, A-U-G-C bases, less stable",
        difficulty: "medium",
        topic: "Biology",
        subtopic: "Genetics",
        tags: ["comparison", "nucleic acids"],
      },
    ],
  },
  {
    id: "biology-membrane-transport",
    name: "Membrane Transport",
    topic: "Biology",
    description: "Passive and active transport mechanisms",
    cards: [
      {
        id: "mem-1",
        question:
          "What is the difference between passive and active transport?",
        answer:
          "Passive transport: No energy required, moves down concentration gradient (diffusion, osmosis)\nActive transport: Requires energy (ATP), moves against concentration gradient",
        difficulty: "medium",
        topic: "Biology",
        subtopic: "Membrane Transport",
        tags: ["transport", "energy"],
      },
      {
        id: "mem-2",
        question: "What is osmosis?",
        answer:
          "Osmosis is the passive movement of water molecules across a semi-permeable membrane from an area of lower solute concentration to higher solute concentration.",
        difficulty: "easy",
        topic: "Biology",
        subtopic: "Membrane Transport",
        tags: ["osmosis", "water"],
      },
    ],
  },
];
