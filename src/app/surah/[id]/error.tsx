"use client";

import { useEffect } from "react";
import { useLanguage } from "@/context/language-context";

export default function SurahError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { locale } = useLanguage();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-background px-6 py-20 text-foreground">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mb-4 text-4xl font-bold text-destructive">
          {locale === "ar" ? "حدث خطأ" : "Ошибка"}
        </h1>
        <p className="text-muted-foreground mb-8">
          {locale === "ar"
            ? "حدث خطأ أثناء تحميل السورة. يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً."
            : "Произошла ошибка при загрузке суры. Пожалуйста, проверьте интернет-соединение и попробуйте снова."}
        </p>
        <button
          onClick={reset}
          className="rounded-2xl bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90 transition cursor-pointer"
        >
          {locale === "ar" ? "إعادة المحاولة" : "Повторить попытку"}
        </button>
      </div>
    </main>
  );
}
