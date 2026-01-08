export type ActivityType = "practice" | "learn" | "post";

export type Activity = {
  id: string;
  type: ActivityType;
  title: string;
  user: string;
  createdAt: string;
};
