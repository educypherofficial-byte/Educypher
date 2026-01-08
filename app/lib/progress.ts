const STORAGE_KEY = "educypher-progress";

export type ProgressState = {
  lessonsCompleted: string[];
  practicesCompleted: string[];
};

/* ---------- LOAD ---------- */
export function getProgress(): ProgressState {
  if (typeof window === "undefined") {
    return {
      lessonsCompleted: [],
      practicesCompleted: [],
    };
  }

  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return {
      lessonsCompleted: [],
      practicesCompleted: [],
    };
  }

  return JSON.parse(raw) as ProgressState;
}

/* ---------- SAVE ---------- */
function saveProgress(progress: ProgressState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

/* ---------- MARK LEARN ---------- */
export function markLessonCompleted(lessonId: string) {
  const progress = getProgress();

  if (!progress.lessonsCompleted.includes(lessonId)) {
    progress.lessonsCompleted.push(lessonId);
    saveProgress(progress);
  }
}

/* ---------- MARK PRACTICE ---------- */
export function markPracticeCompleted(practiceId: string) {
  const progress = getProgress();

  if (!progress.practicesCompleted.includes(practiceId)) {
    progress.practicesCompleted.push(practiceId);
    saveProgress(progress);
  }
}
