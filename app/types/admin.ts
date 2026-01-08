export interface Community {
  id: string;
  name: string;
  slug: string;
  active: boolean;
}

export interface LearnCategory {
  id: string;
  name: string;
  order: number;
}

export type SectionType = "heading" | "text" | "code";

export interface LessonSection {
  id: string;
  type: SectionType;
  content: string;
  language?: string;
}

export interface Lesson {
  id: string;
  title: string;
  published: boolean;
  order: number;
  sections: LessonSection[];
}
