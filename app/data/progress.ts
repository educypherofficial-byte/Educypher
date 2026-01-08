const STORAGE_KEY = "educypher-progress";

export type ProgressState = {
  lessonsCompleted: string[];
  practicesCompleted: string[];
};

export function getProgress(): ProgressState {
  if (typeof window === "undefined") {
    return { lessonsCompleted: [], practicesCompleted: [] };
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { lessonsCompleted: [], practicesCompleted: [] };
  }

  return JSON.parse(raw);
}

function save(progress: ProgressState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function markLessonCompleted(lessonId: string) {
  const progress = getProgress();
  if (!progress.lessonsCompleted.includes(lessonId)) {
    progress.lessonsCompleted.push(lessonId);
    save(progress);
  }
}

export function markPracticeCompleted(practiceId: string) {
  const progress = getProgress();
  if (!progress.practicesCompleted.includes(practiceId)) {
    progress.practicesCompleted.push(practiceId);
    save(progress);
  }
}
