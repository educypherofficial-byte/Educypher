import {
  addDoc,
  collection,
  doc,
  increment,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function createCommunityPost(
  communityId: string,
  data: {
    title: string;
    content: string;
    tags: string[];
    authorId: string;
    authorName: string;
  }
) {
  await addDoc(
    collection(db, "communities", communityId, "posts"),
    {
      ...data,
      createdAt: Date.now(),
      upvotes: 0,
      upvotedBy: [],
      commentCount: 0,
    }
  );

  // increment post count on community
  await updateDoc(doc(db, "communities", communityId), {
    postCount: increment(1),
  });
}
