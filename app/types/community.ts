import { Timestamp } from "firebase/firestore";

export type Community = {
  id: string;
  name: string;
  description: string;
  icon?: string;
  postCount?: number;
};

export type CommunityPost = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  likeCount: number;      // ✅ ADD
  commentCount: number;
  upvotes: number;
  createdAt: Timestamp;
};

export type CommunityComment = {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Timestamp;
};
