"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AdminContextType {
  admin: { uid: string } | null;
  loading: boolean;
}

const AdminAuthContext = createContext<AdminContextType>({
  admin: null,
  loading: true,
});

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<{ uid: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setAdmin({ uid: user.uid });
      } else {
        setAdmin(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <AdminAuthContext.Provider value={{ admin, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
