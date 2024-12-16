import { useEffect, useState } from "react";
import { usePathname, useParams, useRouter } from "next/navigation";

import { useContext } from "react";
import { DictionaryContext } from "@/store/dict-context";

import { getCachedCategories } from "@/lib/data";
import { LocalizationProps } from "@/lib/definitions";

export function useSiteNavigation(): {
  language?: string;
  language_name?: string;
  translation_language?: string;
  translation_language_name?: string;
  category?: string;
  category_name?: string;
  gameType: string;
  localization: LocalizationProps;
} {
  const dictContext = useContext(DictionaryContext);
  const { form, updateDataById, feedLocalizedCategories } = dictContext;

  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{
    lang_from: string;
    lang_to: string;
    cat_id: string;
  }>();

  let language = params.lang_from;
  let translation_language = params.lang_to;
  let category = params.cat_id?.toString();
  let gameType = pathname.replace(
    `/${language}/${translation_language}/${category}/`,
    ""
  );

  const [categoryName, setCategoryName] = useState<string | undefined>(
    form.category_name
  );

  const updateCategoryData = async (language: string) => {
    console.log("2!. fetchAllCategories ... ");
    const localizedCategories = await getCachedCategories(language);

    feedLocalizedCategories(localizedCategories);
  };

  useEffect(() => {
    if (language && language === translation_language) {
      router.push(`/${language}`);
    }

    if (language && (language !== form.language || !form.language_name)) {
      updateDataById("language", language);
      updateCategoryData(language);
    }

    if (
      translation_language &&
      (translation_language !== form.translation_language ||
        !form.translation_language_name)
    ) {
      updateDataById("translation_language", translation_language);
    }

    if (category && (category !== form.category || !form.category_name)) {
      updateDataById("category", category);
    }

    if (form.language === language && !form.localizedCategories) {
      updateCategoryData(language);
    }
  }, []);

  useEffect(() => {
    let category_id = category || form.category;

    let category_name = form.category_name;
    if (form.localizedCategories && form.category) {
      category_name =
        form.localizedCategories.find((el) => el.id === category_id)?.name ||
        form.category_name;
    }

    if (category_name) {
      updateDataById("category_name", category_name);
      setCategoryName(category_name);
    }
  }, [form.category_name]);

  if (
    !["cards", "match", "quize", "test", "write", "menu"].includes(gameType)
  ) {
    gameType = "";
  }

  return {
    language: language,
    language_name: form.language_name || form.languages[0].id,
    translation_language: translation_language,
    translation_language_name: form.translation_language_name,
    category: category,
    category_name: categoryName,
    localization: form.localization,
    gameType,
  };
}
