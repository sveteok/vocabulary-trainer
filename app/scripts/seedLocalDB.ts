"use server";

import { Client } from "pg";
import pg from "pg";

const {
  words,
  languages,
  categories,
  categoryTranslations,
  wordPairs,
  localization,
} = require("../app/lib/placeholder-data");

import "@/envConfig";

import {
  LanguagesProps,
  CategoryProps,
  CategoryTranslationProps,
  WordProps,
  WordPairsProps,
  LanguageCodeProps,
} from "@/app/lib/definitions";

async function seedLanguages(client: Client) {
  try {
    const createTable = await client.query(
      "CREATE TABLE IF NOT EXISTS languages (id VARCHAR(10) PRIMARY KEY, name VARCHAR(100) NOT NULL);"
    );

    console.log(`Created "languages" table`);

    const insertedLanguages = await Promise.all(
      languages.map((language: LanguagesProps) =>
        client.query(
          "INSERT INTO languages (id, name) VALUES ($1::text, $2::text) ON CONFLICT (id) DO NOTHING",
          [language.id, language.name]
        )
      )
    );

    console.log(`Seeded ${insertedLanguages.length} languages`);

    return {
      createTable,
      languages: insertedLanguages,
    };
  } catch (error) {
    console.error("Error seeding languages:", error);
    throw error;
  }
}

async function seedCategories(client: Client) {
  try {
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    const createTable = await client.query(
      "CREATE TABLE IF NOT EXISTS categories (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), name VARCHAR(100) NOT NULL);"
    );

    console.log(`Created "categories" table`);

    const insertedCategories = await Promise.all(
      categories.map((category: CategoryProps) => {
        return client.query(
          `INSERT INTO categories (id, name) VALUES ($1::uuid, $2::text) ON CONFLICT (id) DO NOTHING`,
          [category.id, category.name]
        );
      })
    );

    console.log(`Seeded ${insertedCategories.length} categories`);

    return {
      createTable,
      categories: insertedCategories,
    };
  } catch (error) {
    console.error("Error seeding categories:", error);
    throw error;
  }
}

async function seedCategoryTranslations(client: Client) {
  try {
    const createTable = await client.query(`
        CREATE TABLE IF NOT EXISTS categoryTranslations (
        id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        category_id UUID NOT NULL,
        language_code VARCHAR(10) NOT NULL,
        translated_name VARCHAR(255) NOT NULL,
        CONSTRAINT fk_category_id
          FOREIGN KEY(category_id)
          REFERENCES categories(id)
          ON DELETE CASCADE,
        CONSTRAINT fk_language_code_id
          FOREIGN KEY(language_code)
          REFERENCES languages(id)
          ON DELETE CASCADE,
        UNIQUE (category_id, language_code)
      );
    `);

    console.log(`Created "categoryTranslations" table`);

    const insertedCategoryTranslations = await Promise.all(
      categoryTranslations.map(
        (categoryTranslation: CategoryTranslationProps) =>
          client.query(
            `
        INSERT INTO categoryTranslations (category_id, language_code, translated_name)
        VALUES ($1::uuid, $2::text,  $3::text)
        ON CONFLICT (category_id, language_code) DO UPDATE SET translated_name = $4::text;
      `,
            [
              categoryTranslation.category_id,
              categoryTranslation.language_code,
              categoryTranslation.translated_name,
              categoryTranslation.translated_name,
            ]
          )
      )
    );

    console.log(
      `Seeded ${insertedCategoryTranslations.length} categoryTranslations`
    );

    return {
      createTable,
      categoryTranslations: insertedCategoryTranslations,
    };
  } catch (error) {
    console.error("Error seeding categoryTranslations:", error);
    throw error;
  }
}

async function seedWords(client: Client) {
  try {
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    const createTable = await client.query(`
        CREATE TABLE IF NOT EXISTS words (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        category_id UUID NOT NULL,
        language_code VARCHAR(10) NOT NULL,
        translated_name VARCHAR(255) NOT NULL,
        description TEXT NULL,
        CONSTRAINT fk_category_id
          FOREIGN KEY(category_id)
          REFERENCES categories(id)
          ON DELETE CASCADE,
        CONSTRAINT fk_language_code_id
          FOREIGN KEY(language_code)
          REFERENCES languages(id)
          ON DELETE CASCADE,
        UNIQUE (category_id, language_code, translated_name)
      );
    `);

    console.log(`Created "words" table`);

    const insertedWords = await Promise.all(
      words.map((word: WordProps) =>
        client.query(
          `
        INSERT INTO words (id, category_id, language_code, translated_name, description)
        VALUES ($1::uuid, $2::uuid, $3::text,  $4::text,  $5::text)
        ON CONFLICT (category_id, language_code, translated_name) DO UPDATE SET description = $6::text;
      `,
          [
            word.id,
            word.category_id,
            word.language_code,
            word.translated_name,
            word.description,
            word.description,
          ]
        )
      )
    );

    console.log(`Seeded ${insertedWords.length} words`);

    return {
      createTable,
      words: insertedWords,
    };
  } catch (error) {
    console.error("Error seeding words:", error);
    throw error;
  }
}

async function seedWordPairs(client: Client) {
  try {
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    const createTable = await client.query(`
    CREATE TABLE IF NOT EXISTS WordPairs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    word_id UUID NOT NULL,
    translated_word_id UUID NOT NULL,
    CONSTRAINT fk_word_id
      FOREIGN KEY(word_id)
      REFERENCES words(id)
      ON DELETE CASCADE,
    CONSTRAINT fk_translated_word_id
      FOREIGN KEY(translated_word_id)
      REFERENCES words(id)
      ON DELETE CASCADE,
    UNIQUE (word_id, translated_word_id)
  );
`);

    console.log(`Created "WordPairs" table`);

    const insertedWordPairs = await Promise.all(
      wordPairs.map((wordPair: WordPairsProps) =>
        client.query(
          `
        INSERT INTO WordPairs (id, word_id, translated_word_id)
        VALUES ($1::uuid, $2::uuid, $3::uuid)
        ON CONFLICT (word_id, translated_word_id) DO NOTHING;
      `,
          [wordPair.id, wordPair.word_id, wordPair.translated_word_id]
        )
      )
    );

    console.log(`Seeded ${insertedWordPairs.length} WordPairs`);

    return {
      createTable,
      wordTranslations: insertedWordPairs,
    };
  } catch (error) {
    console.error("Error seeding WordPairs:", error);
    throw error;
  }
}

async function seedLocalization(client: Client) {
  try {
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    const createTable = await client.query(`
    CREATE TABLE IF NOT EXISTS localization (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        language_code VARCHAR(10) NOT NULL,
        key VARCHAR(255) NOT NULL,
        text TEXT NOT NULL,
    CONSTRAINT fk_language_code
      FOREIGN KEY(language_code)
      REFERENCES languages(id)
      ON DELETE CASCADE,
      UNIQUE (language_code, key)
  );
`);
    console.log(`Created "localization" table`);

    const insertedLocalization = await Promise.all(
      localization.map((loc: LanguageCodeProps) =>
        client.query(
          `
        INSERT INTO localization (language_code, key, text)
        VALUES ($1::text, $2::text, $3::text)
        ON CONFLICT (language_code, key) DO UPDATE SET text = $4::text;
      `,
          [loc.language_code, loc.key, loc.text, loc.text]
        )
      )
    );

    console.log(`Seeded ${insertedLocalization.length} localization`);

    return {
      createTable,
      localization: insertedLocalization,
    };
  } catch (error) {
    console.error("Error seeding localization:", error);
    throw error;
  }
}

async function setupDatabase(client: Client) {
  try {
    const DB_NAME = process.env.DB_NAME || "db-name";

    const createDB = await client.query(
      `SELECT 'CREATE DATABASE ${DB_NAME}' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${DB_NAME}')`
    );

    return { createDB };
  } catch (error) {
    console.error("Error creating db:", error);
    throw error;
  }
}

async function connectToDb() {
  const DB_USER = process.env.DB_USER || "postgres";
  const DB_HOST = process.env.DB_HOST || "localhost";
  const DB_PASSWORD = process.env.DB_PASSWORD || "root";
  const DB_NAME = process.env.DB_NAME || DB_USER;

  const client = new pg.Client({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: 5432,
  });

  await client.connect();

  return client;
}

async function main() {
  const client = await connectToDb();
  await setupDatabase(client);
  await seedLanguages(client);
  await seedCategories(client);
  await seedCategoryTranslations(client);
  await seedWords(client);
  await seedWordPairs(client);
  await seedLocalization(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    "An error occurred while attempting to seed the database:",
    err
  );
});
