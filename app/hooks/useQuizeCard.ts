import { useCallback, useState, useEffect } from "react";
import { WordPairsProp, KeyValueObjectType } from "@/app/lib/definitions";
import { shuffleObjects } from "@/app/lib/utils";

export interface QuizeCardProp {
  word: WordPairsProp;
  answers: KeyValueObjectType[];
  selectedWordId?: string;
}

interface QuizeCardDataProp {
  wordPairs: WordPairsProp[];
  usedWords: string[];
  wordCard?: QuizeCardProp;
}

interface QuizeCardDataType {
  wordCard: QuizeCardProp | undefined;
  getNextCardHandler: (needReset: boolean) => void;
  onSelectAnswerHandler?: (value: string) => void;
  onResetHandler: () => void;
  isGameDone: boolean;
  isNextBtnDisabled: boolean;
  total: number;
  remaining: number;
}

export function useQuizeCard({
  wordPairs,
}: {
  wordPairs?: WordPairsProp[];
}): QuizeCardDataType {
  const [data, setData] = useState<QuizeCardDataProp>(
    initializeQuizCard(wordPairs)
  );

  const getNextCardHandler = useCallback((needReset: boolean): void => {
    setData((state) => {
      let allWordPairs = state.wordPairs;
      let usedWords = [...state.usedWords];

      if (needReset) {
        usedWords = [];
      } else {
        allWordPairs = allWordPairs.filter(
          (w) => !usedWords.includes(w.translated_word_id)
        );
      }

      if (allWordPairs.length == 0) return state;

      const randomNumber = Math.floor(Math.random() * allWordPairs.length);
      const wordTranslation = allWordPairs[randomNumber];

      const getDistractors = (): KeyValueObjectType[] => {
        let randomWords = state.wordPairs.filter(
          (w) => w.translated_word_id !== wordTranslation?.translated_word_id
        );

        let distractors = [];
        for (let i = 0; i < 3; i++) {
          const randomIndex = Math.floor(Math.random() * randomWords.length);

          const distractor = randomWords[randomIndex];
          if (!distractor) continue;

          randomWords.splice(randomIndex, 1);

          distractors.push({
            id: distractor.translated_word_id,
            name: distractor.translated_word_name,
          });
        }

        return distractors;
      };

      let answers: KeyValueObjectType[] = getDistractors();
      answers.push({
        id: wordTranslation.translated_word_id,
        name: wordTranslation.translated_word_name,
      });

      answers = shuffleObjects(answers) as KeyValueObjectType[];

      const currCard: QuizeCardProp = {
        word: wordTranslation,
        answers: answers,
      };
      return {
        ...state,
        wordCard: currCard,
        usedWords: usedWords,
      };
    });
  }, []);

  useEffect(() => {
    if (!wordPairs) return;

    setData(initializeQuizCard(wordPairs));
    getNextCardHandler(false);
  }, [getNextCardHandler, wordPairs]);

  const onSelectAnswerHandler = useCallback((value: string) => {
    setData((state) => {
      if (!state.wordCard) return state;

      let currState = {
        ...state.wordCard,
        selectedWordId: value,
      };

      let usedWords = [...state.usedWords];

      if (
        currState.word.translated_word_id === value &&
        !usedWords.includes(value)
      ) {
        usedWords = [...state.usedWords, value];
      }

      return {
        ...state,
        usedWords: usedWords,
        wordCard: currState,
      };
    });
  }, []);

  const onResetHandler = () => {
    getNextCardHandler(true);
  };

  const isGameDone =
    data.wordPairs.length === data.usedWords.length &&
    data.wordCard !== undefined;
  const total = data.wordPairs.length;
  const remaining = data.wordPairs.length - data.usedWords.length;

  return {
    wordCard: data.wordCard,
    getNextCardHandler,
    onSelectAnswerHandler: data.wordCard?.selectedWordId
      ? undefined
      : onSelectAnswerHandler,
    onResetHandler,
    isGameDone,
    isNextBtnDisabled:
      isGameDone || !data.wordCard || !data.wordCard.selectedWordId,
    total,
    remaining,
  };
}

function initializeQuizCard(wordPairs?: WordPairsProp[]) {
  return {
    wordPairs: wordPairs || [],
    usedWords: [],
    wordCar: undefined,
  } as QuizeCardDataProp;
}
