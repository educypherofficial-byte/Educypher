import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { addPoints } from "@/lib/points";
import {
  Community,
  CommunityPost,
  CommunityComment,
} from "@/types/community";

/* COMMUNITIES */
export async function getCommunities(): Promise<Community[]> {
  const snap = await getDocs(collection(db, "communities"));
  return snap.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as Community
  );
}

/* POSTS */
export async function getCommunityPosts(
  communityId: string
): Promise<CommunityPost[]> {
  const snap = await getDocs(
    query(
      collection(db, "communities", communityId, "posts"),
      orderBy("createdAt", "desc")
    )
  );

  return snap.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as CommunityPost
  );
}

export async function createCommunityPost(
  communityId: string,
  data: {
    title: string;
    content: string;
    authorId: string;
    authorName: string;
  }
) {
  await addDoc(
    collection(db, "communities", communityId, "posts"),
    {
      ...data,
      upvotes: 0,
      createdAt: serverTimestamp(),
    }
  );

  await addPoints(data.authorId, 10);
}

export async function getCommunityPost(
  communityId: string,
  postId: string
): Promise<CommunityPost | null> {
  const snap = await getDoc(
    doc(db, "communities", communityId, "posts", postId)
  );
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as CommunityPost;
}

/* COMMENTS */
export async function getPostComments(
  communityId: string,
  postId: string
): Promise<CommunityComment[]> {
  const snap = await getDocs(
    query(
      collection(
        db,
        "communities",
        communityId,
        "posts",
        postId,
        "comments"
      ),
      orderBy("createdAt", "asc")
    )
  );

  return snap.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as CommunityComment
  );
}

export async function addComment(
  communityId: string,
  postId: string,
  data: {
    content: string;
    authorId: string;
    authorName: string;
  }
) {
  await addDoc(
    collection(
      db,
      "communities",
      communityId,
      "posts",
      postId,
      "comments"
    ),
    {
      ...data,
      createdAt: serverTimestamp(),
    }
  );

  await addPoints(data.authorId, 5);
}
