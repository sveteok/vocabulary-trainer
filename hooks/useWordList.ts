import { useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { WordPairsProp } from "@/lib/definitions";

import {
  DictionaryContext,
  FormType,
  MAX_NUMBER_WORDS_TO_STUDY,
  MIN_NUMBER_WORDS_TO_STUDY,
} from "@/store/dict-context";

interface WordListProp {
  form: FormType;
  onGoToPracticeHandler: () => void;
  wordPairs: WordPairsProp[];
  selectedWordsQuantity: number;
  maxNumToSelect: number;
  isNextBtnDisabled: boolean;
  onUpdateWordSelectedState: (id: string, checked: boolean) => void;
}

export function useWordList(): WordListProp {
  const dictContext = useContext(DictionaryContext);
  const { form, updateWordPairs, updateWordSelectedState } = dictContext;

  const router = useRouter();
  const pathname = usePathname();

  const [wordPairs, setWordPairs] = useState<WordPairsProp[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  const maxNumToSelect =
    wordPairs.length < MAX_NUMBER_WORDS_TO_STUDY
      ? wordPairs.length
      : MAX_NUMBER_WORDS_TO_STUDY;

  useEffect(() => {
    let selectedWordIdList: string[] = [];
    form.wordPairs?.map((w) => {
      if (w.selected) selectedWordIdList.push(w.id);
    });
    setSelectedWords(selectedWordIdList || []);
    setWordPairs(form.wordPairs || []);
  }, [form.wordPairs]);

  const onUpdateWordSelectedState = (id: string, checked: boolean) => {
    if (id === "all") {
      const { updatedWordPairs, selectedWordList } = adjustWordSelection(
        wordPairs,
        selectedWords,
        checked
      );

      setSelectedWords(selectedWordList);
      setWordPairs(updatedWordPairs);
      updateWordPairs(updatedWordPairs);
    } else {
      setSelectedWords((pred) =>
        checked ? [...pred, id] : pred.filter((el) => el !== id)
      );
      updateWordsInLocalStore(id, checked);
      updateWordSelectedState(id, checked);
    }
  };

  const onGoToPracticeHandler = () => router.push(`${pathname}/menu`);

  return {
    form,
    onGoToPracticeHandler,
    wordPairs,
    selectedWordsQuantity: selectedWords.length,
    maxNumToSelect,
    onUpdateWordSelectedState,
    isNextBtnDisabled: selectedWords.length === 0,
  };
}

const updateWordsInLocalStore = (id: string, checked: boolean) => {
  const checkbox_checked = checked;

  let selectedWordsLocalStorage: string[] = JSON.parse(
    localStorage.getItem("selectedWords") || "[]"
  );

  if (checkbox_checked && !selectedWordsLocalStorage.includes(id)) {
    selectedWordsLocalStorage.push(id);
  } else {
    selectedWordsLocalStorage = selectedWordsLocalStorage.filter(
      (el) => el !== id
    );
  }

  localStorage.removeItem("selectedWords");
  localStorage.setItem(
    "selectedWords",
    JSON.stringify(selectedWordsLocalStorage)
  );
};

const adjustWordSelection = (
  wordPairs: WordPairsProp[],
  selectedWords: string[],
  selected: boolean
): { updatedWordPairs: WordPairsProp[]; selectedWordList: string[] } => {
  let updatedWordPairs = [...(wordPairs || [])];
  let selectedWordList = [...selectedWords];

  const maxNumToSelect =
    wordPairs.length < MAX_NUMBER_WORDS_TO_STUDY
      ? wordPairs.length
      : MAX_NUMBER_WORDS_TO_STUDY;

  if (
    updatedWordPairs.length <= MAX_NUMBER_WORDS_TO_STUDY ||
    updatedWordPairs.length >= MIN_NUMBER_WORDS_TO_STUDY
  ) {
    selectedWordList = [];
    updatedWordPairs = updatedWordPairs.map((w) => {
      if (selected) {
        selectedWordList.push(w.id);
      }
      return { ...w, selected: selected };
    });
  } else if (selected) {
    updatedWordPairs = updatedWordPairs.map((w) => {
      let isSelectedWord = w.selected;

      if (selectedWordList.length < maxNumToSelect && !isSelectedWord) {
        isSelectedWord = true;
        selectedWordList.push(w.id);
      } else if (selectedWordList.length > maxNumToSelect && isSelectedWord) {
        selectedWordList = selectedWordList.filter((el) => el !== w.id);
      }
      return { ...w, selected: isSelectedWord };
    });
  } else {
    const minNumberWords = maxNumToSelect - MIN_NUMBER_WORDS_TO_STUDY;

    if (minNumberWords < 0) return { updatedWordPairs, selectedWordList };

    if (selectedWordList.length > minNumberWords) {
      const elemsToDelete = selectedWordList.length - minNumberWords;
      selectedWordList.splice(
        selectedWordList.length - elemsToDelete,
        elemsToDelete
      );
    }

    updatedWordPairs = updatedWordPairs.map((w) => {
      let isSelectedWord = selectedWordList.includes(w.id);

      if (
        selectedWordList.length < MIN_NUMBER_WORDS_TO_STUDY &&
        !isSelectedWord
      ) {
        isSelectedWord = true;
        selectedWordList.push(w.id);
      }
      return { ...w, selected: isSelectedWord };
    });
  }

  localStorage.removeItem("selectedWords");
  localStorage.setItem("selectedWords", JSON.stringify(selectedWordList));

  return { updatedWordPairs, selectedWordList };
};
