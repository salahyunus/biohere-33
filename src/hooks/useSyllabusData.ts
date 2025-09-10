import { useState, useEffect } from "react";

export interface SyllabusObjective {
  id: string;
  text: string;
  completed: boolean;
  tags: string[];
  comment: string;
  folderId?: string;
  isCustom?: boolean;
}

export interface SyllabusTopic {
  id: string;
  title: string;
  objectives: SyllabusObjective[];
  subtopics?: SyllabusTopic[];
  isCustom?: boolean;
  expanded?: boolean;
}

export interface SyllabusUnit {
  id: string;
  title: string;
  description: string;
  topics: SyllabusTopic[];
  isCustom?: boolean;
}

export interface SyllabusSettings {
  strikethrough: boolean;
  expandAll: boolean;
  collapseAll: boolean;
}

const defaultUnits: SyllabusUnit[] = [
  {
    id: "unit-1",
    title: "Cell Structure and Organisation",
    description:
      "Understanding the basic unit of life and how cells are organized",
    topics: [
      {
        id: "topic-1-1",
        title: "Cell Theory",
        expanded: false,
        objectives: [
          {
            id: "obj-1-1-1",
            text: "State the cell theory",
            completed: false,
            tags: ["important"],
            comment: "",
          },
          {
            id: "obj-1-1-2",
            text: "Discuss the evidence for the cell theory",
            completed: false,
            tags: [],
            comment: "",
          },
        ],
      },
      {
        id: "topic-1-2",
        title: "Prokaryotic and Eukaryotic Cells",
        expanded: false,
        objectives: [
          {
            id: "obj-1-2-1",
            text: "Compare and contrast prokaryotic and eukaryotic cells",
            completed: false,
            tags: ["important"],
            comment: "",
          },
        ],
        subtopics: [
          {
            id: "subtopic-1-2-1",
            title: "Cell Organelles",
            expanded: false,
            objectives: [
              {
                id: "obj-1-2-1-1",
                text: "Describe the structure and function of the nucleus",
                completed: false,
                tags: [],
                comment: "",
              },
              {
                id: "obj-1-2-1-2",
                text: "Describe the structure and function of mitochondria",
                completed: false,
                tags: ["important"],
                comment: "",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "unit-2",
    title: "Biological Molecules",
    description:
      "The chemistry of life - carbohydrates, proteins, lipids, and nucleic acids",
    topics: [
      {
        id: "topic-2-1",
        title: "Carbohydrates",
        expanded: false,
        objectives: [
          {
            id: "obj-2-1-1",
            text: "Describe the structure of monosaccharides",
            completed: false,
            tags: [],
            comment: "",
          },
          {
            id: "obj-2-1-2",
            text: "Explain the formation of glycosidic bonds",
            completed: false,
            tags: ["important"],
            comment: "",
          },
        ],
      },
    ],
  },
];

const defaultSettings: SyllabusSettings = {
  strikethrough: true,
  expandAll: false,
  collapseAll: false,
};

export const useSyllabusData = () => {
  const [units, setUnits] = useState<SyllabusUnit[]>(defaultUnits);
  const [settings, setSettings] = useState<SyllabusSettings>(defaultSettings);

  useEffect(() => {
    const savedUnits = localStorage.getItem("syllabus-units");
    const savedSettings = localStorage.getItem("syllabus-settings");

    if (savedUnits) {
      setUnits(JSON.parse(savedUnits));
    }
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const saveData = (
    newUnits: SyllabusUnit[],
    newSettings?: SyllabusSettings
  ) => {
    setUnits(newUnits);
    localStorage.setItem("syllabus-units", JSON.stringify(newUnits));

    if (newSettings) {
      setSettings(newSettings);
      localStorage.setItem("syllabus-settings", JSON.stringify(newSettings));
    }
  };

  const updateObjective = (
    unitId: string,
    topicId: string,
    objectiveId: string,
    updates: Partial<SyllabusObjective>,
    subtopicId?: string
  ) => {
    const newUnits = units.map((unit) => {
      if (unit.id !== unitId) return unit;

      return {
        ...unit,
        topics: unit.topics.map((topic) => {
          if (topic.id !== topicId) return topic;

          if (subtopicId && topic.subtopics) {
            return {
              ...topic,
              subtopics: topic.subtopics.map((subtopic) => {
                if (subtopic.id !== subtopicId) return subtopic;

                return {
                  ...subtopic,
                  objectives: subtopic.objectives.map((obj) =>
                    obj.id === objectiveId ? { ...obj, ...updates } : obj
                  ),
                };
              }),
            };
          }

          return {
            ...topic,
            objectives: topic.objectives.map((obj) =>
              obj.id === objectiveId ? { ...obj, ...updates } : obj
            ),
          };
        }),
      };
    });

    saveData(newUnits);
  };

  const updateSettings = (newSettings: SyllabusSettings) => {
    let updatedUnits = [...units];

    if (newSettings.expandAll !== settings.expandAll && newSettings.expandAll) {
      updatedUnits = units.map((unit) => ({
        ...unit,
        topics: unit.topics.map((topic) => ({
          ...topic,
          expanded: true,
          subtopics: topic.subtopics?.map((subtopic) => ({
            ...subtopic,
            expanded: true,
          })),
        })),
      }));
    }

    if (
      newSettings.collapseAll !== settings.collapseAll &&
      newSettings.collapseAll
    ) {
      updatedUnits = units.map((unit) => ({
        ...unit,
        topics: unit.topics.map((topic) => ({
          ...topic,
          expanded: false,
          subtopics: topic.subtopics?.map((subtopic) => ({
            ...subtopic,
            expanded: false,
          })),
        })),
      }));
    }

    saveData(updatedUnits, newSettings);
  };

  const addCustomTopic = (unitId: string, title: string) => {
    const newTopic: SyllabusTopic = {
      id: `custom-topic-${Date.now()}`,
      title,
      objectives: [],
      isCustom: true,
      expanded: false,
    };

    const newUnits = units.map((unit) => {
      if (unit.id === unitId) {
        return { ...unit, topics: [...unit.topics, newTopic] };
      }
      return unit;
    });

    saveData(newUnits);
  };

  const addCustomObjective = (
    unitId: string,
    topicId: string,
    text: string,
    subtopicId?: string
  ) => {
    const newObjective: SyllabusObjective = {
      id: `custom-obj-${Date.now()}`,
      text,
      completed: false,
      tags: [],
      comment: "",
      isCustom: true,
    };

    const newUnits = units.map((unit) => {
      if (unit.id !== unitId) return unit;

      return {
        ...unit,
        topics: unit.topics.map((topic) => {
          if (topic.id !== topicId) return topic;

          if (subtopicId && topic.subtopics) {
            return {
              ...topic,
              subtopics: topic.subtopics.map((subtopic) => {
                if (subtopic.id !== subtopicId) return subtopic;

                return {
                  ...subtopic,
                  objectives: [...subtopic.objectives, newObjective],
                };
              }),
            };
          }

          return {
            ...topic,
            objectives: [...topic.objectives, newObjective],
          };
        }),
      };
    });

    saveData(newUnits);
  };

  const deleteObjective = (
    unitId: string,
    topicId: string,
    objectiveId: string,
    subtopicId?: string
  ) => {
    const newUnits = units.map((unit) => {
      if (unit.id !== unitId) return unit;

      return {
        ...unit,
        topics: unit.topics.map((topic) => {
          if (topic.id !== topicId) return topic;

          if (subtopicId && topic.subtopics) {
            return {
              ...topic,
              subtopics: topic.subtopics.map((subtopic) => {
                if (subtopic.id !== subtopicId) return subtopic;

                return {
                  ...subtopic,
                  objectives: subtopic.objectives.filter(
                    (obj) => obj.id !== objectiveId
                  ),
                };
              }),
            };
          }

          return {
            ...topic,
            objectives: topic.objectives.filter(
              (obj) => obj.id !== objectiveId
            ),
          };
        }),
      };
    });

    saveData(newUnits);
  };

  const deleteTopic = (unitId: string, topicId: string) => {
    const newUnits = units.map((unit) => {
      if (unit.id !== unitId) return unit;

      return {
        ...unit,
        topics: unit.topics.filter((topic) => topic.id !== topicId),
      };
    });

    saveData(newUnits);
  };

  const getTotalProgress = (): number => {
    let totalObjectives = 0;
    let completedObjectives = 0;

    units.forEach((unit) => {
      unit.topics.forEach((topic) => {
        totalObjectives += topic.objectives.length;
        completedObjectives += topic.objectives.filter(
          (obj) => obj.completed
        ).length;

        if (topic.subtopics) {
          topic.subtopics.forEach((subtopic) => {
            totalObjectives += subtopic.objectives.length;
            completedObjectives += subtopic.objectives.filter(
              (obj) => obj.completed
            ).length;
          });
        }
      });
    });

    return totalObjectives === 0
      ? 0
      : (completedObjectives / totalObjectives) * 100;
  };

  const getUnitProgress = (unitId: string): number => {
    const unit = units.find((u) => u.id === unitId);
    if (!unit) return 0;

    let totalObjectives = 0;
    let completedObjectives = 0;

    unit.topics.forEach((topic) => {
      totalObjectives += topic.objectives.length;
      completedObjectives += topic.objectives.filter(
        (obj) => obj.completed
      ).length;

      if (topic.subtopics) {
        topic.subtopics.forEach((subtopic) => {
          totalObjectives += subtopic.objectives.length;
          completedObjectives += subtopic.objectives.filter(
            (obj) => obj.completed
          ).length;
        });
      }
    });

    return totalObjectives === 0
      ? 0
      : (completedObjectives / totalObjectives) * 100;
  };

  return {
    units,
    settings,
    updateObjective,
    updateSettings,
    addCustomTopic,
    addCustomObjective,
    deleteObjective,
    deleteTopic,
    getTotalProgress,
    getUnitProgress,
  };
};
