"use client";

import Link from "next/link";
import { useLanguage } from "@/context/language-context";

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="border-t border-border bg-card">
            <div className="mx-auto max-w-7xl px-6 py-12">
                <div className="grid gap-10 md:grid-cols-3">
                    <div>
                        <h3 className="mb-4 text-2xl font-extrabold bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent">
                            القرآن الكريم
                        </h3>
                        <p className="text-muted-foreground leading-8">
                            {t("footerDesc")}
                        </p>
                    </div>

                    <div>
                        <h4 className="mb-4 text-lg font-semibold text-foreground">
                            {t("links")}
                        </h4>

                        <div className="flex flex-col gap-3">
                            <Link href="/" className="text-muted-foreground hover:text-foreground transition">
                                {t("home")}
                            </Link>

                            <Link href="/surahs" className="text-muted-foreground hover:text-foreground transition">
                                {t("surahs")}
                            </Link>

                            <Link href="/search" className="text-muted-foreground hover:text-foreground transition">
                                {t("search")}
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-4 text-lg font-semibold text-foreground">
                            {t("ourGoal")}
                        </h4>

                        <p className="text-muted-foreground leading-8">
                            {t("goalDesc")}
                        </p>
                    </div>
                </div>

                <div className="mt-10 border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground" dir="ltr">
                    <div>Developed By MirzaTech</div>
                    <div>Copyright © {new Date().getFullYear()}. All rights reserved.</div>
                </div>
            </div>
        </footer>
    );
}