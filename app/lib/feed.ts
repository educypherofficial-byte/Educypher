import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
  increment,
  query,
  orderBy,
  getDoc,
  setDoc,
  deleteDoc,
  where,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { FeedPost, FeedComment } from "@/types/feed";

/* POSTS */
export async function getFeedPosts(): Promise<FeedPost[]> {
  const snap = await getDocs(
    query(collection(db, "feed"), orderBy("createdAt", "desc"))
  );

  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      text: data.text,
      image: data.image,
      tags: data.tags || [],
      userId: data.userId,
      userName: data.userName,
      createdAt: data.createdAt,
      reactions: data.reactions ?? { like: 0, fire: 0, laugh: 0 },
      commentCount: data.commentCount ?? 0,
    };
  });
}

export async function getFeedPost(feedId: string): Promise<FeedPost | null> {
  const snap = await getDoc(doc(db, "feed", feedId));
  if (!snap.exists()) return null;

  const data = snap.data();
  return {
    id: snap.id,
    text: data.text,
    image: data.image,
    tags: data.tags || [],
    userId: data.userId,
    userName: data.userName,
    createdAt: data.createdAt,
    reactions: data.reactions ?? { like: 0, fire: 0, laugh: 0 },
    commentCount: data.commentCount ?? 0,
  };
}

export async function createFeedPost(data: {
  text: string;
  image?: string;
  tags: string[];
  userId: string;
  userName: string;
}) {
  await addDoc(collection(db, "feed"), {
    ...data,
    reactions: { like: 0, fire: 0, laugh: 0 },
    commentCount: 0,
    createdAt: serverTimestamp(),
  });
}

/* COMMENTS */
export async function getFeedComments(feedId: string): Promise<FeedComment[]> {
  const snap = await getDocs(
    query(
      collection(db, "feed", feedId, "comments"),
      orderBy("createdAt", "asc")
    )
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FeedComment));
}

export async function addFeedComment(
  feedId: string,
  data: { text: string; userId: string; userName: string }
) {
  await addDoc(collection(db, "feed", feedId, "comments"), {
    ...data,
    createdAt: serverTimestamp(),
  });

  await updateDoc(doc(db, "feed", feedId), {
    commentCount: increment(1),
  });
}

/* REACTIONS */
export async function reactOnce(
  feedId: string,
  uid: string,
  type: "like" | "fire" | "laugh"
) {
  const refDoc = doc(db, "feed", feedId, "reactionsByUser", uid);
  const existing = await getDoc(refDoc);
  if (existing.exists()) return;

  await setDoc(refDoc, { type, createdAt: serverTimestamp() });

  await updateDoc(doc(db, "feed", feedId), {
    [`reactions.${type}`]: increment(1),
  });
}

/* DELETE */
export async function deleteFeedPost(post: FeedPost) {
  const postRef = doc(db, "feed", post.id);

  const comments = await getDocs(collection(db, "feed", post.id, "comments"));
  await Promise.all(comments.docs.map((d) => deleteDoc(d.ref)));

  const reactions = await getDocs(
    collection(db, "feed", post.id, "reactionsByUser")
  );
  await Promise.all(reactions.docs.map((d) => deleteDoc(d.ref)));

  if (post.image) {
    try {
      await deleteObject(ref(storage, post.image));
    } catch {}
  }

  await deleteDoc(postRef);
}
