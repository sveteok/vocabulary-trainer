"use client";

import Link from "next/link";

import { useSiteNavigation } from "@/hooks/useSiteNavigation";
import { FormType } from "@/store/dict-context";
import { getSelectedWordsQuantity } from "@/lib/utils";
import { LoadingSkeleton } from "@/ui/basis/loadingSkeleton";

export default function SiteNavigation() {
  const { form, language, translation_language, category } =
    useSiteNavigation();

  return (
    <nav
      role="navigation"
      className="flex flex-col p-4 gap-2 bg-natural-gray-600 text-natural-gray-50 
      
      data-[category=false]:min-h-[70px]
      data-[category=true]:min-h-[107px]"
      data-category={category !== undefined}
    >
      <div
        className="flex flex-row justify-center text-xs gap-2
                    data-[category=false]:text-lg 
                    data-[category=false]:items-center 
                    data-[category=false]:flex-1
                  "
        data-category={category !== undefined}
      >
        <LanguageContent
          form={form}
          language={language}
          language_name={form.language_name}
        />
        <TranslationLanguageContent language={language} form={form} />
      </div>
      {category && (
        <div className="flex flex-row">
          <div className="flex flex-1 justify-center">
            <CategoryContent
              category={category}
              language={language}
              translation_language={translation_language}
              category_name={form.category_name}
              form={form}
            />
          </div>
        </div>
      )}
    </nav>
  );
}

const linkClassName =
  "hover:underline hover:underline-offset-1 hover:decoration-1 ";

const focusClassName = "focus:outline-natural-gray-50 outline-natural-gray-50 ";

const LanguageContent = ({
  language,
  language_name,
  form,
}: {
  language?: string;
  language_name?: string;
  form: FormType;
}) => {
  let languageContent = <></>;

  if (language && form.language && language_name) {
    languageContent = (
      <Link className={`${linkClassName} ${focusClassName}`} href={`/`}>
        {language_name}
      </Link>
    );
  } else {
    languageContent = (
      <div className="flex gap-2 items-center">
        {form.localization.application_language || "Application language"}:
        <p className="opacity-30">{language_name || "..."}</p>
      </div>
    );
  }

  return <div>{languageContent}</div>;
};

const TranslationLanguageContent = ({
  language,
  form,
}: {
  language?: string;
  form: FormType;
}) => {
  if (!language || !form.language || !form.language_name) return <></>;

  let translationLanguageContent = <></>;

  if (form.translation_language && form.translation_language_name) {
    translationLanguageContent = (
      <div className="flex gap-2">
        <p>/</p>
        <Link
          className={`${linkClassName}  ${focusClassName}`}
          href={`/${form.language}/`}
        >
          {form.translation_language_name}
        </Link>
      </div>
    );
  } else {
    translationLanguageContent = (
      <div className="opacity-30 flex gap-2">
        <p>/</p>
        <LoadingSkeleton />
      </div>
    );
  }

  return <div>{translationLanguageContent}</div>;
};

const CategoryContent = ({
  category,
  language,
  translation_language,
  category_name,
  form,
}: {
  category?: string;
  language?: string;
  translation_language?: string;
  category_name?: string;
  form: FormType;
}) => {
  if (!language || !translation_language) {
    return <></>;
  }
  let categoryContent = <></>;

  if (category && category_name) {
    const selectedWordsQuantity = getSelectedWordsQuantity();
    categoryContent = (
      <div className="flex flex-col gap-2 items-center">
        <Link
          className={`${linkClassName} ${focusClassName} font-bold text-lg`}
          href={`/${form.language}/${form.translation_language}/`}
        >
          {category_name || <LoadingSkeleton />}
        </Link>

        <Link
          className={`${linkClassName}  ${focusClassName} text-xs `}
          href={`/${language}/${translation_language}/${category}`}
        >
          {`${
            form.localization?.number_of_words || "Number of words"
          }: ${selectedWordsQuantity} `}
        </Link>
      </div>
    );
  } else if (category) {
    categoryContent = (
      <div className="flex flex-col gap-2 items-center ">
        <LoadingSkeleton />
        <LoadingSkeleton className="text-xs" />
      </div>
    );
  }

  return <div className="flex flex-row gap-3">{categoryContent}</div>;
};
