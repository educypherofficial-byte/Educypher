export interface CommunityPost {
  id: string;
  communityId: string;
  title: string;
  content: string;
  authorName: string;
  createdAt: number;
  upvotes: number;
}
