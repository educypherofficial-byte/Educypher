import Navbar from "@/components/Navbar";
import { getPracticeLab } from "@/lib/practice";

export default async function PracticeDetail({
  params,
}: {
  params: { labId: string };
}) {
  const lab = await getPracticeLab(params.labId);
  if (!lab) return null;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-neutral-950 text-white px-6 py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">{lab.title}</h1>

          <p className="text-gray-400">
            Difficulty: {lab.difficulty}
          </p>

          <p className="text-gray-300">{lab.problem}</p>

          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
            <h3 className="font-semibold mb-2">Expected Output</h3>
            <pre className="text-sm text-gray-300">
              {lab.output}
            </pre>
          </div>
        </div>
      </main>
    </>
  );
}
