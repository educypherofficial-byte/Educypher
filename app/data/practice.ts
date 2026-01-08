// app/data/practice.ts

export type Difficulty = "Easy" | "Medium" | "Hard";

export type PracticeProblem = {
  id: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  description: string;
};

/* ---------------- PRACTICE PROBLEMS ---------------- */

export const PRACTICE_PROBLEMS: PracticeProblem[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Array", "HashMap"],
    description:
      "Given an array of integers, return indices of the two numbers such that they add up to a target.",
  },
  {
    id: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    tags: ["Binary Search"],
    description:
      "Given a sorted array, find the index of a target value.",
  },
  {
    id: "longest-substring",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    tags: ["Sliding Window", "String"],
    description:
      "Find the length of the longest substring without repeating characters.",
  },
];

/* ---------------- PROGRESS HELPERS ---------------- */

export function markPracticeSolved(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`practice-${id}`, "true");
}

export function isPracticeSolved(id: string) {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(`practice-${id}`) === "true";
}
