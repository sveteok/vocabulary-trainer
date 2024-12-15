import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import SiteNavigation from "@/app/ui/basis/siteNavigation";

import {
  fetchAllCategories,
  fetchAllLanguages,
  fetchLocalization,
} from "@/app/lib/data";

import DictionaryContextProvider from "@/store/dict-context";

export const metadata: Metadata = {
  title: {
    template: "%s | Home",
    default: "Dictionaries",
  },
  description: "Vocabulary trainer",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const languageData = await fetchAllLanguages();
  const localizationData = await fetchLocalization();
  const categoryData = await fetchAllCategories();

  const [languages, localization, categories] = await Promise.all([
    languageData,
    localizationData,
    categoryData,
  ]);

  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, user-scalable=0"
          id="viewportMeta"
        ></meta>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="h-svh lg:max-w-[700px] m-auto flex flex-col bg-[#dcd5cd] text-[#232a32]">
          <DictionaryContextProvider
            categories={categories}
            languages={languages}
            localization={localization}
          >
            <SiteNavigation />
            {children}
          </DictionaryContextProvider>
        </div>
      </body>
    </html>
  );
}
