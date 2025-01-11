import { useState, useEffect, useContext, useRef, RefObject } from "react";
import { WordPairsProp, LocalizationProps } from "@/lib/definitions";
import { DictionaryContext, FormType } from "@/store/dict-context";
import { useWriteBtnControl } from "@/hooks/useWriteBtnControl";

export enum CardResultTypes {
  CORRECT = 0,
  INCORRECT = 1,
  NO_ANSWER = 2,
}

export interface CurrentWriteCardProp {
  word: WordPairsProp;
  result: CardResultTypes;
  answer?: string;
}

export interface WriteCardDataProp {
  wordPairs: WordPairsProp[];
  usedWords: string[];
  writingCurrCard?: CurrentWriteCardProp;
  flipped?: boolean;
}

interface WriteCardDataType {
  form: FormType;
  writeCard?: CurrentWriteCardProp;

  onResetHandler: () => void;
  onUpdateAnswerHandler: (answer: string) => void;
  onCheckAnswerHandler: () => void;
  onActionChange: (newValue: string | number) => void;
  isGameDone: boolean;
  action: string;
  total: number;
  remaining: number;
  nextButtonRef: RefObject<HTMLButtonElement | null>;

  answerButtonRef: RefObject<HTMLButtonElement | null>;
  answerInputRef: RefObject<HTMLInputElement | null>;
  isNextBtnDisabled: boolean;
  isCheckAnswerBtnDisabled: boolean;
  isAnswerInputDisabled: boolean;
}

export function useWriteCard(): WriteCardDataType {
  const dictContext = useContext(DictionaryContext);
  const { form } = dictContext;

  const [data, setData] = useState<WriteCardDataProp>(
    initializeWriteCard(form.wordPairs)
  );

  useEffect(() => {
    if (!form.wordPairs) return;

    setData(initializeWriteCard(form.wordPairs));
    getNextCardHandler(true);
  }, [form.wordPairs]);

  const writeCard = data.writingCurrCard;
  const isGameDone =
    data.wordPairs.length > 0 &&
    data.wordPairs.length === data.usedWords.length;

  let action = "next";
  if (isGameDone) {
    action = "reset";
  } else if (
    writeCard?.result === CardResultTypes.NO_ANSWER &&
    (writeCard?.answer === undefined || writeCard?.answer.trim().length > 0)
  ) {
    action = "check_answer";
  }

  const { nextButtonRef, answerButtonRef, answerInputRef } = useWriteBtnControl(
    {
      isRestartBtnInFocus: isGameDone,
      isNextBtnInFocus: action === "next",
      isAnswerInputInFocus: action === "answer",
    }
  );

  const getNextCardHandler = (needReset: boolean) => {
    setData((state) => {
      let allWordPairs = state.wordPairs;
      let usedWords = [...state.usedWords];

      if (needReset) {
        usedWords = [];
      } else {
        allWordPairs = allWordPairs.filter((w) => !usedWords.includes(w.id));
      }

      if (allWordPairs.length === 0) {
        return {
          ...state,
          writingCurrCard: undefined,
        };
      }

      const randomNumber = Math.floor(Math.random() * allWordPairs.length);
      const wordPair = allWordPairs[randomNumber];

      return {
        ...state,
        writingCurrCard: {
          word: wordPair,
          result: CardResultTypes.NO_ANSWER,
          answer: "",
        },
        usedWords: usedWords,
      };
    });
  };

  const onUpdateAnswerHandler = (answer: string) => {
    setData((state) => {
      if (!state.writingCurrCard) return state;

      return {
        ...state,
        writingCurrCard: {
          ...state.writingCurrCard,
          answer: answer,
        },
      };
    });
  };

  const onCheckAnswerHandler = () => {
    setData((state) => {
      if (!state.writingCurrCard) return state;

      const regex = new RegExp(
        String.raw`${state.writingCurrCard.word.translated_word_name
          .replace(/[\p{P}\p{S} ]/gu, "")
          .toLocaleLowerCase()}`,
        "g"
      );

      const isCorrectAnswer = state.writingCurrCard.answer
        ?.replace(/[\p{P}\p{S} ]/gu, "")
        .toLocaleLowerCase()
        .match(regex);

      let usedWords = [...state.usedWords];

      if (
        isCorrectAnswer &&
        !usedWords.includes(state.writingCurrCard.word.id)
      ) {
        usedWords = [...state.usedWords, state.writingCurrCard.word.id];
      }

      return {
        ...state,
        usedWords: usedWords,
        writingCurrCard: {
          ...state.writingCurrCard,
          result: isCorrectAnswer
            ? CardResultTypes.CORRECT
            : CardResultTypes.INCORRECT,
        },
      };
    });
  };

  const onResetHandler = () => {
    getNextCardHandler(true);
  };

  const onActionChange = (newValue: string | number) => {
    if (newValue === "next") {
      getNextCardHandler(false);
    } else if (newValue === "check_answer") {
      onCheckAnswerHandler();
    }
  };

  return {
    form,
    writeCard,
    onResetHandler,
    onUpdateAnswerHandler,
    onCheckAnswerHandler,
    onActionChange,
    isGameDone,
    action,
    total: data.wordPairs.length,
    remaining: data.wordPairs.length - data.usedWords.length,
    isNextBtnDisabled:
      writeCard?.result === CardResultTypes.NO_ANSWER ||
      data.usedWords.length === data.wordPairs.length,
    isCheckAnswerBtnDisabled:
      writeCard === undefined ||
      writeCard.result !== CardResultTypes.NO_ANSWER ||
      writeCard.answer === undefined ||
      writeCard.answer.trim().length === 0,
    isAnswerInputDisabled: writeCard?.result !== CardResultTypes.NO_ANSWER,
    nextButtonRef,
    answerButtonRef,
    answerInputRef,
  };
}

function initializeWriteCard(wordPairs?: WordPairsProp[]) {
  return {
    wordPairs: wordPairs || [],
    usedWords: [],
    flipped: false,
  } as WriteCardDataProp;
}
