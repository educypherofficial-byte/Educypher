import { Timestamp } from "firebase/firestore";

export type FeedReactions = {
  like: number;
  fire: number;
  laugh: number;
};

export type FeedPost = {
  id: string;
  text: string;
  image?: string;
  tags: string[];
  userId: string;
  userName: string;
  createdAt?: Timestamp | Date | number | null;
  reactions: FeedReactions;
  commentCount: number;
};

export type FeedComment = {
  id: string;
  text: string;
  userId: string;
  userName: string;
  createdAt?: Timestamp | Date | number | null;
};

export const FEED_TAGS = [
  "JavaScript",
  "Python",
  "WebDev",
  "DSA",
  "AI",
  "Career",
  "Bug",
  "Project",
  "Resource",
];
