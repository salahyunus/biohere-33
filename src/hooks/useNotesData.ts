import { useState, useEffect } from "react";

export interface NotesLesson {
  id: string;
  title: string;
  content: NotesContent[];
  completed: boolean;
  syllabusObjectives?: SyllabusObjective[];
  isFirstInTopic?: boolean;
}

export interface SyllabusObjective {
  id: string;
  text: string;
  completed: boolean;
}

export interface NotesTopic {
  id: string;
  title: string;
  lessons: NotesLesson[];
}

export interface NotesUnit {
  id: string;
  title: string;
  description: string;
  topics: NotesTopic[];
  resources: { title: string; url: string; type: string }[];
}

export interface NotesContent {
  id: string;
  type:
    | "heading"
    | "paragraph"
    | "image"
    | "video"
    | "audio"
    | "quiz"
    | "flashcards"
    | "keywords"
    | "tip"
    | "warning"
    | "table"
    | "chart"
    | "links";
  content: any;
}

const STORAGE_KEY = "notes-data";

const sampleUnits: NotesUnit[] = [
  {
    id: "unit-1",
    title: "Cell Structure and Organisation",
    description:
      "Understanding the basic unit of life and how cells are organized",
    resources: [
      { title: "Interactive Cell Diagram", url: "#", type: "interactive" },
      { title: "Cell Structure Video", url: "#", type: "video" },
      { title: "Practice Questions", url: "#", type: "quiz" },
    ],
    topics: [
      {
        id: "topic-1-1",
        title: "Cell Theory",
        lessons: [
          {
            id: "lesson-1-1-1",
            title: "Introduction to Cell Theory",
            completed: false,
            isFirstInTopic: true,
            syllabusObjectives: [
              { id: "obj-1", text: "State the cell theory", completed: false },
              {
                id: "obj-2",
                text: "Discuss the evidence for the cell theory",
                completed: false,
              },
            ],
            content: [
              {
                id: "content-1",
                type: "heading",
                content: {
                  level: 1,
                  text: "Cell Theory: The Foundation of Biology",
                },
              },
              {
                id: "content-2",
                type: "paragraph",
                content: {
                  text: 'The <keyword definition="The basic structural and functional unit of all living organisms">cell</keyword> theory is one of the fundamental principles of biology. It consists of three main postulates that describe the properties of cells.',
                  highlights: [],
                },
              },
              {
                id: "content-3",
                type: "tip",
                content: {
                  type: "examiner-tip",
                  title: "Examiner Tip",
                  text: "Always remember to state all three postulates of cell theory in exam answers.",
                },
              },
              {
                id: "content-4",
                type: "image",
                content: {
                  src: "https://dummyimage.com/600x400/4f46e5/ffffff?text=Cell+Theory+Diagram",
                  alt: "Cell Theory Diagram",
                  caption: "The three main postulates of cell theory",
                },
              },
              {
                id: "content-5",
                type: "quiz",
                content: {
                  questions: [
                    {
                      id: "q1",
                      question:
                        "Which of the following is NOT a postulate of cell theory?",
                      options: [
                        "All living things are made of cells",
                        "Cells are the basic unit of life",
                        "All cells come from pre-existing cells",
                        "All cells contain DNA",
                      ],
                      correct: 3,
                      explanation:
                        "While all cells do contain genetic material, this is not one of the three main postulates of cell theory.",
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
    ],
  },
];

export const useNotesData = () => {
  const [units, setUnits] = useState<NotesUnit[]>(sampleUnits);
  const [currentLesson, setCurrentLesson] = useState<NotesLesson | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setUnits(data.units || sampleUnits);
      } catch (e) {
        console.error("Failed to load notes data:", e);
      }
    }
  }, []);

  const saveData = (updatedUnits: NotesUnit[]) => {
    setUnits(updatedUnits);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ units: updatedUnits }));
  };

  const toggleLessonComplete = (lessonId: string) => {
    const updatedUnits = units.map((unit) => ({
      ...unit,
      topics: unit.topics.map((topic) => ({
        ...topic,
        lessons: topic.lessons.map((lesson) =>
          lesson.id === lessonId
            ? { ...lesson, completed: !lesson.completed }
            : lesson
        ),
      })),
    }));
    saveData(updatedUnits);
  };

  const toggleObjectiveComplete = (lessonId: string, objectiveId: string) => {
    const updatedUnits = units.map((unit) => ({
      ...unit,
      topics: unit.topics.map((topic) => ({
        ...topic,
        lessons: topic.lessons.map((lesson) =>
          lesson.id === lessonId
            ? {
                ...lesson,
                syllabusObjectives: lesson.syllabusObjectives?.map((obj) =>
                  obj.id === objectiveId
                    ? { ...obj, completed: !obj.completed }
                    : obj
                ),
              }
            : lesson
        ),
      })),
    }));
    saveData(updatedUnits);
  };

  const getUnitProgress = (unitId: string): number => {
    const unit = units.find((u) => u.id === unitId);
    if (!unit) return 0;

    const allLessons = unit.topics.flatMap((topic) => topic.lessons);
    const completedLessons = allLessons.filter((lesson) => lesson.completed);

    return allLessons.length > 0
      ? (completedLessons.length / allLessons.length) * 100
      : 0;
  };

  const getTotalProgress = (): number => {
    const allLessons = units.flatMap((unit) =>
      unit.topics.flatMap((topic) => topic.lessons)
    );
    const completedLessons = allLessons.filter((lesson) => lesson.completed);

    return allLessons.length > 0
      ? (completedLessons.length / allLessons.length) * 100
      : 0;
  };

  return {
    units,
    currentLesson,
    setCurrentLesson,
    toggleLessonComplete,
    toggleObjectiveComplete,
    getUnitProgress,
    getTotalProgress,
  };
};
