import { useEffect, useState } from "react";
import { usePathname, useParams, useRouter } from "next/navigation";

import { useContext } from "react";
import { DictionaryContext, FormType } from "@/store/dict-context";

import { getCachedCategories } from "@/lib/data";
import { LocalizationProps } from "@/lib/definitions";

interface siteNavigationPromiseType {
  language?: string;
  language_name?: string;
  translation_language?: string;
  translation_language_name?: string;
  category?: string;
  category_name?: string;
  gameType: string;
  localization: LocalizationProps;
}

export function useSiteNavigation(): {
  form: FormType;
  language?: string;
  translation_language?: string;
  category?: string;
} {
  const dictContext = useContext(DictionaryContext);
  const { form, updateDataById } = dictContext;

  const params = useParams<{
    lang_from: string;
    lang_to: string;
    cat_id: string;
  }>();

  const language = params.lang_from;
  const translation_language = params.lang_to;
  const category = params.cat_id;

  useEffect(() => {
    if (
      language &&
      (!form.language || !form.language_name || language !== form.language)
    ) {
      updateDataById("language", language);
    }

    if (
      translation_language &&
      (!form.translation_language ||
        !form.translation_language_name ||
        translation_language !== form.translation_language)
    ) {
      updateDataById("translation_language", translation_language);
    }

    if (
      category &&
      (!form.category || !form.category_name || category !== form.category)
    ) {
      updateDataById("category", category);
    }
  }, [
    language,
    translation_language,
    category,
    form.categories,
    form.language,
    form.translation_language,
    form.localization,
    form.category,
  ]);

  return { form, language, translation_language, category };
}
