"use client";

import React from "react";
import { createContext, useReducer } from "react";

import {
  LanguagesProps,
  CategoryProps,
  WordPairsProp,
  LocalizationProps,
  AllLocalizationCodeProps,
} from "@/lib/definitions";

interface FormType {
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

    let localization = state.localization;
    if (payload.field_name === "language") {
      localization = state.allLocalization[payload.id] as LocalizationProps;
    }

    return {
      ...state,
      localization: localization,
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
