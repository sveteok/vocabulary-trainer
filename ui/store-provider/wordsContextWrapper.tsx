"use client";

import { useEffect, useContext } from "react";
import { usePathname, useParams, useRouter } from "next/navigation";

import { DictionaryContext } from "@/store/dict-context";
import { useLocalSrorageSelectedWords } from "@/hooks/useLocalSrorageSelectedWords";
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

  let language = params.lang_from;
  let translation_language = params.lang_to;
  let category = params.cat_id;

  let pageType = pathname
    .replace(`/${language}/${translation_language}/${category}`, "")
    .replace("/", "");

  const dictContext = useContext(DictionaryContext);
  const { updateWordPairs } = dictContext;

  useEffect(() => {
    const { updatedWordPairs, selectedWordList } = useLocalSrorageSelectedWords(
      wordPairs,
      pageType
    );

    if (selectedWordList.length === 0 && pageType !== "") {
      router.push(`/${language}/${translation_language}/${category}/`);
    }

    updateWordPairs(updatedWordPairs);
  }, [wordPairs]);

  return <>{children}</>;
}
