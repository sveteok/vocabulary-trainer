"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";

import { GetInitDataProps } from "@/lib/data";
import { NotFoundDisplay } from "@/ui/basis/notFoundDisplay";
import SiteNavigation from "@/ui/basis/siteNavigation";
import DictionaryContextProvider from "@/store/dict-context";
import {
  AllLocalizationCodeProps,
  CategoryProps,
  LanguagesProps,
} from "@/lib/definitions";

export const MainWrapper = ({
  languages,
  categories,
  localization,
  children,
}: {
  children: React.ReactNode;
  languages: LanguagesProps[];
  categories: CategoryProps[];
  localization: AllLocalizationCodeProps;
}) => {
  const [data, setData] = useState<null | GetInitDataProps>(null);

  const pathname = usePathname();
  const params = useParams<{
    lang_from: string;
    lang_to: string;
    cat_id: string;
  }>();

  if (pathname.length > 1 && Object.keys(params).length === 0) {
    return <NotFoundDisplay />;
  }

  const language = params.lang_from;
  const translation_language = params.lang_to;
  const category = params.cat_id;
  let gameType = "";

  if (language && translation_language && category) {
    const re = new RegExp(
      String.raw`/${language}/${translation_language}/${category}/?`,
      "g"
    );
    gameType = pathname.replace(re, "");
  }

  useEffect(() => {
    if (!languages || !categories || !localization) return;
    setData({ languages, categories, localization });
  }, [languages, categories, localization]);

  if (data === null) {
    return <></>;
  }

  const { isValid } = validatePath({
    languages: data.languages,
    categories: data.categories,
    language,
    translation_language,
    category,
    gameType,
  });

  console.log("Result isValid:   ", isValid);

  if (!isValid) {
    return <NotFoundDisplay />;
  }

  return (
    <DictionaryContextProvider
      categories={data.categories}
      languages={data.languages}
      localization={data.localization}
      language={language}
      translation_language={translation_language}
      category={category}
    >
      <SiteNavigation />
      {children}
    </DictionaryContextProvider>
  );
};

const validatePath = (props: {
  languages: LanguagesProps[];
  categories: CategoryProps[];
  language?: string;
  translation_language?: string;
  category?: string;
  gameType?: string;
}): { isValid: boolean } => {
  const {
    languages,
    categories,
    language,
    translation_language,
    category,
    gameType,
  } = props;

  if (language) {
    const language_name = languages.find((el) => el.id === language)?.name;
    if (language && !language_name) {
      console.log(1);
      return { isValid: false };
    }
  }

  if (language && translation_language) {
    if (language === translation_language) {
      console.log(2);
      return { isValid: false };
    }

    const translation_language_name = languages.find(
      (el) => el.id === translation_language
    )?.name;

    if (!translation_language_name) {
      console.log(3);
      return { isValid: false };
    }
  }

  if (language && translation_language && category) {
    const category_name = categories.find((el) => el.id === category)?.name;
    if (!category_name) {
      console.log(4);
      return { isValid: false };
    }
  }

  if (
    language &&
    translation_language &&
    category &&
    gameType &&
    !["cards", "match", "quize", "test", "write", "menu"].includes(gameType)
  ) {
    console.log(5);
    return { isValid: false };
  }

  return { isValid: true };
};
