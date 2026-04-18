import Link from "next/link";
import type { Surah } from "@/data/surahs";

type SurahCardProps = {
    surah: Surah;
};

export default function SurahCard({ surah }: SurahCardProps) {
    return (
        <Link
            href={`/surah/${surah.id}`}
            className="group rounded-3xl border border-border bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
        >
            <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <span className="text-lg font-bold">{surah.id}</span>
                </div>

                <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
                    {surah.type}
                </span>
            </div>

            <h2 className="mb-2 text-2xl font-bold text-foreground">
                {surah.name}
            </h2>

            <p className="mb-6 text-sm text-muted-foreground">
                عدد الآيات: {surah.verses}
            </p>

            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary transition group-hover:opacity-80">
                    قراءة السورة
                </span>

                <span className="text-xl text-muted-foreground transition group-hover:text-primary">
                    ←
                </span>
            </div>
        </Link>
    );
}