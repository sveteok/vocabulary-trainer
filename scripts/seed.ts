import { sql } from "@vercel/postgres";

import {
  words,
  languages,
  categories,
  categoryTranslations,
  wordPairs,
  localization,
  wordPairs_en_fi_basic,
} from "@/lib/placeholder-data";

import {
  LanguagesProps,
  CategoryTranslationProps,
  WordProps,
  WordPairsProps,
  LocalizationProps,
} from "@/lib/definitions";

async function seedLanguages() {
  try {
    const createTable = await sql`
        CREATE TABLE IF NOT EXISTS languages (
          code VARCHAR(10) PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
        );
      `;

    console.log(`Created "languages" table`);

    const insertedLanguages = await Promise.all(
      languages.map(
        (language: LanguagesProps) =>
          sql`
          INSERT INTO languages (id, name) VALUES ('${language.id}'::text, '${language.name}'::text,') ON CONFLICT (id) DO NOTHING
         `
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

async function seedCategories() {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createTable = await sql`
    CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
    name VARCHAR(100) NOT NULL
    );
  );
`;
    console.log(`Created "categories" table`);

    const insertedCategories = await Promise.all(
      categories.map(
        (category: { id: string; name: string }) => sql`
           INSERT INTO categories (id, name) VALUES ('${category.id}'::uuid, '${category.name}'::text,') ON CONFLICT (id) DO NOTHING
           `
      )
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

async function seedCategoryTranslations() {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createTable = await sql`
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
`;

    console.log(`Created "categories" table`);

    const insertedCategoryTranslations = await Promise.all(
      categoryTranslations.map(
        (categoryTranslation: CategoryTranslationProps) =>
          sql`
        INSERT INTO categoryTranslations (category_id, language_code, translated_name)
        VALUES ('${categoryTranslation.category_id}'::uuid, '${categoryTranslation.language_code}'::text,  '${categoryTranslation.translated_name}'::text)
        ON CONFLICT (category_id, language_code) DO UPDATE SET translated_name = '${categoryTranslation.translated_name}'::text;
      `
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

async function seedWords() {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createTable = await sql`
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
    `;

    console.log(`Created "words" table`);

    const insertedWords = await Promise.all(
      words.map(
        (word: WordProps) =>
          sql`
        INSERT INTO words (id, category_id, language_code, translated_name, description)
        VALUES ('${word.id}'::uuid, '${word.category_id}'::uuid, '${word.language_code}'::text,  '${word.translated_name}'::text,  '${word.description}'::text)
        ON CONFLICT (category_id, language_code, translated_name) DO UPDATE SET description = '${word.description}'::text;
      `
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

async function seedWordPairs() {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createTable = await sql`
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
`;
    console.log(`Created "WordPairs" table`);

    const insertedWordPairs = await Promise.all(
      wordPairs.map(
        (wordPair: WordPairsProps) =>
          sql`
        INSERT INTO WordPairs (id, word_id, translated_word_id)
        VALUES ('${wordPair.id}'::uuid, '${wordPair.word_id}'::uuid, '${wordPair.translated_word_id}'::uuid)
        ON CONFLICT (word_id, translated_word_id) DO NOTHING;
      `
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

async function seedLocalization() {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const createTable = await sql`
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
`;

    console.log(`Created "localization" table`);

    const insertedLocalization = await Promise.all(
      localization.map(
        (loc: LocalizationProps) =>
          sql`
        INSERT INTO localization (language_code, key, text)
        VALUES ('${loc.language_code}'::text, '${loc.key}'::text, '${loc.text}'::text)
        ON CONFLICT (language_code, key) DO UPDATE SET text = '${loc.text}'::text;
      `
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

async function seedCategoryWordPairs({
  lang_from,
  lang_to,
  category_id,
}: {
  lang_from: string;
  lang_to: string;
  category_id: string;
}) {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const insertedWordPairs = await Promise.all(
      wordPairs_en_fi_basic.map(
        (wordPair: {
          word: {
            language_code: string;
            translated_name: string;
            description: string;
          };
          translated_word: {
            language_code: string;
            translated_name: string;
            description: string;
          };
        }) =>
          sql`
            WITH new_word AS (
              INSERT INTO words (category_id, language_code, translated_name, description)
                    VALUES ('${category_id}'::uuid, '${lang_from}'::text,  '${wordPair.word.translated_name}'::text,  '${wordPair.word.description}'::text)
                    ON CONFLICT (category_id, language_code, translated_name) DO UPDATE SET description = '${wordPair.word.description}'::text
              returning id
            ), new_translated_word AS (
              INSERT INTO words (category_id, language_code, translated_name, description)
                    VALUES ('${category_id}'::uuid, '${lang_to}'::text,  '${wordPair.translated_word.translated_name}'::text,  '${wordPair.translated_word.description}'::text)
                    ON CONFLICT (category_id, language_code, translated_name) DO UPDATE SET description = '${wordPair.translated_word.description}'::text
              returning id
            )
            INSERT INTO WordPairs (word_id, translated_word_id)     
            SELECT * FROM new_word, new_translated_word
            ON CONFLICT (word_id, translated_word_id) DO NOTHING;   
      `
      )
    );

    console.log(`Seeded ${insertedWordPairs.length} WordPairs`);

    return {
      insertedWordPairs,
    };
  } catch (error) {
    console.error("Error seeding WordPairs:", error);
    throw error;
  }
}

async function main() {
  await seedLanguages();
  await seedCategories();
  await seedCategoryTranslations();
  await seedWords();
  await seedWordPairs();
  await seedLocalization();

  /** category: id: "5a7f36b6-7c4e-4cf6-930b-bf7f4d7b6347", name: "Basic Phrases"*/
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "fi",
    category_id: "5a7f36b6-7c4e-4cf6-930b-bf7f4d7b6347",
  });
}

main().catch((err) => {
  console.error(
    "An error occurred while attempting to seed the database:",
    err
  );
});
