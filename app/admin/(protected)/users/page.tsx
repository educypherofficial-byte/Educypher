"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    getDocs(collection(db, "users")).then(s =>
      setUsers(s.docs.map(d => ({ id: d.id, ...d.data() })))
    );
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Users</h1>

      <div className="grid gap-3">
        {users.map(u => (
          <div key={u.id} className="bg-neutral-900 p-4 rounded border border-neutral-800">
            <div>Email: {u.email || "—"}</div>
            <div>Points: {u.points ?? 0}</div>
            <div>Streak: {u.streak ?? 0}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
