import {
  MAX_NUMBER_WORDS_TO_STUDY,
  MIN_NUMBER_WORDS_TO_STUDY,
} from "@/store/dict-context";

import { WordPairsProp } from "@/lib/definitions";

interface LocalWordsPairProp {
  updatedWordPairs: WordPairsProp[];
  selectedWordList: string[];
}

export function useLocalSrorageSelectedWords(
  list: WordPairsProp[],
  pageType: string
): LocalWordsPairProp {
  const maxNumToSelect =
    list.length < MAX_NUMBER_WORDS_TO_STUDY
      ? list.length
      : MAX_NUMBER_WORDS_TO_STUDY;

  let learnedWordsLocalStorage: string[] = JSON.parse(
    localStorage.getItem("learnedWords") || "[]"
  );

  let selectedWordsLocalStorage: string[] = JSON.parse(
    localStorage.getItem("selectedWords") || "[]"
  );

  if (pageType !== "") {
    if (selectedWordsLocalStorage.length === 0) {
      return { updatedWordPairs: [], selectedWordList: [] };
    }

    const updatedWordPairs = list.filter((el) =>
      selectedWordsLocalStorage.includes(el.id)
    );

    return {
      updatedWordPairs: updatedWordPairs,
      selectedWordList: selectedWordsLocalStorage,
    };
  }

  let max_number_words = maxNumToSelect;

  let updatedWordPairs: WordPairsProp[] = list.sort(function (a, b) {
    if (a.word_name < b.word_name) {
      return -1;
    }
    if (a.word_name > b.word_name) {
      return 1;
    }
    return 0;
  });

  let selectedWordList: string[] = [];

  updatedWordPairs = updatedWordPairs.map((item) => {
    let isLearnedWord = learnedWordsLocalStorage.includes(item.id);
    let isSelectedWord = false;

    if (max_number_words > 0 && selectedWordsLocalStorage.includes(item.id)) {
      isSelectedWord = true;
      max_number_words--;
    }
    if (isSelectedWord) selectedWordList.push(item.id);
    return { ...item, learned: isLearnedWord, selected: isSelectedWord };
  });

  let min_number_words = MIN_NUMBER_WORDS_TO_STUDY;
  if (
    min_number_words < maxNumToSelect &&
    selectedWordList.length < min_number_words
  ) {
    let selectedWordsLength = min_number_words - selectedWordList.length;

    updatedWordPairs = updatedWordPairs.map((item) => {
      let isSelectedWord = selectedWordsLocalStorage.includes(item.id);

      if (selectedWordsLength > 0 && !isSelectedWord) {
        isSelectedWord = true;
        selectedWordsLength--;
      }
      if (isSelectedWord) selectedWordList.push(item.id);
      return { ...item, selected: isSelectedWord };
    });
  }

  updatedWordPairs.sort(function (a, b) {
    if (a.selected !== b.selected) {
      return a.selected ? -1 : 1;
    }

    if (a.learned !== b.learned) {
      return a.learned ? 1 : -1;
    }
    return 0;
  });

  localStorage.removeItem("selectedWords");
  localStorage.setItem("selectedWords", JSON.stringify(selectedWordList));

  return { updatedWordPairs, selectedWordList };
}
