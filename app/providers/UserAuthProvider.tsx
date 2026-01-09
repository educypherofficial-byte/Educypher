"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

type UserAuthContextType = {
  user: User | null;
  loading: boolean;
};

const UserAuthContext = createContext<UserAuthContextType>({
  user: null,
  loading: true,
});

export function UserAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // ✅ MUST be true

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false); // ✅ only after Firebase resolves
    });

    return () => unsub();
  }, []);

  return (
    <UserAuthContext.Provider value={{ user, loading }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export const useUserAuth = () => useContext(UserAuthContext);
