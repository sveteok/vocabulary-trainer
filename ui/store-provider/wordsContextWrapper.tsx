"use client";

import { useEffect, useContext } from "react";
import { usePathname, useParams, useRouter } from "next/navigation";

import { DictionaryContext } from "@/store/dict-context";
import { getLocalStorageSelectedWords } from "@/hooks/getLocalStorageSelectedWords";
import { WordPairsProp } from "@/lib/definitions";

type WordsContextWrapperProps = {
  wordPairs: WordPairsProp[];
  children: React.ReactNode;
};

export default function WordsContextWrapper({
  wordPairs,
  children,
}: WordsContextWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{
    lang_from: string;
    lang_to: string;
    cat_id: string;
  }>();

  const language = params.lang_from;
  const translation_language = params.lang_to;
  const category = params.cat_id;

  const pageType = pathname
    .replace(`/${language}/${translation_language}/${category}`, "")
    .replace("/", "");

  const dictContext = useContext(DictionaryContext);
  const { updateWordPairs } = dictContext;

  useEffect(() => {
    const { updatedWordPairs, selectedWordList } = getLocalStorageSelectedWords(
      wordPairs,
      pageType
    );

    if (selectedWordList.length === 0 && pageType !== "") {
      router.push(`/${language}/${translation_language}/${category}/`);
    }

    updateWordPairs(updatedWordPairs);
  }, [
    category,
    language,
    pageType,
    router,
    translation_language,
    updateWordPairs,
    wordPairs,
  ]);

  return <>{children}</>;
}
