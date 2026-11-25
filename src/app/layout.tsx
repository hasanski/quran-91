import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
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
import { ThemeProvider } from "@/context/theme-context";
import { ReadingProvider } from "@/context/reading-context";
import { AudioProvider } from "@/context/audio-context";
import { LanguageProvider } from "@/context/language-context";

export const metadata: Metadata = {
  title: "القرآن الكريم",
  description: "تجربة حديثة لقراءة القرآن الكريم",
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
              <ReadingProvider>
                <div className="flex min-h-screen flex-col">
                  <Navbar />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
              </ReadingProvider>
            </AudioProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}