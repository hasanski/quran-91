import type { Metadata } from "next";
import PrayerTimesView from "@/components/prayer/prayer-times-view";

export const metadata: Metadata = {
  title: "مواقيت الصلاة - القرآن الكريم",
  description:
    "مواقيت الصلاة اليومية لغروزني ومحج قلعة وعمّان ومدن أخرى، مع الأذان بصوت الشيخ خليل احياد الشيشاني.",
  alternates: { canonical: "/prayer-times" },
};

export default function PrayerTimesPage() {
  return <PrayerTimesView />;
}
