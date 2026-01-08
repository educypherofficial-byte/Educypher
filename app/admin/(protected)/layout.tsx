import { AdminAuthProvider } from "../AdminAuthProvider";
import AdminGuard from "../AdminGuard";
import AdminSidebar from "../AdminSidebar";

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <AdminGuard>
        <div className="flex min-h-screen bg-[#020617] text-gray-200">
          <AdminSidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </AdminGuard>
    </AdminAuthProvider>
  );
}
