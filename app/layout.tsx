import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { notFound } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import SiteNavigation from "@/ui/basis/siteNavigation";

import { getInitData } from "@/lib/data";

import DictionaryContextProvider from "@/store/dict-context";

export const metadata: Metadata = {
  title: {
    template: "%s | Home",
    default: "Dictionaries",
  },
  description: "Vocabulary trainer",
};

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { languages, localization, categories } = await getInitData();

  if (!languages || !localization || !categories) {
    return notFound();
  }

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
