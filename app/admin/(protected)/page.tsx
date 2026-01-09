export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">

      {/* HEADER */}
      <section>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">
          Manage platform content, users, and activity
        </p>
      </section>

      {/* STATS (PLACEHOLDERS FOR NOW) */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Lessons"
          value="—"
          desc="Total lessons created"
        />
        <StatCard
          title="Communities"
          value="—"
          desc="Active communities"
        />
        <StatCard
          title="Users"
          value="—"
          desc="Registered users"
        />
      </section>

      {/* QUICK ACTIONS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ActionCard
          title="Manage Learn"
          desc="Create & edit lessons"
          href="/admin/learn"
        />
        <ActionCard
          title="Communities"
          desc="Create & moderate groups"
          href="/admin/communities"
        />
        <ActionCard
          title="Feed Moderation"
          desc="Control posts & reports"
          href="/admin/feed"
        />
      </section>

    </div>
  );
}

/* ---------------- UI COMPONENTS ---------------- */

function StatCard({
  title,
  value,
  desc,
}: {
  title: string;
  value: string;
  desc: string;
}) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
      <div className="text-sm text-gray-400">{title}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{desc}</div>
    </div>
  );
}

function ActionCard({
  title,
  desc,
  href,
}: {
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="block bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:bg-neutral-800 transition"
    >
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-400 mt-2">{desc}</p>
    </a>
  );
}
