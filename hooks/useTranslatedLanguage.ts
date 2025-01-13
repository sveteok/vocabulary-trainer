import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";

import { DictionaryContext, FormType } from "@/store/dict-context";

interface TranslatedLanguageDataProp {
  form: FormType;
  onNextPageHandler: () => void;
  updateDataById: (field_name: string, id: string, name?: string) => void;
}

export function useTranslatedLanguage(): TranslatedLanguageDataProp {
  const router = useRouter();

  const dictContext = useContext(DictionaryContext);
  const { form, updateDataById } = dictContext;

  return {
    form: form,
    updateDataById,
    onNextPageHandler: () => {
      if (form.language)
        router.push(`/${form.language}/${form.translation_language}`);
    },
  };
}
