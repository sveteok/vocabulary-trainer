export interface LanguagesProps {
  id: string;
  name: string;
}

export interface CategoryProps {
  id: string;
  name: string;
  language_code: string;
}

export interface CategoryTranslationProps {
  id?: string | number;
  category_id: string;
  language_code: string;
  translated_name: string;
}

export interface WordProps {
  id: string;
  category_id: string;
  language_code: string;
  translated_name: string;
  description: string;
}

export interface WordPairsProps {
  id: string;
  word_id: string;
  translated_word_id: string;
}

export interface LocalizationProps {
  [key: string]: string | undefined;
}

export interface AllLocalizationCodeProps {
  [language_code: string]: LocalizationProps | undefined;
}

export interface KeyValueObjectType {
  id: string;
  name: string;
}

export type WordPairsQueryProp = {
  language: string;
  translation_language: string;
  category_id: string;
};

export type WordPairsProp = {
  id: string;
  word_id: string;
  word_name: string;
  word_desc?: string;
  translated_word_id: string;
  translated_word_name: string;
  translated_word_desc?: string;
  learned?: boolean;
  selected?: boolean;
};

export type WordProp = {
  id: string;
  name: string;
  description?: string;
};

export interface QuizeCardProp {
  word: WordPairsProp;
  answers: KeyValueObjectType[];
  selectedWordId?: string;
}

export type wordTranslation = {
  id: string;
  word_id: string;
  translated_word_id: string;
  category_id: string;
};

export type wordTranslationsTable = wordTranslation[];

export type wordItem = {
  id: string;
  category_id: string;
  language_code: string;
  translated_name: string;
  description: string;
};

export type wordTable = wordItem[];

export type wordPairsType = {
  word: {
    language_code: string;
    translated_name: string;
    description: string;
    example?: string;
  };
  translated_word: {
    language_code: string;
    translated_name: string;
    description: string;
    example?: string;
  };
};
