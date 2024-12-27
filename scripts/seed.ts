import { sql } from "@vercel/postgres";

import {
  words,
  languages,
  categories,
  categoryTranslations,
  wordPairs,
  localization,
  wordPairs_en_fi_basic,
  wordPairs_en_fi_emotions,
  wordPairs_en_fi_food_drink,
  wordPairs_en_fi_greetings,
  wordPairs_en_fi_travel,
  wordPairs_en_fi_numbers,
  wordPairs_en_fi_time_dates,
  wordPairs_en_fi_shopping,
  wordPairs_en_fi_transportation,
  wordPairs_en_de_transportation,
  wordPairs_en_fr_transportation,
  wordPairs_en_pt_transportation,
  wordPairs_en_ru_transportation,
  wordPairs_en_zh_transportation,
  wordPairs_en_ko_transportation,
  wordPairs_en_ja_transportation,
  wordPairs_en_ar_transportation,
  wordPairs_en_hi_transportation,
  wordPairs_en_hi_basic,
  wordPairs_en_es_basic,
  wordPairs_en_fr_basic,
  wordPairs_en_de_basic,
  wordPairs_en_ru_basic,
  wordPairs_en_zh_basic,
  wordPairs_en_ja_basic,
  wordPairs_en_ko_basic,
  wordPairs_en_ar_basic,
  wordPairs_en_pt_basic,
  wordPairs_en_es_weather,
  wordPairs_en_fr_weather,
  wordPairs_en_de_weather,
  wordPairs_en_zh_weather,
  wordPairs_en_ja_weather,
  wordPairs_en_ru_weather,
  wordPairs_en_ko_weather,
  wordPairs_en_ar_weather,
  wordPairs_en_pt_weather,
  wordPairs_en_hi_weather,
  wordPairs_en_hi_emotions,
  wordPairs_en_ru_emotions,
  wordPairs_en_es_emotions,
  wordPairs_en_fr_emotions,
  wordPairs_en_de_emotions,
  wordPairs_en_zh_emotions,
  wordPairs_en_ja_emotions,
  wordPairs_en_ko_emotions,
  wordPairs_en_ar_emotions,
  wordPairs_en_pt_emotions,
  wordPairs_en_pt_food_drink,
  wordPairs_en_hi_food_drink,
  wordPairs_en_es_food_drink,
  wordPairs_en_ru_food_drink,
  wordPairs_en_fr_food_drink,
  wordPairs_en_de_food_drink,
  wordPairs_en_zh_food_drink,
  wordPairs_en_ja_food_drink,
  wordPairs_en_ko_food_drink,
  wordPairs_en_ar_food_drink,
  wordPairs_en_ar_greetings,
  wordPairs_en_pt_greetings,
  wordPairs_en_hi_greetings,
  wordPairs_en_ru_greetings,
  wordPairs_en_es_greetings,
  wordPairs_en_fr_greetings,
  wordPairs_en_de_greetings,
  wordPairs_en_zh_greetings,
  wordPairs_en_ja_greetings,
  wordPairs_en_ko_greetings,
  wordPairs_en_ko_travel,
  wordPairs_en_ar_travel,
  wordPairs_en_pt_travel,
  wordPairs_en_hi_travel,
  wordPairs_en_ru_travel,
  wordPairs_en_es_travel,
  wordPairs_en_fr_travel,
  wordPairs_en_de_travel,
  wordPairs_en_zh_travel,
  wordPairs_en_ja_travel,
  wordPairs_en_ja_numbers,
  wordPairs_en_zh_numbers,
  wordPairs_en_de_numbers,
  wordPairs_en_fr_numbers,
  wordPairs_en_es_numbers,
  wordPairs_en_ru_numbers,
  wordPairs_en_ko_numbers,
  wordPairs_en_ar_numbers,
  wordPairs_en_pt_numbers,
  wordPairs_en_hi_numbers,
  wordPairs_en_hi_shopping,
  wordPairs_en_ru_shopping,
  wordPairs_en_es_shopping,
  wordPairs_en_ja_shopping,
  wordPairs_en_fr_shopping,
  wordPairs_en_de_shopping,
  wordPairs_en_zh_shopping,
  wordPairs_en_ko_shopping,
  wordPairs_en_ar_shopping,
  wordPairs_en_pt_shopping,
  wordPairs_en_pt_time_dates,
  wordPairs_en_hi_time_dates,
  wordPairs_en_ru_time_dates,
  wordPairs_en_es_time_dates,
  wordPairs_en_fr_time_dates,
  wordPairs_en_de_time_dates,
  wordPairs_en_zh_time_dates,
  wordPairs_en_ja_time_dates,
  wordPairs_en_ko_time_dates,
  wordPairs_en_ar_time_dates,
} from "../lib/placeholder-data";

import {
  LanguagesProps,
  CategoryTranslationProps,
  WordProps,
  WordPairsProps,
  LocalizationProps,
  wordPairsType,
} from "@/lib/definitions";

async function seedLanguages() {
  try {
    const createTable =
      await sql`CREATE TABLE IF NOT EXISTS languages (id VARCHAR(10) PRIMARY KEY, name VARCHAR(100) NOT NULL);`;

    console.log(`Created "languages" table`);

    const insertedLanguages = await Promise.all(
      languages.map(
        (language: LanguagesProps) =>
          sql`
          INSERT INTO languages (id, name) VALUES (${language.id}, ${language.name}) ON CONFLICT (id) DO NOTHING;
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

    const createTable =
      await sql`CREATE TABLE IF NOT EXISTS categories (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), name VARCHAR(100) NOT NULL);`;

    console.log(`Created "categories" table`);

    const insertedCategories = await Promise.all(
      categories.map(
        (category: { id: string; name: string }) => sql`
           INSERT INTO categories (id, name) 
           VALUES (${category.id}, ${category.name}) 
           ON CONFLICT (id) DO NOTHING;
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
        VALUES (${categoryTranslation.category_id}, ${categoryTranslation.language_code}, ${categoryTranslation.translated_name})
        ON CONFLICT (category_id, language_code) DO UPDATE SET translated_name = ${categoryTranslation.translated_name};
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
        VALUES (${word.id}, ${word.category_id}, ${word.language_code},  ${word.translated_name},  ${word.description})
        ON CONFLICT (category_id, language_code, translated_name) DO UPDATE SET description = ${word.description};
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
        VALUES (${wordPair.id}, ${wordPair.word_id}, ${wordPair.translated_word_id})
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

    const client = await sql.connect();

    const insertedLocalization = await Promise.all(
      localization.map(
        async (loc: LocalizationProps) =>
          await client.sql`
        INSERT INTO localization (language_code, key, text)
        VALUES (${loc.language_code}, ${loc.key}, ${loc.text})
        ON CONFLICT (language_code, key) DO NOTHING
      `
      )
    );
    client.release();

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
  data,
}: {
  lang_from: string;
  lang_to: string;
  category_id: string;
  data: wordPairsType[];
}) {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    const insertedWordPairs = await Promise.all(
      data.map(
        (wordPair: wordPairsType) =>
          sql`
            WITH new_word AS (
              INSERT INTO words (category_id, language_code, translated_name, description)
                    VALUES (${category_id}, ${lang_from},  ${
            wordPair.word.translated_name
          },  ${wordPair.word.example || wordPair.word.description})
                    ON CONFLICT (category_id, language_code, translated_name) DO UPDATE SET description = ${
                      wordPair.word.example || wordPair.word.description
                    }
              returning id
            ), new_translated_word AS (
              INSERT INTO words (category_id, language_code, translated_name, description)
                    VALUES (${category_id}, ${lang_to},  ${
            wordPair.translated_word.translated_name
          },  ${
            wordPair.translated_word.example ||
            wordPair.translated_word.description
          })
                    ON CONFLICT (category_id, language_code, translated_name) DO UPDATE SET description = ${
                      wordPair.translated_word.example ||
                      wordPair.translated_word.description
                    }
              returning id
            )
            INSERT INTO WordPairs (word_id, translated_word_id)     
            SELECT * FROM new_word, new_translated_word
            ON CONFLICT (word_id, translated_word_id) DO NOTHING;    
      `
      )
    );

    console.log(
      `Seeded ${insertedWordPairs.length} ${lang_from} - ${lang_to} WordPairs`
    );

    return {
      insertedWordPairs,
    };
  } catch (error) {
    console.error("Error seeding WordPairs:", error);
    throw error;
  }
}

async function main() {
  // await seedLanguages();
  // await seedCategories();
  // await seedCategoryTranslations();
  await seedWords();
  // await seedWordPairs();
  // await seedLocalization();

  /** category: id: "5a7f36b6-7c4e-4cf6-930b-bf7f4d7b6347", name: "Basic Phrases"*/
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "fi",
    category_id: "5a7f36b6-7c4e-4cf6-930b-bf7f4d7b6347",
    data: wordPairs_en_fi_basic,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "hi",
    category_id: "5a7f36b6-7c4e-4cf6-930b-bf7f4d7b6347",
    data: wordPairs_en_hi_basic,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "es",
    category_id: "5a7f36b6-7c4e-4cf6-930b-bf7f4d7b6347",
    data: wordPairs_en_es_basic,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "fr",
    category_id: "5a7f36b6-7c4e-4cf6-930b-bf7f4d7b6347",
    data: wordPairs_en_fr_basic,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "de",
    category_id: "5a7f36b6-7c4e-4cf6-930b-bf7f4d7b6347",
    data: wordPairs_en_de_basic,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ru",
    category_id: "5a7f36b6-7c4e-4cf6-930b-bf7f4d7b6347",
    data: wordPairs_en_ru_basic,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "zh",
    category_id: "5a7f36b6-7c4e-4cf6-930b-bf7f4d7b6347",
    data: wordPairs_en_zh_basic,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ja",
    category_id: "5a7f36b6-7c4e-4cf6-930b-bf7f4d7b6347",
    data: wordPairs_en_ja_basic,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ko",
    category_id: "5a7f36b6-7c4e-4cf6-930b-bf7f4d7b6347",
    data: wordPairs_en_ko_basic,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ar",
    category_id: "5a7f36b6-7c4e-4cf6-930b-bf7f4d7b6347",
    data: wordPairs_en_ar_basic,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "pt",
    category_id: "5a7f36b6-7c4e-4cf6-930b-bf7f4d7b6347",
    data: wordPairs_en_pt_basic,
  });
  /** category: id: "3958dc9e-712f-6508-85e9-fec4b6a62345", name: "emotions"*/
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "fi",
    category_id: "3958dc9e-712f-6508-85e9-fec4b6a62345",
    data: wordPairs_en_fi_emotions,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "hi",
    category_id: "3958dc9e-712f-6508-85e9-fec4b6a62345",
    data: wordPairs_en_hi_emotions,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ru",
    category_id: "3958dc9e-712f-6508-85e9-fec4b6a62345",
    data: wordPairs_en_ru_emotions,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "es",
    category_id: "3958dc9e-712f-6508-85e9-fec4b6a62345",
    data: wordPairs_en_es_emotions,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "fr",
    category_id: "3958dc9e-712f-6508-85e9-fec4b6a62345",
    data: wordPairs_en_fr_emotions,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "de",
    category_id: "3958dc9e-712f-6508-85e9-fec4b6a62345",
    data: wordPairs_en_de_emotions,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "zh",
    category_id: "3958dc9e-712f-6508-85e9-fec4b6a62345",
    data: wordPairs_en_zh_emotions,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ja",
    category_id: "3958dc9e-712f-6508-85e9-fec4b6a62345",
    data: wordPairs_en_ja_emotions,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ko",
    category_id: "3958dc9e-712f-6508-85e9-fec4b6a62345",
    data: wordPairs_en_ko_emotions,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ar",
    category_id: "3958dc9e-712f-6508-85e9-fec4b6a62345",
    data: wordPairs_en_ar_emotions,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "pt",
    category_id: "3958dc9e-712f-6508-85e9-fec4b6a62345",
    data: wordPairs_en_pt_emotions,
  });
  /** category: id: "4e7b76b5-172c-488d-a69d-7f10a8f9b5ec", name: "food&drink"*/
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "fi",
    category_id: "4e7b76b5-172c-488d-a69d-7f10a8f9b5ec",
    data: wordPairs_en_fi_food_drink,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "pt",
    category_id: "4e7b76b5-172c-488d-a69d-7f10a8f9b5ec",
    data: wordPairs_en_pt_food_drink,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "hi",
    category_id: "4e7b76b5-172c-488d-a69d-7f10a8f9b5ec",
    data: wordPairs_en_hi_food_drink,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "es",
    category_id: "4e7b76b5-172c-488d-a69d-7f10a8f9b5ec",
    data: wordPairs_en_es_food_drink,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ru",
    category_id: "4e7b76b5-172c-488d-a69d-7f10a8f9b5ec",
    data: wordPairs_en_ru_food_drink,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "fr",
    category_id: "4e7b76b5-172c-488d-a69d-7f10a8f9b5ec",
    data: wordPairs_en_fr_food_drink,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "de",
    category_id: "4e7b76b5-172c-488d-a69d-7f10a8f9b5ec",
    data: wordPairs_en_de_food_drink,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "zh",
    category_id: "4e7b76b5-172c-488d-a69d-7f10a8f9b5ec",
    data: wordPairs_en_zh_food_drink,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ja",
    category_id: "4e7b76b5-172c-488d-a69d-7f10a8f9b5ec",
    data: wordPairs_en_ja_food_drink,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ko",
    category_id: "4e7b76b5-172c-488d-a69d-7f10a8f9b5ec",
    data: wordPairs_en_ko_food_drink,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ar",
    category_id: "4e7b76b5-172c-488d-a69d-7f10a8f9b5ec",
    data: wordPairs_en_ar_food_drink,
  });
  /** category: id: "7f9270ba-4a2b-4c89-b2b8-9f5e4f6f07c8", name: "greetings"*/
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "fi",
    category_id: "7f9270ba-4a2b-4c89-b2b8-9f5e4f6f07c8",
    data: wordPairs_en_fi_greetings,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ar",
    category_id: "7f9270ba-4a2b-4c89-b2b8-9f5e4f6f07c8",
    data: wordPairs_en_ar_greetings,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "pt",
    category_id: "7f9270ba-4a2b-4c89-b2b8-9f5e4f6f07c8",
    data: wordPairs_en_pt_greetings,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "hi",
    category_id: "7f9270ba-4a2b-4c89-b2b8-9f5e4f6f07c8",
    data: wordPairs_en_hi_greetings,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ru",
    category_id: "7f9270ba-4a2b-4c89-b2b8-9f5e4f6f07c8",
    data: wordPairs_en_ru_greetings,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "es",
    category_id: "7f9270ba-4a2b-4c89-b2b8-9f5e4f6f07c8",
    data: wordPairs_en_es_greetings,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "fr",
    category_id: "7f9270ba-4a2b-4c89-b2b8-9f5e4f6f07c8",
    data: wordPairs_en_fr_greetings,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "de",
    category_id: "7f9270ba-4a2b-4c89-b2b8-9f5e4f6f07c8",
    data: wordPairs_en_de_greetings,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "zh",
    category_id: "7f9270ba-4a2b-4c89-b2b8-9f5e4f6f07c8",
    data: wordPairs_en_zh_greetings,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ja",
    category_id: "7f9270ba-4a2b-4c89-b2b8-9f5e4f6f07c8",
    data: wordPairs_en_ja_greetings,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ko",
    category_id: "7f9270ba-4a2b-4c89-b2b8-9f5e4f6f07c8",
    data: wordPairs_en_ko_greetings,
  });
  /** category: id: "8fd1e6e0-9d89-4829-abe4-4c6fcb2b98ff", name: "numbers"*/
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "fi",
    category_id: "8fd1e6e0-9d89-4829-abe4-4c6fcb2b98ff",
    data: wordPairs_en_fi_numbers,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ja",
    category_id: "8fd1e6e0-9d89-4829-abe4-4c6fcb2b98ff",
    data: wordPairs_en_ja_numbers,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "zh",
    category_id: "8fd1e6e0-9d89-4829-abe4-4c6fcb2b98ff",
    data: wordPairs_en_zh_numbers,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "de",
    category_id: "8fd1e6e0-9d89-4829-abe4-4c6fcb2b98ff",
    data: wordPairs_en_de_numbers,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "fr",
    category_id: "8fd1e6e0-9d89-4829-abe4-4c6fcb2b98ff",
    data: wordPairs_en_fr_numbers,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "es",
    category_id: "8fd1e6e0-9d89-4829-abe4-4c6fcb2b98ff",
    data: wordPairs_en_es_numbers,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ru",
    category_id: "8fd1e6e0-9d89-4829-abe4-4c6fcb2b98ff",
    data: wordPairs_en_ru_numbers,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ko",
    category_id: "8fd1e6e0-9d89-4829-abe4-4c6fcb2b98ff",
    data: wordPairs_en_ko_numbers,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ar",
    category_id: "8fd1e6e0-9d89-4829-abe4-4c6fcb2b98ff",
    data: wordPairs_en_ar_numbers,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "pt",
    category_id: "8fd1e6e0-9d89-4829-abe4-4c6fcb2b98ff",
    data: wordPairs_en_pt_numbers,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "hi",
    category_id: "8fd1e6e0-9d89-4829-abe4-4c6fcb2b98ff",
    data: wordPairs_en_hi_numbers,
  });
  /** category: id: "3bb74a6d-3c3c-44ff-87e9-42e5e3bf9822", name: "shopping"*/
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "fi",
    category_id: "3bb74a6d-3c3c-44ff-87e9-42e5e3bf9822",
    data: wordPairs_en_fi_shopping,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ja",
    category_id: "3bb74a6d-3c3c-44ff-87e9-42e5e3bf9822",
    data: wordPairs_en_ja_shopping,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "fr",
    category_id: "3bb74a6d-3c3c-44ff-87e9-42e5e3bf9822",
    data: wordPairs_en_fr_shopping,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "hi",
    category_id: "3bb74a6d-3c3c-44ff-87e9-42e5e3bf9822",
    data: wordPairs_en_hi_shopping,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ru",
    category_id: "3bb74a6d-3c3c-44ff-87e9-42e5e3bf9822",
    data: wordPairs_en_ru_shopping,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "es",
    category_id: "3bb74a6d-3c3c-44ff-87e9-42e5e3bf9822",
    data: wordPairs_en_es_shopping,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "de",
    category_id: "3bb74a6d-3c3c-44ff-87e9-42e5e3bf9822",
    data: wordPairs_en_de_shopping,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "zh",
    category_id: "3bb74a6d-3c3c-44ff-87e9-42e5e3bf9822",
    data: wordPairs_en_zh_shopping,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ko",
    category_id: "3bb74a6d-3c3c-44ff-87e9-42e5e3bf9822",
    data: wordPairs_en_ko_shopping,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ar",
    category_id: "3bb74a6d-3c3c-44ff-87e9-42e5e3bf9822",
    data: wordPairs_en_ar_shopping,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "pt",
    category_id: "3bb74a6d-3c3c-44ff-87e9-42e5e3bf9822",
    data: wordPairs_en_pt_shopping,
  });
  /** category: id: "f9e7a2c9-4e22-4d3f-b7a5-8f9dc7d61f35", name: "time&dates"*/
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "fi",
    category_id: "f9e7a2c9-4e22-4d3f-b7a5-8f9dc7d61f35",
    data: wordPairs_en_fi_time_dates,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "pt",
    category_id: "f9e7a2c9-4e22-4d3f-b7a5-8f9dc7d61f35",
    data: wordPairs_en_pt_time_dates,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "hi",
    category_id: "f9e7a2c9-4e22-4d3f-b7a5-8f9dc7d61f35",
    data: wordPairs_en_hi_time_dates,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ru",
    category_id: "f9e7a2c9-4e22-4d3f-b7a5-8f9dc7d61f35",
    data: wordPairs_en_ru_time_dates,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "es",
    category_id: "f9e7a2c9-4e22-4d3f-b7a5-8f9dc7d61f35",
    data: wordPairs_en_es_time_dates,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "fr",
    category_id: "f9e7a2c9-4e22-4d3f-b7a5-8f9dc7d61f35",
    data: wordPairs_en_fr_time_dates,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "de",
    category_id: "f9e7a2c9-4e22-4d3f-b7a5-8f9dc7d61f35",
    data: wordPairs_en_de_time_dates,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "zh",
    category_id: "f9e7a2c9-4e22-4d3f-b7a5-8f9dc7d61f35",
    data: wordPairs_en_zh_time_dates,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ja",
    category_id: "f9e7a2c9-4e22-4d3f-b7a5-8f9dc7d61f35",
    data: wordPairs_en_ja_time_dates,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ko",
    category_id: "f9e7a2c9-4e22-4d3f-b7a5-8f9dc7d61f35",
    data: wordPairs_en_ko_time_dates,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ar",
    category_id: "f9e7a2c9-4e22-4d3f-b7a5-8f9dc7d61f35",
    data: wordPairs_en_ar_time_dates,
  });
  /** category: id: "2fa3b5c4-2841-4e0b-9468-bfd9395fa8bb", name: "travel"*/
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "fi",
    category_id: "2fa3b5c4-2841-4e0b-9468-bfd9395fa8bb",
    data: wordPairs_en_fi_travel,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ko",
    category_id: "2fa3b5c4-2841-4e0b-9468-bfd9395fa8bb",
    data: wordPairs_en_ko_travel,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ar",
    category_id: "2fa3b5c4-2841-4e0b-9468-bfd9395fa8bb",
    data: wordPairs_en_ar_travel,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "pt",
    category_id: "2fa3b5c4-2841-4e0b-9468-bfd9395fa8bb",
    data: wordPairs_en_pt_travel,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "hi",
    category_id: "2fa3b5c4-2841-4e0b-9468-bfd9395fa8bb",
    data: wordPairs_en_hi_travel,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ru",
    category_id: "2fa3b5c4-2841-4e0b-9468-bfd9395fa8bb",
    data: wordPairs_en_ru_travel,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "es",
    category_id: "2fa3b5c4-2841-4e0b-9468-bfd9395fa8bb",
    data: wordPairs_en_es_travel,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "fr",
    category_id: "2fa3b5c4-2841-4e0b-9468-bfd9395fa8bb",
    data: wordPairs_en_fr_travel,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "de",
    category_id: "2fa3b5c4-2841-4e0b-9468-bfd9395fa8bb",
    data: wordPairs_en_de_travel,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "zh",
    category_id: "2fa3b5c4-2841-4e0b-9468-bfd9395fa8bb",
    data: wordPairs_en_zh_travel,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ja",
    category_id: "2fa3b5c4-2841-4e0b-9468-bfd9395fa8bb",
    data: wordPairs_en_ja_travel,
  });
  /** category: id: "cb4d1a4e-9459-4f65-8376-5b9f3c8c9b9f", name: "transportation"*/
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "fi",
    category_id: "cb4d1a4e-9459-4f65-8376-5b9f3c8c9b9f",
    data: wordPairs_en_fi_transportation,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "de",
    category_id: "cb4d1a4e-9459-4f65-8376-5b9f3c8c9b9f",
    data: wordPairs_en_de_transportation,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "fr",
    category_id: "cb4d1a4e-9459-4f65-8376-5b9f3c8c9b9f",
    data: wordPairs_en_fr_transportation,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "pt",
    category_id: "cb4d1a4e-9459-4f65-8376-5b9f3c8c9b9f",
    data: wordPairs_en_pt_transportation,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ru",
    category_id: "cb4d1a4e-9459-4f65-8376-5b9f3c8c9b9f",
    data: wordPairs_en_ru_transportation,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "zh",
    category_id: "cb4d1a4e-9459-4f65-8376-5b9f3c8c9b9f",
    data: wordPairs_en_zh_transportation,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ko",
    category_id: "cb4d1a4e-9459-4f65-8376-5b9f3c8c9b9f",
    data: wordPairs_en_ko_transportation,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ja",
    category_id: "cb4d1a4e-9459-4f65-8376-5b9f3c8c9b9f",
    data: wordPairs_en_ja_transportation,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ar",
    category_id: "cb4d1a4e-9459-4f65-8376-5b9f3c8c9b9f",
    data: wordPairs_en_ar_transportation,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "hi",
    category_id: "cb4d1a4e-9459-4f65-8376-5b9f3c8c9b9f",
    data: wordPairs_en_hi_transportation,
  });
  /** category: id: "3958dc9e-712f-8808-85e9-fec4b6a6442b", name: "Weather"*/
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "es",
    category_id: "3958dc9e-712f-8808-85e9-fec4b6a6442b",
    data: wordPairs_en_es_weather,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "fr",
    category_id: "3958dc9e-712f-8808-85e9-fec4b6a6442b",
    data: wordPairs_en_fr_weather,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "de",
    category_id: "3958dc9e-712f-8808-85e9-fec4b6a6442b",
    data: wordPairs_en_de_weather,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "zh",
    category_id: "3958dc9e-712f-8808-85e9-fec4b6a6442b",
    data: wordPairs_en_zh_weather,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ja",
    category_id: "3958dc9e-712f-8808-85e9-fec4b6a6442b",
    data: wordPairs_en_ja_weather,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ru",
    category_id: "3958dc9e-712f-8808-85e9-fec4b6a6442b",
    data: wordPairs_en_ru_weather,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ko",
    category_id: "3958dc9e-712f-8808-85e9-fec4b6a6442b",
    data: wordPairs_en_ko_weather,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "ar",
    category_id: "3958dc9e-712f-8808-85e9-fec4b6a6442b",
    data: wordPairs_en_ar_weather,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "pt",
    category_id: "3958dc9e-712f-8808-85e9-fec4b6a6442b",
    data: wordPairs_en_pt_weather,
  });
  await seedCategoryWordPairs({
    lang_from: "en",
    lang_to: "hi",
    category_id: "3958dc9e-712f-8808-85e9-fec4b6a6442b",
    data: wordPairs_en_hi_weather,
  });
}

main().catch((err) => {
  console.error(
    "An error occurred while attempting to seed the database:",
    err
  );
});
