import { Topic } from "./types";

export const LEARN_TOPICS: Topic[] = [
  {
    id: "arrays",
    title: "Arrays & Hashing",
    lessons: [
      {
        id: "arrays-intro",
        title: "What is an Array",
        type: "learn",
      },
      {
        id: "hashmap-basics",
        title: "HashMap Basics",
        type: "learn",
      },
      {
        id: "two-sum",
        title: "Two Sum",
        type: "practice",
        practiceId: "two-sum",
      },
      {
        id: "prefix-sum",
        title: "Prefix Sum",
        type: "learn",
      },
    ],
  },
  {
    id: "two-pointers",
    title: "Two Pointers",
    lessons: [
      {
        id: "two-pointers-intro",
        title: "Intro to Two Pointers",
        type: "learn",
      },
      {
        id: "valid-palindrome",
        title: "Valid Palindrome",
        type: "practice",
        practiceId: "valid-palindrome",
      },
    ],
  },
];
