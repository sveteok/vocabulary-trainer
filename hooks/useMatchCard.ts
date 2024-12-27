import { useCallback, useEffect, useState, useRef, RefObject } from "react";
import { WordPairsProp } from "@/lib/definitions";
import { shuffleObjects } from "@/lib/utils";

export enum CardTypes {
  CARD = 0,
  TRANSLATED_CARD = 1,
}

export enum CardResultTypes {
  CORRECT = 0,
  INCORRECT = 1,
  NO_ANSWER = 2,
}

export interface MatchWordProp {
  id: string;
  index: string;
  card_id: string;
  name: string;
  translatedWordId: string;
  result: CardResultTypes;
}

export interface PlayingBlockProp {
  blockId: number;
  words: (MatchWordProp | undefined)[];
  translatedWords: (MatchWordProp | undefined)[];
  currentWord: MatchWordProp | null;
  currentTranslatedWord: MatchWordProp | null;
}

interface MatchCardProp {
  id: string;
  card: WordPairsProp;
  wasUsed?: boolean;
}

interface PlayingBlocksProp {
  [id: number | string]: MatchCardProp[] | number;
}

export interface MatchCardDataProp {
  wordPairs: WordPairsProp[];
  usedWords: string[];
  playingBlocks?: PlayingBlocksProp;
  currentPlayingBlock?: PlayingBlockProp;
  flipped?: boolean;
}

interface MatchCardsDataProp {
  data: MatchCardDataProp;
  getNextCardHandler: (needReset: boolean) => void;
  onResetHandler: () => void;
  onCardClickHandler: (
    word_id: string,
    index: string,
    card_type: CardTypes
  ) => void;
  isGameDone: boolean;
  restartButtonRef: RefObject<HTMLButtonElement | null>;
  total: number;
  remaining: number;
  correct: number;
}

export function useMatchCard({
  wordPairs,
}: {
  wordPairs?: WordPairsProp[];
}): MatchCardsDataProp {
  const [data, setData] = useState<MatchCardDataProp>(
    initializeMatchCard(wordPairs)
  );

  useEffect(() => {
    if (!wordPairs) return;
    setData(initializeMatchCard(wordPairs));
  }, [wordPairs]);

  const getNextCardHandler = useCallback((needReset: boolean): void => {
    setData((state) => {
      let currState = state;

      if (needReset) {
        currState = initializeMatchCard(state.wordPairs);
        return currState;
      }

      const playingBlocks: PlayingBlocksProp | undefined = {
        ...currState.playingBlocks,
      };

      if (!playingBlocks) return state;

      let currentPlayingBlock;

      if (currState.currentPlayingBlock === undefined) {
        currentPlayingBlock = {
          blockId: -1,
          words: Array(5).fill(undefined),
          translatedWords: Array(5).fill(undefined),
          currentWord: null,
          currentTranslatedWord: null,
        };
      } else {
        currentPlayingBlock = { ...currState.currentPlayingBlock };
      }

      let { empty, learnt }: { empty: number[]; learnt: number[] } =
        getAllUnusedIndexes(currentPlayingBlock?.words || []);

      if (empty.length + learnt.length < BLOCK_WORD_NUMBER) {
        return currState;
      }

      if (learnt.length === BLOCK_WORD_NUMBER) {
        return {
          ...currState,
          currentPlayingBlock: {
            ...currentPlayingBlock,
            words: Array(5).fill(undefined),
            translatedWords: Array(5).fill(undefined),
            currentWord: null,
            currentTranslatedWord: null,
          },
        };
      }

      const blockId = currentPlayingBlock?.blockId + 1;
      let block: MatchCardProp[] = playingBlocks[blockId] as MatchCardProp[];

      if (!block) return currState;

      let words: MatchWordProp[] = [];
      let translatedWords: MatchWordProp[] = [];
      block.map((b, i) => {
        words.push({
          id: b.card.word_id,
          index: `w_${i}`,
          card_id: b.id,
          name: b.card.word_name,
          translatedWordId: b.card.translated_word_id,
          result: CardResultTypes.NO_ANSWER,
        });

        translatedWords.push({
          id: b.card.translated_word_id,
          index: `tw_${i}`,
          card_id: b.id,
          name: b.card.translated_word_name,
          translatedWordId: b.card.word_id,
          result: CardResultTypes.NO_ANSWER,
        });
      });

      currentPlayingBlock = {
        ...currentPlayingBlock,
        blockId: blockId,
        words: shuffleObjects(words) as MatchWordProp[],
        translatedWords: shuffleObjects(translatedWords) as MatchWordProp[],
      };

      return { ...currState, currentPlayingBlock: currentPlayingBlock };
    });
  }, []);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    timeoutId = setTimeout(() => {
      getNextCardHandler(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [data.currentPlayingBlock?.words, getNextCardHandler]);

  const onCardClickHandler = useCallback(
    (word_id: string, index: string, card_type: CardTypes): void => {
      setData((state) => {
        if (!state || !state.currentPlayingBlock) return state;

        let usedWords = state.usedWords;
        let playingBlocks = state.playingBlocks;
        let currentPlayingBlock = { ...state.currentPlayingBlock };

        let currentCard = currentPlayingBlock.currentWord;
        let currentTranslatedCard = currentPlayingBlock.currentTranslatedWord;
        let words = currentPlayingBlock.words;
        let translatedWords = currentPlayingBlock.translatedWords;

        let currentWordId = currentCard?.id;
        let currentTranslatedWordId = currentTranslatedCard?.id;
        let wordIndex = currentCard?.index;
        let translatedWordIndex = currentTranslatedCard?.index;

        if (currentCard === null && currentTranslatedCard === null) {
          words = words.map((el) => {
            if (el?.result === CardResultTypes.INCORRECT) {
              return { ...el, result: CardResultTypes.NO_ANSWER };
            }
            return el;
          });

          translatedWords = translatedWords.map((el) => {
            if (el?.result === CardResultTypes.INCORRECT) {
              return { ...el, result: CardResultTypes.NO_ANSWER };
            }
            return el;
          });
        }

        if (card_type === CardTypes.CARD) {
          currentWordId = word_id;
          wordIndex = index;
          currentCard =
            words.find(
              (el) => el?.id === currentWordId && el?.index === index
            ) || null;
        } else {
          currentTranslatedWordId = word_id;
          translatedWordIndex = index;
          currentTranslatedCard =
            translatedWords.find(
              (el) => el?.id === currentTranslatedWordId && el?.index === index
            ) || null;
        }

        let correctCardId: string | null = null;

        if (
          wordIndex !== undefined &&
          currentWordId &&
          currentTranslatedWordId
        ) {
          words = words.map((w: MatchWordProp | undefined, i: number) => {
            if (w && w.index === wordIndex && correctCardId === null) {
              if (w.translatedWordId === currentTranslatedWordId) {
                correctCardId = w.card_id;
                w.result = CardResultTypes.CORRECT;
              } else {
                w.result = CardResultTypes.INCORRECT;
              }
            } else if (w && w.result !== CardResultTypes.CORRECT) {
              w.result = CardResultTypes.NO_ANSWER;
            }
            return w;
          });
        }

        if (
          translatedWordIndex !== undefined &&
          currentWordId &&
          currentTranslatedWordId
        ) {
          translatedWords = translatedWords.map(
            (w: MatchWordProp | undefined, i: number) => {
              if (w && w.index === translatedWordIndex) {
                if (w.translatedWordId === currentWordId) {
                  w.result = CardResultTypes.CORRECT;
                } else {
                  w.result = CardResultTypes.INCORRECT;
                }
              } else if (w && w.result !== CardResultTypes.CORRECT) {
                w.result = CardResultTypes.NO_ANSWER;
              }
              return w;
            }
          );
        }

        if (currentWordId !== undefined && correctCardId !== null) {
          let notUsed = false;

          playingBlocks = { ...state.playingBlocks };
          const len = playingBlocks.length
            ? (playingBlocks.length as number)
            : 0;

          for (let i = 0; i < len; i++) {
            playingBlocks[i] = (playingBlocks[i] as MatchCardProp[]).map(
              (b) => {
                if (b.id === correctCardId) {
                  b.wasUsed = true;
                }
                if (!b.wasUsed && b.card.word_id === currentCard?.id) {
                  notUsed = true;
                }
                return b;
              }
            );
          }
          if (!notUsed && !usedWords.includes(currentWordId))
            usedWords = [...usedWords, currentWordId];
        }

        if (currentWordId && currentTranslatedWordId) {
          currentTranslatedCard = null;
          currentCard = null;
        }

        return {
          ...state,
          playingBlocks: playingBlocks,
          usedWords: usedWords,
          currentPlayingBlock: {
            ...state.currentPlayingBlock,
            words: words,
            translatedWords: translatedWords,
            currentWord: currentCard,
            currentTranslatedWord: currentTranslatedCard,
          },
        };
      });
    },
    []
  );

  const onResetHandler = () => getNextCardHandler(true);

  const isGameDone =
    data.wordPairs.length !== 0 &&
    data.wordPairs.length === data.usedWords.length;

  const restartButtonRef = useRef<HTMLButtonElement | null>(null);

  return {
    data,
    getNextCardHandler,
    onResetHandler,
    onCardClickHandler,
    isGameDone,
    restartButtonRef,
    total: data.wordPairs.length,
    remaining: data.wordPairs.length - data.usedWords.length,
    correct: data.usedWords.length,
  };
}

function initializeMatchCard(wordPairs?: WordPairsProp[]) {
  if (!wordPairs)
    return {
      wordPairs: [],
      usedWords: [],
      playingBlocks: {},
      currentPlayingBlock: {
        blockId: -1,
        words: Array(5).fill(undefined),
        translatedWords: Array(5).fill(undefined),
        currentWord: null,
        currentTranslatedWord: null,
      },
      flipped: false,
    } as MatchCardDataProp;

  const playingCards = generatePlayingCards([...wordPairs]);
  const playingBlocks: PlayingBlocksProp = generatePlayingBlocks(playingCards);

  return {
    wordPairs: wordPairs,
    usedWords: [],
    playingBlocks: playingBlocks,
    currentPlayingBlock: {
      blockId: -1,
      words: Array(5).fill(undefined),
      translatedWords: Array(5).fill(undefined),
      currentWord: null,
      currentTranslatedWord: null,
    },
    flipped: false,
  } as MatchCardDataProp;
}

const generatePlayingCards = (words: WordPairsProp[]) => {
  let playingCards: MatchCardProp[] = [];

  const numberNewCard = Math.ceil((words.length * 2) / 10) * 10;

  let i = 1;
  while (i <= numberNewCard) {
    words.map((w: WordPairsProp) => {
      if (i > numberNewCard) return;
      playingCards.push({
        id: `${i}`,
        card: w,
        wasUsed: false,
      } as MatchCardProp);
      i++;
    });
  }
  return playingCards;
};

const BLOCK_WORD_NUMBER = 5;

const getAllUnusedIndexes = (
  arr: (MatchWordProp | undefined)[]
): { empty: number[]; learnt: number[] } => {
  return arr?.reduce(
    (prev, w, i) => {
      if (w === undefined) {
        prev.empty.push(i);
      }
      if (w?.result === CardResultTypes.CORRECT) {
        prev.learnt.push(i);
      }

      return prev;
    },
    { empty: [], learnt: [] } as { empty: number[]; learnt: number[] }
  );
};

const generatePlayingBlocks = (
  playingCards: MatchCardProp[]
): PlayingBlocksProp => {
  let playingBlocks: PlayingBlocksProp = {};
  let cards = playingCards;
  let len = Math.ceil(cards.length / BLOCK_WORD_NUMBER);
  playingBlocks["length"] = len;
  for (let i = 0; i < len; i++) {
    playingBlocks[i] = cards.slice(
      i * BLOCK_WORD_NUMBER,
      i * BLOCK_WORD_NUMBER + BLOCK_WORD_NUMBER
    );
  }

  return playingBlocks;
};
