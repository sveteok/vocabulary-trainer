import { Metadata } from "next";

import { WordPairsQueryProp } from "@/lib/definitions";
import { getCachedCardSets } from "@/lib/data";
import WordsContextWrapper from "@/ui/store-provider/wordsContextWrapper";

export const metadata: Metadata = {
  title: "Card List",
};

interface GameLayoutProps {
  params: { cat_id: string; lang_from: string; lang_to: string };
  children: React.ReactNode;
}

export default async function WordsPairWrapper({
  params,
  children,
}: GameLayoutProps) {
  const { cat_id, lang_from, lang_to } = params;

  if (!cat_id || !lang_from || !lang_to) {
    return "Failed to fetch data!!!.";
  }

  const language = lang_from;
  const translation_language = lang_to;

  const query = {
    language: language,
    translation_language: translation_language,
    category_id: cat_id,
  } as WordPairsQueryProp;

  const wordPairs = await getCachedCardSets(query);
  return (
    <WordsContextWrapper wordPairs={wordPairs}>{children}</WordsContextWrapper>
  );
}
