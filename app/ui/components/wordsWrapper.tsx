import { getWordPairs, getCachedCardSets } from "@/app/lib/data";
import { Metadata } from "next";
import { WordPairsQueryProp, WordPairsProp } from "@/app/lib/definitions";
import { cache } from "react";

import WordsContextWrapper from "@/app/ui/store-provider/wordsContextWrapper";

export const metadata: Metadata = {
  title: "Card List",
};

async function getCardSets(
  query: WordPairsQueryProp
): Promise<WordPairsProp[]> {
  console.log("1. getWordPairs ... ");
  let res = await getWordPairs(query);

  // await new Promise((resolve) => setTimeout(resolve, 2000));
  return res; //.json();
}

// const getCachedCardSets = cache(getCardSets);

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
