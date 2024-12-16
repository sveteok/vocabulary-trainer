"use client";

import { useState, useEffect, useRef, RefObject } from "react";

import { WordPairsProp } from "@/lib/definitions";

interface SlideShowDataProp {
  cardsState: WordCardsStateProp;
  pageCount: number;
  isNextButtonDisabled: boolean;
  isPrevButtonDisabled: boolean;
  revertHandler: () => void;
  paginateHandler: (newDirection: number) => void;
  restartHandler: () => void;
  restartButtonRef: RefObject<HTMLButtonElement | null>;
}

interface WordCardsHashTable {
  [key: number | string]: WordPairsProp | number;
}

export interface WordCardsStateProp {
  wordPairsHashTable: WordCardsHashTable;
  page: number;
  direction: number;
  doReverseCards: boolean;
}

const initWordCardsStateData = (words: WordPairsProp[] | undefined) => {
  if (!words)
    return {
      wordPairsHashTable: {},
      page: 0,
      direction: 0,
      doReverseCards: false,
    };

  const wordPairs: WordCardsHashTable = words.reduce(
    (acc, curr, i: number) => ((acc[i as number] = curr), acc),
    {} as WordCardsHashTable
  );
  wordPairs["length"] = words.length | 0;

  return {
    wordPairsHashTable: wordPairs,
    page: 0,
    direction: 0,
    doReverseCards: false,
  };
};

export function useSlideShow({
  wordPairs,
}: {
  wordPairs?: WordPairsProp[];
}): SlideShowDataProp {
  const [wordCardsState, setWordCardsState] = useState<WordCardsStateProp>(
    initWordCardsStateData(wordPairs)
  );

  const restartButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!wordPairs) return;

    setWordCardsState(initWordCardsStateData(wordPairs));
  }, [wordPairs]);

  const paginateHandler = (newDirection: number) => {
    setWordCardsState((prev) => {
      return {
        ...prev,
        page: prev.page + newDirection,
        direction: newDirection,
      };
    });
  };

  const restartHandler = () => {
    setWordCardsState((prev) => {
      return { ...prev, page: 0, direction: -1, doReverseCards: false };
    });
  };

  const revertHandler = () => {
    setWordCardsState((prev) => {
      return { ...prev, doReverseCards: !prev.doReverseCards };
    });
  };

  if (Object.keys(wordCardsState.wordPairsHashTable).length === 0)
    return {
      cardsState: wordCardsState,
      pageCount: 0,
      paginateHandler,
      restartHandler,
      revertHandler,
      isNextButtonDisabled: true,
      isPrevButtonDisabled: true,
      restartButtonRef,
    };

  const pageCount = wordCardsState.wordPairsHashTable.length as number;

  const isNextButtonDisabled =
    wordCardsState.page >=
    (wordCardsState.wordPairsHashTable.length as number) - 1;

  const isPrevButtonDisabled = wordCardsState.page <= 0;

  return {
    cardsState: wordCardsState,
    pageCount: pageCount,
    paginateHandler,
    restartHandler,
    revertHandler,
    isNextButtonDisabled,
    isPrevButtonDisabled,
    restartButtonRef,
  };
}
