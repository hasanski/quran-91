"use client";

import Link from "next/link";
import { useReading } from "@/context/reading-context";

export default function ResumeReading() {
  const { lastPosition } = useReading();

  if (!lastPosition) return null;

  const timeAgo = getTimeAgo(lastPosition.timestamp);

  return (
    <section className="mx-auto max-w-7xl px-6 pb-8">
      <div className="overflow-hidden rounded-[32px] border border-border bg-gradient-to-br from-primary/10 to-emerald-500/10 p-6 shadow-sm backdrop-blur-sm md:p-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl">
              📖
            </div>

            <div>
              <p className="mb-1 text-sm font-medium text-muted-foreground">
                استكمل القراءة
              </p>

              <h2 className="text-xl font-bold text-foreground md:text-2xl">
                سورة {lastPosition.surahName} - الآية {lastPosition.verseNumber}
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                آخر قراءة: {timeAgo}
              </p>
            </div>
          </div>

          <Link
            href={`/surah/${lastPosition.surahId}#verse-${lastPosition.verseNumber}`}
            className="group flex shrink-0 items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <span>متابعة القراءة</span>

            <svg
              className="h-5 w-5 transition-transform group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);

  if (diffInSeconds < 60) {
    return "منذ لحظات";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `منذ ${diffInMinutes} ${diffInMinutes === 1 ? "دقيقة" : "دقائق"}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `منذ ${diffInHours} ${diffInHours === 1 ? "ساعة" : "ساعات"}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `منذ ${diffInDays} ${diffInDays === 1 ? "يوم" : "أيام"}`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  return `منذ ${diffInWeeks} ${diffInWeeks === 1 ? "أسبوع" : "أسابيع"}`;
}
