export default function Tag({ label }: { label: string }) {
  return (
    <span className="px-3 py-1 text-xs rounded-full bg-neutral-800 text-gray-400">
      #{label}
    </span>
  );
}
