export type Difficulty = "Easy" | "Medium" | "Hard";

export type LessonStatus = "done" | "current" | "locked";

export type Lesson =
  | {
      id: string;
      title: string;
      type: "learn";
    }
  | {
      id: string;
      title: string;
      type: "practice";
      practiceId: string;
    };

export type Topic = {
  id: string;
  title: string;
  lessons: Lesson[];
};


export type PracticeProblem = {
  id: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  topic: string;
};

export type UserProgress = {
  solvedProblems: string[];
  currentTopic: string;
  currentProblem: string | null;
  streak: number;
};
