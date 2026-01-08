import Link from "next/link";

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-[#020617] border-r border-gray-800 p-4">
      <h2 className="font-bold text-lg mb-6">EduCypher Admin</h2>

      <nav className="space-y-3">
        <Link href="/admin/dashboard">Dashboard</Link>
        <Link href="/admin/learn">Learn</Link>
        <Link href="/admin/communities">Communities</Link>
      </nav>
    </aside>
  );
}
