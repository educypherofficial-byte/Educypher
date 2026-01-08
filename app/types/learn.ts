export type LearnCategory = {
  id: string;
  slug: string;
  title: string;
  description: string;
  order: number;
};

export type LessonBlock =
  | { type: "text"; value: string }
  | { type: "code"; value: string; language?: string }
  | { type: "image"; value: string };

export type Lesson = {
  id: string;
  title: string;
  category: string; // category slug
  order: number;
  hashtags: string[];
  published: boolean;
  content: LessonBlock[];
};
