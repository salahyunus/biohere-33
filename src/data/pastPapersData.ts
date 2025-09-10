export interface PastPaperData {
  id: string;
  year: number;
  session: string;
  subject: string;
  paperNumber: number;
  questionPdfUrl: string;
  markSchemePdfUrl: string;
  examinerReportUrl: string;
  questions: PaperQuestionData[];
}

export interface PaperQuestionData {
  id: string;
  number: string;
  question: string;
  answer: string;
  marks: number;
  topic?: string;
}

// Unique PDF URLs for different papers (using different sample PDFs)
const PDF_URLS = {
  question: {
    "2025-jan":
      "https://qualifications.pearson.com/content/dam/pdf/International-Advanced-Level/Biology/2018/Exam-materials/wbi14-01-que-20240529.pdf",
    "2025-june":
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    "2024-jan":
      "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf",
    "2024-june": "https://www.africau.edu/images/default/sample.pdf",
    "2024-oct":
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    "2023-jan":
      "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf",
    "2023-june": "https://www.africau.edu/images/default/sample.pdf",
    "2023-oct":
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    "2022-jan":
      "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf",
    "2022-june": "https://www.africau.edu/images/default/sample.pdf",
    "2022-oct":
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    "2021-jan":
      "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf",
    "2021-june": "https://www.africau.edu/images/default/sample.pdf",
    "2021-oct":
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  markScheme: {
    "2025-jan":
      "https://qualifications.pearson.com/content/dam/pdf/International-Advanced-Level/Biology/2018/Exam-materials/wbi14-01-que-20240529.pdf",
    "2025-june":
      "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf",
    "2024-jan": "https://www.africau.edu/images/default/sample.pdf",
    "2024-june":
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    "2024-oct":
      "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf",
    "2023-jan": "https://www.africau.edu/images/default/sample.pdf",
    "2023-june":
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    "2023-oct":
      "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf",
    "2022-jan": "https://www.africau.edu/images/default/sample.pdf",
    "2022-june":
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    "2022-oct":
      "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf",
    "2021-jan": "https://www.africau.edu/images/default/sample.pdf",
    "2021-june":
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    "2021-oct":
      "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf",
  },
};

export const pastPapersData: PastPaperData[] = [
  // 2025 Papers
  {
    id: "2025-jan-p1",
    year: 2025,
    session: "jan",
    subject: "Biology",
    paperNumber: 1,
    questionPdfUrl:
      PDF_URLS.question[
        "https://qualifications.pearson.com/content/dam/pdf/International-Advanced-Level/Biology/2018/Exam-materials/wbi14-01-que-20240529.pdf"
      ],
    markSchemePdfUrl: PDF_URLS.markScheme["2025-jan"],
    examinerReportUrl: PDF_URLS.question["2025-jan"],
    questions: [
      {
        id: "1a",
        number: "1a",
        question:
          "Define active transport and explain how it differs from passive transport mechanisms.",
        answer:
          "Active transport is the movement of substances across cell membranes against their concentration gradient, requiring energy in the form of ATP. Unlike passive transport (diffusion, osmosis), active transport moves substances from low to high concentration and requires carrier proteins and metabolic energy.",
        marks: 4,
        topic: "Cell Biology",
      },
      {
        id: "1b",
        number: "1b",
        question:
          "Describe the role of sodium-potassium pumps in maintaining cell membrane potential.",
        answer:
          "Sodium-potassium pumps actively transport 3 Na+ ions out and 2 K+ ions in per ATP molecule used. This creates an electrochemical gradient with more positive charge outside the cell, establishing a membrane potential of about -70mV, essential for nerve impulse transmission and maintaining cell volume.",
        marks: 6,
        topic: "Cell Biology",
      },
      {
        id: "2a",
        number: "2a",
        question: "Explain the process of DNA replication in prokaryotes.",
        answer:
          "DNA replication begins at the origin of replication where DNA helicase unwinds the double helix. DNA polymerase adds nucleotides in the 5' to 3' direction. The leading strand is synthesized continuously while the lagging strand forms Okazaki fragments. DNA ligase joins the fragments to complete replication.",
        marks: 8,
        topic: "Genetics",
      },
    ],
  },
  {
    id: "2025-june-p1",
    year: 2025,
    session: "june",
    subject: "Biology",
    paperNumber: 1,
    questionPdfUrl: PDF_URLS.question["2025-june"],
    markSchemePdfUrl: PDF_URLS.markScheme["2025-june"],
    examinerReportUrl: PDF_URLS.question["2025-june"],
    questions: [
      {
        id: "1a",
        number: "1a",
        question:
          "Describe the structure and function of enzymes in biological systems.",
        answer:
          "Enzymes are globular proteins with specific active sites that bind to substrates. They lower activation energy by stabilizing the transition state. The induced fit model explains how enzymes change shape to accommodate substrates, catalyzing reactions without being consumed.",
        marks: 5,
        topic: "Enzymes",
      },
      {
        id: "1b",
        number: "1b",
        question:
          "Explain how temperature affects enzyme activity and the concept of optimum temperature.",
        answer:
          "As temperature increases, molecular kinetic energy increases, leading to more enzyme-substrate collisions and higher reaction rates. However, beyond the optimum temperature, the enzyme denatures as hydrogen bonds break, destroying the active site shape and reducing activity.",
        marks: 6,
        topic: "Enzymes",
      },
      {
        id: "2a",
        number: "2a",
        question:
          "Compare and contrast mitosis and meiosis in terms of their outcomes and significance.",
        answer:
          "Mitosis produces two genetically identical diploid cells for growth and repair. Meiosis produces four genetically different haploid gametes for sexual reproduction. Meiosis involves crossing over and independent assortment, increasing genetic variation, while mitosis maintains genetic consistency.",
        marks: 10,
        topic: "Cell Division",
      },
    ],
  },
  // 2024 Papers
  {
    id: "2024-jan-p1",
    year: 2024,
    session: "jan",
    subject: "Biology",
    paperNumber: 1,
    questionPdfUrl: PDF_URLS.question["2024-jan"],
    markSchemePdfUrl: PDF_URLS.markScheme["2024-jan"],
    examinerReportUrl: PDF_URLS.question["2024-jan"],
    questions: [
      {
        id: "1a",
        number: "1a",
        question: "Explain the light-dependent reactions of photosynthesis.",
        answer:
          "Light-dependent reactions occur in thylakoid membranes. Photosystem II captures light energy, splitting water molecules to release oxygen, protons, and electrons. Electrons move through the electron transport chain to Photosystem I, generating ATP via chemiosmosis and NADPH for use in light-independent reactions.",
        marks: 6,
        topic: "Photosynthesis",
      },
      {
        id: "1b",
        number: "1b",
        question: "Describe the Calvin cycle and its products.",
        answer:
          "The Calvin cycle occurs in the stroma and fixes CO2 using RuBisCO enzyme. Three phases: carbon fixation (CO2 + RuBP), reduction (using ATP and NADPH), and regeneration of RuBP. The cycle produces glucose and regenerates RuBP to continue the process.",
        marks: 7,
        topic: "Photosynthesis",
      },
    ],
  },
  {
    id: "2024-june-p1",
    year: 2024,
    session: "june",
    subject: "Biology",
    paperNumber: 1,
    questionPdfUrl: PDF_URLS.question["2024-june"],
    markSchemePdfUrl: PDF_URLS.markScheme["2024-june"],
    examinerReportUrl: PDF_URLS.question["2024-june"],
    questions: [
      {
        id: "1a",
        number: "1a",
        question:
          "Describe the structure of cell membranes according to the fluid mosaic model.",
        answer:
          "The fluid mosaic model describes cell membranes as a phospholipid bilayer with embedded proteins. Phospholipids have hydrophilic heads facing outward and hydrophobic tails inward. Cholesterol maintains fluidity, while integral and peripheral proteins facilitate transport and recognition.",
        marks: 5,
        topic: "Cell Membranes",
      },
      {
        id: "2a",
        number: "2a",
        question:
          "Explain how osmosis affects plant cells and the concept of turgor pressure.",
        answer:
          "Osmosis is water movement across semi-permeable membranes from high to low water potential. In plant cells, water uptake increases turgor pressure against the cell wall, making cells turgid and maintaining plant structure. Water loss causes plasmolysis and wilting.",
        marks: 8,
        topic: "Transport in Plants",
      },
    ],
  },
  {
    id: "2024-oct-p1",
    year: 2024,
    session: "oct",
    subject: "Biology",
    paperNumber: 1,
    questionPdfUrl: PDF_URLS.question["2024-oct"],
    markSchemePdfUrl: PDF_URLS.markScheme["2024-oct"],
    examinerReportUrl: PDF_URLS.question["2024-oct"],
    questions: [
      {
        id: "1a",
        number: "1a",
        question: "Describe the process of transcription in eukaryotes.",
        answer:
          "Transcription begins when RNA polymerase II binds to the promoter region with help from transcription factors. The DNA double helix unwinds, and RNA polymerase synthesizes mRNA using the template strand. The process includes initiation, elongation, and termination, followed by RNA processing.",
        marks: 6,
        topic: "Gene Expression",
      },
      {
        id: "2a",
        number: "2a",
        question: "Explain the process of translation and protein synthesis.",
        answer:
          "Translation occurs at ribosomes where mRNA is decoded to synthesize proteins. tRNA molecules carry specific amino acids matching their anticodons to mRNA codons. The ribosome facilitates peptide bond formation between amino acids, creating polypeptide chains that fold into functional proteins.",
        marks: 9,
        topic: "Gene Expression",
      },
    ],
  },
  // 2023 Papers
  {
    id: "2023-jan-p1",
    year: 2023,
    session: "jan",
    subject: "Biology",
    paperNumber: 1,
    questionPdfUrl: PDF_URLS.question["2023-jan"],
    markSchemePdfUrl: PDF_URLS.markScheme["2023-jan"],
    examinerReportUrl: PDF_URLS.question["2023-jan"],
    questions: [
      {
        id: "1a",
        number: "1a",
        question:
          "Explain the concept of homeostasis and negative feedback mechanisms.",
        answer:
          "Homeostasis maintains constant internal conditions despite external changes. Negative feedback mechanisms detect deviations from set points and trigger responses to restore balance. Examples include temperature regulation and blood glucose control through insulin and glucagon.",
        marks: 5,
        topic: "Homeostasis",
      },
      {
        id: "2a",
        number: "2a",
        question: "Describe the role of the kidney in osmoregulation.",
        answer:
          "Kidneys regulate water and salt balance through nephrons. The loop of Henle creates a concentration gradient, ADH controls water reabsorption in collecting ducts, and aldosterone regulates sodium reabsorption. This maintains blood osmolarity and volume.",
        marks: 8,
        topic: "Excretion",
      },
    ],
  },
  // Add more papers for other years/sessions with unique content...
  {
    id: "2023-june-p1",
    year: 2023,
    session: "june",
    subject: "Biology",
    paperNumber: 1,
    questionPdfUrl: PDF_URLS.question["2023-june"],
    markSchemePdfUrl: PDF_URLS.markScheme["2023-june"],
    examinerReportUrl: PDF_URLS.question["2023-june"],
    questions: [
      {
        id: "1a",
        number: "1a",
        question:
          "Describe the structure and function of antibodies in immune responses.",
        answer:
          "Antibodies are Y-shaped glycoproteins with heavy and light chains. Variable regions bind specific antigens, while constant regions determine antibody class. They neutralize pathogens, mark them for destruction, and activate complement systems in adaptive immunity.",
        marks: 6,
        topic: "Immunity",
      },
    ],
  },
];

export const getPastPaperById = (id: string): PastPaperData | undefined => {
  return pastPapersData.find((paper) => paper.id === id);
};

export const getPastPapersByYear = (year: number): PastPaperData[] => {
  return pastPapersData.filter((paper) => paper.year === year);
};

export const getPastPapersBySession = (
  year: number,
  session: string
): PastPaperData[] => {
  return pastPapersData.filter(
    (paper) => paper.year === year && paper.session === session
  );
};
