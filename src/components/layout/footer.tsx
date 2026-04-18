import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-border bg-card">
            <div className="mx-auto max-w-7xl px-6 py-12">
                <div className="grid gap-10 md:grid-cols-3">
                    <div>
                        <h3 className="mb-4 text-2xl font-bold text-foreground">
                            Quran Modern
                        </h3>
                        <p className="text-muted-foreground leading-8">
                            تجربة حديثة ومريحة لقراءة القرآن الكريم بتصميم نظيف وسريع.
                        </p>
                    </div>

                    <div>
                        <h4 className="mb-4 text-lg font-semibold text-foreground">
                            روابط
                        </h4>

                        <div className="flex flex-col gap-3">
                            <Link href="/" className="text-muted-foreground hover:text-foreground transition">
                                الرئيسية
                            </Link>

                            <Link href="/surahs" className="text-muted-foreground hover:text-foreground transition">
                                السور
                            </Link>

                            <Link href="/search" className="text-muted-foreground hover:text-foreground transition">
                                البحث
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-4 text-lg font-semibold text-foreground">
                            الهدف
                        </h4>

                        <p className="text-muted-foreground leading-8">
                            تقديم تجربة قراءة هادئة ومريحة للقرآن الكريم بتصميم عصري.
                        </p>
                    </div>
                </div>

                <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
                    © 2026 Quran Modern
                </div>
            </div>
        </footer>
    );
}