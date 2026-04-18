"use client";

type ReadingToolbarProps = {
    onIncreaseFont: () => void;
    onDecreaseFont: () => void;
};

export default function ReadingToolbar({
    onIncreaseFont,
    onDecreaseFont,
}: ReadingToolbarProps) {
    async function handleShare() {
        try {
            await navigator.clipboard.writeText(window.location.href);
            alert("تم نسخ رابط الصفحة");
        } catch (error) {
            console.error("Share failed:", error);
        }
    }

    return (
        <div className="sticky top-24 z-40 mb-8 rounded-[24px] border border-primary/10 bg-card/90 p-4 shadow-sm backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-foreground">
                        أدوات القراءة
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        تحكم في طريقة عرض السورة بسهولة
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={onIncreaseFont}
                        className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/20"
                    >
                        A+
                    </button>

                    <button
                        onClick={onDecreaseFont}
                        className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/20"
                    >
                        A-
                    </button>

                    <button
                        onClick={handleShare}
                        className="rounded-2xl border border-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                    >
                        مشاركة
                    </button>
                </div>
            </div>
        </div>
    );
}