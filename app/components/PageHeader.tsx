export default function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="space-y-4">
      <h1 className="text-4xl font-extrabold tracking-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="text-gray-400 text-lg">
          {subtitle}
        </p>
      )}
    </header>
  );
}
