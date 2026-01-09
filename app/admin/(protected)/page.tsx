export default function AdminDashboardPage() {
  return (
    <div className="space-y-12">

      {/* HEADER */}
      <section className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/70 backdrop-blur p-10">
        <div className="absolute -top-20 -right-20 h-64 w-64 bg-emerald-500/10 blur-[120px]" />
        <div className="relative">
          <h1 className="text-4xl font-black tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 mt-2 max-w-xl">
            Control everything — lessons, communities, users and platform health.
          </p>
        </div>
      </section>

      {/* STATS */}
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
          desc="Create, edit & publish lessons"
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
    <div
      className="
        group relative
        rounded-2xl
        border border-neutral-800
        bg-neutral-900/70 backdrop-blur
        p-6
        transition
        hover:-translate-y-1
        hover:border-emerald-500/40
      "
    >
      {/* subtle glow */}
      <div className="absolute inset-0 rounded-2xl bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition" />

      <div className="relative space-y-2">
        <div className="text-sm text-gray-400">{title}</div>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        <div className="text-xs text-gray-500">{desc}</div>
      </div>
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
      className="
        group relative block
        rounded-2xl
        border border-neutral-800
        bg-neutral-900/70 backdrop-blur
        p-8
        transition
        hover:-translate-y-1
        hover:border-emerald-500/40
      "
    >
      {/* hover glow */}
      <div className="absolute inset-0 rounded-2xl bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition" />

      <div className="relative space-y-3">
        <h3 className="text-lg font-semibold tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed">
          {desc}
        </p>

        <div className="pt-4 text-sm text-emerald-400 group-hover:translate-x-1 transition">
          Open →
        </div>
      </div>
    </a>
  );
}
