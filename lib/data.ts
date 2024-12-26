"use server";

import { sql } from "@vercel/postgres";

import {
  LanguagesProps,
  CategoryProps,
  AllLocalizationCodeProps,
  WordPairsQueryProp,
  WordPairsProp,
} from "@/lib/definitions";

import { unstable_cache } from "next/cache";

export async function fetchLocalization(): Promise<AllLocalizationCodeProps> {
  try {
    const languages = await sql`
      WITH localization_keys AS (
      SELECT language_code, JSON_OBJECT_AGG(key, ROW_TO_JSON(l)::JSONB - '{key}'::text[] - 'key' ) 
      FROM localization AS l GROUP BY language_code
      )
      SELECT JSON_OBJECT_AGG(language_code, ROW_TO_JSON(l)::JSONB - 'language_code' ) FROM localization_keys as l;  
      `;
    const localization_rows = languages.rows[0].json_object_agg;
    let languageList: AllLocalizationCodeProps = {};
    Object.keys(localization_rows).map(function (language_code) {
      const lang_keys = localization_rows[language_code].json_object_agg;

      let data = {};
      Object.keys(lang_keys).map(function (key) {
        data = { ...data, [key]: lang_keys[key].text };
      });
      languageList = {
        ...languageList,
        [language_code]: data,
      };
    });

    return languageList;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch localization.");
  }
}

export const getCachedCategories = unstable_cache(
  async (language) => fetchAllCategories(language),
  ["categories"],
  {
    tags: ["categories"],
  }
);

export async function fetchAllLanguages(): Promise<LanguagesProps[]> {
  // noStore();

  try {
    const languages =
      await sql<LanguagesProps>`SELECT * from languages order by name;`;

    return languages.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch languages.");
  }
}

interface GetInitDataProps {
  languages: LanguagesProps[];
  localization: AllLocalizationCodeProps;
  categories: CategoryProps[];
}

export async function featchInitData(): Promise<GetInitDataProps> {
  const languageData = await fetchAllLanguages();
  const localizationData = await fetchLocalization();
  const categoryData = await fetchAllCategories();

  const [languages, localization, categories] = await Promise.all([
    languageData,
    localizationData,
    categoryData,
  ]);

  return {
    languages,
    localization,
    categories,
  };
}

export const getInitData = unstable_cache(
  async () => featchInitData(),
  ["init-data"],
  {
    tags: ["init-data"],
    revalidate: 60,
  }
);

export async function fetchAllCategories(
  language_code?: string
): Promise<CategoryProps[]> {
  // noStore();

  try {
    const categories =
      await sql<CategoryProps>`SELECT categories.id, categoryTranslations.translated_name as name, categoryTranslations.language_code
        FROM categories
        JOIN categoryTranslations ON categoryTranslations.category_id = categories.id
        WHERE categoryTranslations.language_code=${language_code || "en"}
        ORDER BY categoryTranslations.translated_name;`;

    // if (language_code || language_code !== "en") {
    //   const delay = (ms: number) =>
    //     new Promise((resolve) => setTimeout(resolve, ms));
    //   await delay(3000); /// waiting 1 second.
    // }

    return categories.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch categories.");
  }
}

export const getCachedCardSets = unstable_cache(
  async (query: WordPairsQueryProp) => getWordPairs(query),
  ["word-pairs"],
  {
    tags: ["word-pairs"],
    revalidate: 60,
  }
);

export async function getWordPairs(
  queryProp: WordPairsQueryProp
): Promise<WordPairsProp[]> {
  try {
    if (queryProp.language === "en") {
      const wordPairs = await sql<WordPairsProp>`
        SELECT wp.id, wp.word_id, wp.translated_word_id, 
        w.translated_name AS word_name,
        tw.translated_name  AS translated_word_name,
        w.description AS word_desc,
        tw.description  AS translated_word_desc
        FROM wordPairs AS wp
        INNER JOIN words AS w ON w.id=wp.word_id
        INNER JOIN words AS tw ON tw.id=wp.translated_word_id 
        WHERE 
        w.category_id=${queryProp.category_id} AND 
        w.language_code=${queryProp.language} AND
        tw.category_id=${queryProp.category_id} AND 
        tw.language_code=${queryProp.translation_language}
        ;`;
      return wordPairs.rows;
    } else if (queryProp.translation_language === "en") {
      const wordPairs = await sql<WordPairsProp>` 
          SELECT wp.id, wp.word_id AS translated_word_id, wp.translated_word_id AS word_id, 
          w.translated_name AS translated_word_name,
          tw.translated_name  AS word_name,
          w.description AS translated_word_desc,
          tw.description  AS word_desc
          FROM wordPairs AS wp
          INNER JOIN words AS w ON w.id=wp.word_id
          INNER JOIN words AS tw ON tw.id=wp.translated_word_id 
          WHERE 
          w.category_id=${queryProp.category_id} AND 
          w.language_code=${queryProp.translation_language} AND
          tw.category_id=${queryProp.category_id} AND 
          tw.language_code=${queryProp.language}`;
      return wordPairs.rows;
    } else {
      const wordPairs = await sql<WordPairsProp>`
        WITH word AS (
              SELECT w.id AS id, wp.translated_word_id  AS word_id,  
                tw.translated_name  AS word_name,
                tw.description  AS word_desc
                FROM wordPairs AS wp
                INNER JOIN words AS w ON w.id=wp.word_id
                INNER JOIN words AS tw ON tw.id=wp.translated_word_id 
              WHERE 
                w.category_id=${queryProp.category_id} AND 
                w.language_code='en'::text AND
                tw.category_id=${queryProp.category_id} AND 
                tw.language_code=${queryProp.language}
                    ), 
            translated_word AS (
                SELECT w.id AS id, wp.translated_word_id AS translated_word_id, 
                  tw.translated_name  AS translated_word_name,   
                  tw.description  AS translated_word_desc
                  FROM wordPairs AS wp
                  INNER JOIN words AS w ON w.id=wp.word_id
                  INNER JOIN words AS tw ON tw.id=wp.translated_word_id 
                WHERE 
                  w.category_id=${queryProp.category_id} AND 
                  w.language_code='en'::text AND
                  tw.category_id=${queryProp.category_id} AND 
                  tw.language_code=${queryProp.translation_language}
      )
      SELECT * FROM word as w, translated_word as tw WHERE w.id = tw.id;
        `;
      return wordPairs.rows;
    }
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch wordPairs.");
  }
}
