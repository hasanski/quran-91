export default function Loading() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-10 rounded-[32px] border border-border bg-card/50 p-8 backdrop-blur-sm animate-pulse">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-3">
              <div className="h-7 w-28 rounded-full bg-muted" />
              <div className="h-10 w-48 rounded-lg bg-muted" />
            </div>
            <div className="flex gap-3">
              <div className="h-9 w-20 rounded-full bg-muted" />
              <div className="h-9 w-20 rounded-full bg-muted" />
            </div>
          </div>
          <div className="h-6 w-3/4 rounded-lg bg-muted mt-6" />
        </div>

        <div className="mb-8 flex h-14 w-full rounded-[20px] bg-card/50 border border-border animate-pulse" />

        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-[28px] border border-border bg-card p-6 shadow-sm animate-pulse">
              <div className="mb-4 flex items-center justify-between">
                <div className="h-10 w-10 rounded-2xl bg-muted" />
                <div className="flex gap-2">
                  <div className="h-8 w-12 rounded-xl bg-muted" />
                  <div className="h-8 w-16 rounded-xl bg-muted" />
                </div>
              </div>
              <div className="h-10 w-3/4 rounded-lg bg-muted mb-4 ml-auto" />
              <div className="h-6 w-2/3 rounded-lg bg-muted mt-4" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
