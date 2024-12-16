import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";

import { DictionaryContext } from "@/store/dict-context";

import {
  KeyValueObjectType,
  LanguagesProps,
  LocalizationProps,
} from "@/lib/definitions";

interface TranslatedLanguageDataProp {
  localization: LocalizationProps;
  localizedLanguages: LanguagesProps[];
  lang_to: string;
  onNextPageHandler: () => void;
  updateDataById: (field_name: string, id: string, name?: string) => void;
}

export function useTranslatedLanguage(): TranslatedLanguageDataProp {
  const router = useRouter();

  const dictContext = useContext(DictionaryContext);
  const { form, updateDataById } = dictContext;

  const localizedLanguages = getLocalizedLanguages({
    languages: form.languages,
    language: form.language || form.languages[0].id,
    localization: form.localization,
  });

  const value = form.translation_language || localizedLanguages?.[0].id || "fi";

  useEffect(() => {
    if (!form.translation_language)
      updateDataById("translation_language", value);
  }, [updateDataById, value]);

  return {
    localization: form.localization,
    localizedLanguages,
    lang_to: value,
    updateDataById,
    onNextPageHandler: () => {
      if (form.language)
        router.push(`/${form.language}/${form.translation_language}`);
    },
  };
}

const getLocalizedLanguages = ({
  languages,
  language,
  localization,
}: {
  languages: LanguagesProps[];
  language: string;
  localization: LocalizationProps;
}): LanguagesProps[] => {
  let localizedLanguages: KeyValueObjectType[] = [];
  languages.map((el) => {
    if (!language || el.id === language) return;

    const lang = localization?.[`${el.id}`];
    if (lang) {
      localizedLanguages.push({ id: el.id, name: lang });
    } else {
      localizedLanguages.push(el);
    }
  });

  localizedLanguages = localizedLanguages.sort(function (a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });

  return localizedLanguages;
};
