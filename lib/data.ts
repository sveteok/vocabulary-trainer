"use server";

import pg from "pg";
const { Client } = pg;

import "@/envConfig";

import {
  LanguagesProps,
  CategoryProps,
  LanguageCodeProps,
  WordPairsQueryProp,
  WordPairsProp,
} from "@/app/lib/definitions";

import { unstable_cache } from "next/cache";

async function connectToDb() {
  const DB_USER = process.env.DB_USER || "postgres";
  const DB_HOST = process.env.DB_HOST || "localhost";
  const DB_PASSWORD = process.env.DB_PASSWORD || "root";
  const DB_NAME = process.env.DB_NAME || DB_USER;

  const client = new Client({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: 5432,
  });
  await client.connect();
  return client;
}

export async function fetchLocalization(): Promise<LanguageCodeProps> {
  const client = await connectToDb();

  try {
    const languages = await client.query(
      `
      WITH localization_keys AS (
      SELECT language_code, JSON_OBJECT_AGG(key, ROW_TO_JSON(l)::JSONB - '{key}'::text[] - 'key' ) 
      FROM localization AS l GROUP BY language_code
      )
      SELECT JSON_OBJECT_AGG(language_code, ROW_TO_JSON(l)::JSONB - 'language_code' ) FROM localization_keys as l;  
      `
    );

    const localization_rows = languages.rows[0].json_object_agg;
    let languageList: LanguageCodeProps = {};
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
  } finally {
    await client.end();
  }
}

export const getCachedCategories = unstable_cache(
  async (language) => fetchAllCategories(language),
  ["categories"],
  {
    tags: ["categories"],
  }
);

export const getCachedCardSets = unstable_cache(
  async (query: WordPairsQueryProp) => getWordPairs(query),
  ["word-pairs"],
  {
    tags: ["word-pairs"],
    // revalidate: 60,
  }
);

export async function fetchAllLanguages(): Promise<LanguagesProps[]> {
  // noStore();

  const client = await connectToDb();

  try {
    const languages = await client.query(
      "SELECT * from languages order by name;"
    );
    return languages.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch languages.");
  } finally {
    await client.end();
  }
}

export async function fetchAllCategories(
  language_code?: string
): Promise<CategoryProps[]> {
  // noStore();
  const client = await connectToDb();

  try {
    const categories = await client.query(
      `SELECT categories.id, categoryTranslations.translated_name as name, categoryTranslations.language_code
        FROM categories
        JOIN categoryTranslations ON categoryTranslations.category_id = categories.id
        WHERE categoryTranslations.language_code=$1::text
        ORDER BY categoryTranslations.translated_name;`,
      [language_code || "en"]
    );

    // if (language_code || language_code !== "en") {
    //   const delay = (ms: number) =>
    //     new Promise((resolve) => setTimeout(resolve, ms));
    //   await delay(3000); /// waiting 1 second.
    // }

    return categories.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch categories.");
  } finally {
    await client.end();
  }
}

export async function getWordPairs(
  queryProp: WordPairsQueryProp
): Promise<WordPairsProp[]> {
  // noStore();

  const client = await connectToDb();

  try {
    const CELECT_WORDD_PAIRS = `
      SELECT wp.id, wp.word_id, wp.translated_word_id, 
        w.translated_name AS word_name,
        tw.translated_name  AS translated_word_name,
        w.description AS word_desc,
        tw.description  AS translated_word_desc
        FROM wordPairs AS wp
        INNER JOIN words AS w ON w.id=wp.word_id
        INNER JOIN words AS tw ON tw.id=wp.translated_word_id 
        WHERE 
        w.category_id=$1::uuid AND 
        w.language_code=$2::text AND
        tw.category_id=$3::uuid AND 
        tw.language_code=$4::text
        ;
      `;

    const CELECT_REVERTED_WORDD_PAIRS = `
      SELECT wp.id, wp.word_id AS translated_word_id, wp.translated_word_id AS word_id, 
        w.translated_name AS translated_word_name,
        tw.translated_name  AS word_name,
        w.description AS translated_word_desc,
        tw.description  AS word_desc
        FROM wordPairs AS wp
        INNER JOIN words AS w ON w.id=wp.word_id
        INNER JOIN words AS tw ON tw.id=wp.translated_word_id 
        WHERE 
        w.category_id=$1::uuid AND 
        w.language_code=$2::text AND
        tw.category_id=$3::uuid AND 
        tw.language_code=$4::text
        ;
      `;

    let wordPairs = await client.query(CELECT_WORDD_PAIRS, [
      queryProp.category_id,
      queryProp.language,
      queryProp.category_id,
      queryProp.translation_language,
    ]);

    // if (language_code || language_code !== "en") {
    //   const delay = (ms: number) =>
    //     new Promise((resolve) => setTimeout(resolve, ms));
    //   await delay(3000); /// waiting 1 second.
    // }

    if (wordPairs.rows.length === 0) {
      wordPairs = await client.query(CELECT_REVERTED_WORDD_PAIRS, [
        queryProp.category_id,
        queryProp.translation_language,
        queryProp.category_id,
        queryProp.language,
      ]);
    }

    return wordPairs.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch wordPairs.");
  } finally {
    await client.end();
  }
}
