"use client";

import React from "react";
import { createContext, useReducer } from "react";

import {
  LanguagesProps,
  CategoryProps,
  WordPairsProp,
  LocalizationProps,
  AllLocalizationCodeProps,
  KeyValueObjectType,
} from "@/lib/definitions";

export interface FormType {
  languages: LanguagesProps[];
  localizedLanguages?: LanguagesProps[];
  categories: CategoryProps[];
  localizedCategories?: CategoryProps[];
  localization: LocalizationProps;
  allLocalization: AllLocalizationCodeProps;
  language?: string;
  translation_language?: string;
  category?: string;
  language_name?: string;
  translation_language_name?: string;
  category_name?: string;
  wordPairs?: WordPairsProp[];
}

interface CurrentDictionaryContextType {
  form: FormType;
  updateDataById: (field_name: string, id: string, name?: string) => void;
  updateDataByName: (field_name: string, name: string) => void;
  updateWordPairs: (wordPairs: WordPairsProp[]) => void;
  updateWordSelectedState: (id: string, checked: boolean) => void;
  feedLocalizedCategories: (categories: CategoryProps[]) => void;
  feedLocalizedLanguages: (languages: LanguagesProps[]) => void;
}

enum DictActionTypes {
  UPDATE_DATA_BY_ID,
  UPDATE_DATA_BY_NAME,
  UPDATE_WORD_PAIRS,
  UPDATE_WORD_SELECT_STATE,
  FEED_LOCALIZED_CATEGORIES,
  FEED_LOCALIZED_LANGUAGES,
}

export const MAX_NUMBER_WORDS_TO_STUDY = 20;
export const MIN_NUMBER_WORDS_TO_STUDY = 0;

type ActionType =
  | {
      type: DictActionTypes.UPDATE_DATA_BY_ID;
      payload: {
        field_name: string;
        id: string;
        name?: string;
      };
    }
  | {
      type: DictActionTypes.UPDATE_WORD_PAIRS;
      payload: {
        wordPairs: WordPairsProp[];
      };
    }
  | {
      type: DictActionTypes.UPDATE_DATA_BY_NAME;
      payload: {
        field_name: string;
        name: string;
      };
    }
  | {
      type: DictActionTypes.UPDATE_WORD_SELECT_STATE;
      payload: {
        id: string;
        checked: boolean;
      };
    }
  | {
      type: DictActionTypes.FEED_LOCALIZED_CATEGORIES;
      payload: {
        categories: CategoryProps[];
      };
    }
  | {
      type: DictActionTypes.FEED_LOCALIZED_LANGUAGES;
      payload: {
        languages: LanguagesProps[];
      };
    };

const initData = {
  languages: [],
  categories: [],
  localization: {},
  allLocalization: {},
};

const initFormData = {
  form: initData,
  updateDataById: (field_name: string, id: string, name?: string) => {},
  updateDataByName: (field_name: string, name: string) => {},
  updateWordPairs: (wordPairs: WordPairsProp[]) => {},
  updateWordSelectedState: (id: string, checked: boolean) => {},
  feedLocalizedCategories: (categories: CategoryProps[]) => {},
  feedLocalizedLanguages: (languages: LanguagesProps[]) => {},
};

export const DictionaryContext =
  createContext<CurrentDictionaryContextType>(initFormData);

function formReducer(state: FormType, action: ActionType): FormType {
  const { type, payload } = action;

  if (type === DictActionTypes.UPDATE_DATA_BY_ID) {
    let name = payload.name;
    const items =
      payload.field_name === "category" ? state.categories : state.languages;
    if (!name) {
      name = items?.find(
        (el) => el.id.toLowerCase() === payload.id.toLowerCase()
      )?.name;
    }

    if (!name) return state;

    if (payload.field_name === "language") {
      const localization = state.allLocalization[
        payload.id
      ] as LocalizationProps;

      const localizedLanguages = getLocalizedLanguages({
        languages: state.languages,
        language: payload.id,
        localization: localization,
      });

      return {
        ...state,
        localization: localization,
        language: payload.id,
        language_name: name,
        localizedLanguages: localizedLanguages,
      };
    } else if (payload.field_name === "translation_language") {
      return {
        ...state,
        translation_language: payload.id,
        translation_language_name:
          state.localization?.[`${payload.id}`] || name,
      };
    } else if (payload.field_name === "category") {
      return {
        ...state,
        category: payload.id,
        category_name:
          (state.language &&
            state.translation_language &&
            state.localizedCategories?.find(
              (el) =>
                el.id === payload.id && el.language_code === state.language
            )?.name) ||
          name,
      };
    }

    return {
      ...state,
      [payload.field_name]: payload.id,
      [`${payload.field_name}_name`]: name,
    };
  } else if (type === DictActionTypes.UPDATE_DATA_BY_NAME) {
    let item = state.languages?.find(
      (el) =>
        payload.name && el.name.toLowerCase() === payload.name.toLowerCase()
    );
    if (item) {
      return {
        ...state,
        [payload.field_name]: item.id,
        [`${payload.field_name}_name`]: item.name,
      };
    }
    return state;
  } else if (type === DictActionTypes.UPDATE_WORD_PAIRS) {
    return {
      ...state,
      wordPairs: payload.wordPairs,
    };
  } else if (type === DictActionTypes.UPDATE_WORD_SELECT_STATE) {
    return {
      ...state,
      wordPairs: (state.wordPairs || []).map((w) => {
        if (w.id === payload.id) {
          return { ...w, selected: payload.checked };
        }
        return w;
      }),
    };
  } else if (type === DictActionTypes.FEED_LOCALIZED_CATEGORIES) {
    let category_name = state.category_name;
    if (payload.categories && state.category) {
      category_name =
        payload.categories.find((el) => el.id === state.category)?.name ||
        state.category_name;
    }
    return {
      ...state,
      localizedCategories: payload.categories,
      category_name: category_name,
    };
  } else if (type === DictActionTypes.FEED_LOCALIZED_LANGUAGES) {
    return {
      ...state,
      localizedLanguages: payload.languages,
    };
  }

  return state;
}

const initDictData = ({
  languages,
  categories,
  allLocalization,
}: {
  languages: LanguagesProps[];
  categories: CategoryProps[];
  allLocalization: AllLocalizationCodeProps;
}): FormType => {
  const lang = languages[0].id;
  return {
    ...initData,
    language: lang,
    language_name: languages.find((el) => el.id === lang)?.name,
    languages,
    categories,
    allLocalization: allLocalization,
    localization: allLocalization[lang] as LocalizationProps,
  };
};

export default function DictionaryContextProvider({
  children,
  languages,
  categories,
  localization,
}: {
  children: React.ReactNode;
  languages: LanguagesProps[];
  categories: CategoryProps[];
  localization: AllLocalizationCodeProps;
}) {
  const [form, formDispatch] = useReducer(
    formReducer,
    initDictData({ languages, categories, allLocalization: localization })
  );

  const updateDataById = (field_name: string, id: string, name?: string) => {
    formDispatch({
      type: DictActionTypes.UPDATE_DATA_BY_ID,
      payload: {
        field_name,
        id,
        name,
      },
    });
  };

  const updateDataByName = (field_name: string, name: string) => {
    formDispatch({
      type: DictActionTypes.UPDATE_DATA_BY_NAME,
      payload: {
        field_name,
        name,
      },
    });
  };

  const updateWordPairs = (wordPairs: WordPairsProp[]) => {
    formDispatch({
      type: DictActionTypes.UPDATE_WORD_PAIRS,
      payload: {
        wordPairs,
      },
    });
  };

  const updateWordSelectedState = (id: string, checked: boolean) => {
    formDispatch({
      type: DictActionTypes.UPDATE_WORD_SELECT_STATE,
      payload: {
        id,
        checked,
      },
    });
  };

  const feedLocalizedCategories = (categories: CategoryProps[]) => {
    formDispatch({
      type: DictActionTypes.FEED_LOCALIZED_CATEGORIES,
      payload: { categories },
    });
  };

  const feedLocalizedLanguages = (languages: LanguagesProps[]) => {
    formDispatch({
      type: DictActionTypes.FEED_LOCALIZED_LANGUAGES,
      payload: { languages },
    });
  };

  const ctxValue = {
    form,
    updateDataById,
    updateDataByName,
    updateWordPairs,
    updateWordSelectedState,
    feedLocalizedCategories,
    feedLocalizedLanguages,
  };

  return (
    <DictionaryContext.Provider value={ctxValue}>
      {children}
    </DictionaryContext.Provider>
  );
}

export const getLocalizedLanguages = ({
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
