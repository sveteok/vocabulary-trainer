"use client";

import Link from "next/link";

import { LocalizationProps } from "@/app/lib/definitions";
import { useSiteNavigation } from "@/app/hooks/useSiteNavigation";

export default function SiteNavigation() {
  const {
    language,
    language_name,
    translation_language,
    translation_language_name,
    category,
    category_name,
    gameType,
    localization,
  } = useSiteNavigation();

  return (
    <div className="flex flex-col h-[100px] p-2 gap-2 sbg-[#cddcd5] xbg-[#32302f] bg-[#87837e] xbg-[#d5cddc] text-[#ffffff]  text-sm">
      <div className="flex flex-row gap-3">
        <LanguageContent
          language={language}
          language_name={language_name}
          localization={localization}
        />
        <TranslationLanguageContent
          language={language}
          language_name={language_name}
          translation_language={translation_language}
          translation_language_name={translation_language_name}
          localization={localization}
        />
      </div>

      <CategoryContent
        category={category}
        language={language}
        translation_language={translation_language}
        category_name={category_name}
        localization={localization}
      />

      <div className="flex flex-row gap-3">
        <WordListContent
          category={category}
          language={language}
          translation_language={translation_language}
          category_name={category_name}
          gameType={gameType}
          localization={localization}
        />
        <TrainingTypeContent
          category={category}
          language={language}
          translation_language={translation_language}
          category_name={category_name}
          gameType={gameType}
          localization={localization}
        />
      </div>

      {!(language || language) && !translation_language && !category && (
        <div>
          {localization.select_application_language || "Select language"}...
        </div>
      )}
    </div>
  );
}

const TranslationLanguageContent = ({
  language,
  language_name,
  translation_language,
  translation_language_name,
  localization,
}: {
  language?: string;
  language_name?: string;
  translation_language?: string;
  translation_language_name?: string;
  localization: LocalizationProps;
}) => {
  if (!language || !language_name) return <></>;

  if (!translation_language_name)
    return (
      <div className="flex gap-2">
        <p>/</p>...
      </div>
    );

  let translationLanguageContent = <>...</>;

  if (translation_language) {
    translationLanguageContent = (
      <div className="flex gap-2">
        <p>/</p>
        <Link
          className="underline hover:underline-offset-2 hover:decoration-2"
          href={`/${language}/`}
        >
          {localization?.[`${translation_language}`] || translation_language}
        </Link>
      </div>
    );
  } else {
    translationLanguageContent = (
      <div className="opacity-30 flex gap-2">
        <p>/</p>
        {localization?.[`${translation_language_name}`] ||
          translation_language_name}
      </div>
    );
  }

  return <div>{translationLanguageContent}</div>;
};

const LanguageContent = ({
  language,
  language_name,
  localization,
}: {
  language?: string;
  language_name?: string;
  localization: LocalizationProps;
}) => {
  let languageContent = <>...</>;

  if (language && language_name) {
    languageContent = (
      <Link
        className="underline hover:underline-offset-2 hover:decoration-2"
        href={`/`}
      >
        {language_name || language}
      </Link>
    );
  } else if (!language) {
    languageContent = (
      <div className="flex gap-2">
        {localization.application_language || "Application language"}:
        <p className="opacity-30">{language_name || "..."}</p>
      </div>
    );
  }

  return <div>{languageContent}</div>;
};

const TrainingTypeContent = ({
  category,
  language,
  translation_language,
  category_name,
  gameType,
  localization,
}: {
  category?: string;
  language?: string;
  translation_language?: string;
  category_name?: string;
  gameType: string;
  localization: LocalizationProps;
}) => {
  if (!category || !language! || !translation_language || !category_name) {
    return <div></div>;
  }

  let trainingTypeContent = <></>;

  if (gameType === "menu") {
    trainingTypeContent = <>{localization.training_type || "Training type"}</>;
  } else if (gameType.length > 0) {
    trainingTypeContent = (
      <div className="flex gap-2">
        <Link
          className="underline hover:underline-offset-2 hover:decoration-2 "
          color="inherit"
          href={`/${language}/${translation_language}/${category}/menu`}
        >
          {localization.training_type || "Training type"}:
        </Link>
        <p>{localization?.[`${gameType}`] || gameType}</p>
      </div>
    );
  }

  return <div>{trainingTypeContent}</div>;
};

const WordListContent = ({
  category,
  language,
  translation_language,
  category_name,
  gameType,
  localization,
}: {
  category?: string;
  language?: string;
  translation_language?: string;
  category_name?: string;
  gameType: string;
  localization: LocalizationProps;
}) => {
  let wordListContent = <></>;

  if (!category || !language || !translation_language || !category_name) {
    return <div>{wordListContent}</div>;
  }

  if (
    category &&
    language &&
    translation_language &&
    category_name &&
    gameType.length === 0
  ) {
    wordListContent = <>{localization.word_list || "Word list"}</>;
  } else if (category) {
    wordListContent = (
      <Link
        className="underline hover:underline-offset-2 hover:decoration-2 "
        color="inherit"
        href={`/${language}/${translation_language}/${category}`}
      >
        {localization.word_list || "Word list"}
      </Link>
    );
  }

  return <div>{wordListContent}</div>;
};

const CategoryContent = ({
  category,
  language,
  translation_language,
  category_name,
  localization,
}: {
  category?: string;
  language?: string;
  translation_language?: string;
  category_name?: string;
  localization: LocalizationProps;
}) => {
  let categoryContent = <></>;
  if (category && language && translation_language && category_name) {
    categoryContent = (
      <>
        <Link
          className="underline hover:underline-offset-2 hover:decoration-2"
          color="inherit"
          href={`/${language}/${translation_language}/`}
        >
          {localization.category || "Category"}:
        </Link>
        {category_name || <p>...</p>}
      </>
    );
  } else if (language && translation_language && category_name) {
    categoryContent = (
      <>
        {localization.category || "Category"}:
        <p className="opacity-30">{category_name}</p>
      </>
    );
  }

  return <div className="flex flex-row gap-3">{categoryContent}</div>;
};
