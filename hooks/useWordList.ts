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
    const selectedWordIdList: string[] = [];
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
  selected: boolean
): { updatedWordPairs: WordPairsProp[]; selectedWordList: string[] } => {
  let updatedWordPairs = [...(wordPairs || [])];
  const selectedWordList: string[] = [];

  const maxNumToSelect =
    wordPairs.length < MAX_NUMBER_WORDS_TO_STUDY
      ? wordPairs.length
      : MAX_NUMBER_WORDS_TO_STUDY;

  if (selected) {
    updatedWordPairs = updatedWordPairs.map((w) => {
      const isSelectedWord = selectedWordList.length < maxNumToSelect;
      if (isSelectedWord) {
        selectedWordList.push(w.id);
      }
      return { ...w, selected: isSelectedWord };
    });
  } else {
    const minNumberWords = Math.min(MIN_NUMBER_WORDS_TO_STUDY, maxNumToSelect);

    updatedWordPairs = updatedWordPairs.map((w) => {
      const isSelectedWord = selectedWordList.length < minNumberWords;
      if (isSelectedWord) {
        selectedWordList.push(w.id);
      }
      return { ...w, selected: isSelectedWord };
    });
  }

  localStorage.removeItem("selectedWords");
  localStorage.setItem("selectedWords", JSON.stringify(selectedWordList));

  return { updatedWordPairs, selectedWordList };
};
