import Navbar from "@/components/Navbar";
import Link from "next/link";
import { getPracticeLabs } from "@/lib/practice";

export const metadata = {
  title: "Practice Coding | EduCypher",
  description: "Practice coding problems by topic and difficulty.",
};

export default async function PracticePage() {
  const labs = await getPracticeLabs();

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-neutral-950 text-white px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">Practice</h1>

          <div className="space-y-4">
            {labs.map((lab) => (
              <Link
                key={lab.id}
                href={`/practice/${lab.id}`}
                className="block rounded-lg border border-neutral-800 bg-neutral-900 p-4 hover:border-emerald-500 transition"
              >
                <h2 className="text-lg font-medium">{lab.title}</h2>
                <p className="text-sm text-gray-400">
                  {lab.difficulty} • {lab.topic}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
