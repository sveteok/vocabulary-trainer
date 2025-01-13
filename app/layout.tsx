import { Suspense } from "react";
import type { Metadata } from "next";

import "./globals.css";

import { getInitData } from "@/lib/data";
import { MainWrapper } from "@/ui/basis/mainWrapper";
import { LoadingSkeleton } from "@/ui/basis/loadingSkeleton";
import { geistMono, geistSans, nunito } from "@/ui/fonts";

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

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, interactive-widget=resizes-content"
          id="viewportMeta"
        ></meta>
      </head>
      <body
        className={`${nunito.variable} ${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <div
          className={`h-svh lg:max-w-[700px] m-auto flex flex-col bg-natural-gray-200 text-natural-gray-800 `}
        >
          <Suspense fallback={<LoadingSkeleton />}>
            <MainWrapper
              languages={languages}
              categories={categories}
              localization={localization}
            >
              {children}
            </MainWrapper>
          </Suspense>
        </div>
      </body>
    </html>
  );
}
