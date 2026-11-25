import type { Metadata, Viewport } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { SITE_URL } from "@/lib/site";
import { IBM_Plex_Sans_Arabic } from "next/font/google";

const amiriQuran = localFont({
  src: "../../public/fonts/AmiriQuran-Regular.ttf",
  variable: "--font-amiri-quran",
  display: "swap",
});

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
});

// Applies the saved/system theme before first paint to avoid a light flash.
const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");if(!t){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}if(t==="dark"||t==="sepia")document.documentElement.classList.add(t)}catch(e){}})();`;

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import MobileNav from "@/components/layout/mobile-nav";
import { ThemeProvider } from "@/context/theme-context";
import { ReadingProvider } from "@/context/reading-context";
import { AudioProvider } from "@/context/audio-context";
import { LanguageProvider } from "@/context/language-context";
import { PrayerProvider } from "@/context/prayer-context";
import AdhanAlert from "@/components/prayer/adhan-alert";

export const viewport: Viewport = {
  // Lets the mobile tab bar respect the iPhone home-indicator safe area
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "القرآن الكريم",
  description: "تجربة حديثة لقراءة القرآن الكريم",
  openGraph: {
    siteName: "القرآن الكريم",
    locale: "ar_AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${amiriQuran.variable} ${plexArabic.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            <AudioProvider>
              <PrayerProvider>
                <ReadingProvider>
                  {/* pb on mobile keeps content clear of the bottom tab bar */}
                  <div className="flex min-h-screen flex-col pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
                    <Navbar />
                    <main className="flex-1">{children}</main>
                    <Footer />
                  </div>
                  <MobileNav />
                  <AdhanAlert />
                </ReadingProvider>
              </PrayerProvider>
            </AudioProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}