"use client";

import React, { useContext } from "react";
import { AnimatePresence } from "framer-motion";

import { DictionaryContext } from "@/store/dict-context";
import {
  useMatchCard,
  PlayingBlockProp,
  CardTypes,
  CardResultTypes,
} from "@/app/hooks/useMatchCard";

import ProgressBar from "@/app/ui/basis/progressBar";
import MatchWordCard from "@/app/ui/cards/match/matchWordCard";
import SubMenu from "@/app/ui/basis/sub-menu";
import GameOver from "@/app/ui/basis/gameOver";

export const MemoryCards = () => {
  const dictContext = useContext(DictionaryContext);
  const { form } = dictContext;

  const {
    data,
    isGameDone,
    onCardClickHandler,
    onResetHandler,
    restartButtonRef,
    total,
    remaining,
    correct,
  } = useMatchCard({ wordPairs: form.wordPairs });

  const localization = form.localization?.[`${form.language}`];

  return (
    <>
      <SubMenu>
        <ProgressBar
          total={total}
          remaining={remaining}
          correct={correct}
          restart={onResetHandler}
          restartButtonRef={restartButtonRef}
          localization={{
            ...form.localization,
            correct: form.localization?.learnt || "Learnt",
          }}
        />
      </SubMenu>
      <section
        aria-label="match cards"
        className="flex flex-1 p-5 size-full bg-[#dcd5cd]"
      >
        {isGameDone ? (
          <GameOver />
        ) : (
          <MemoryCardsBlock
            data={data.currentPlayingBlock}
            handleCardClick={onCardClickHandler}
          />
        )}
      </section>
    </>
  );
};

const MemoryCardsBlock = ({
  data,
  handleCardClick,
}: {
  data: PlayingBlockProp | undefined;
  handleCardClick: (
    word_id: string,
    index: string,
    card_type: CardTypes
  ) => void;
}) => {
  return (
    <div className="grid grid-rows-5 p-2 grid-flow-col grid-cols-2 size-full gap-4 justify-items-stretch space-evenly overflow-x-hidden">
      <AnimatePresence initial={true}>
        {data?.words.map((card, index) => {
          if (!card) return <MatchWordCard key={`word_${index}`} />;

          return (
            <MatchWordCard
              key={`word_${index}`}
              translated_name={card.name}
              word_id={card.id}
              index={card.index}
              cardType={CardTypes.CARD}
              isSelected={
                card.result !== CardResultTypes.CORRECT &&
                card.id == data?.currentWord?.id &&
                card.index == data?.currentWord?.index
              }
              result={card.result}
              onClick={handleCardClick}
            />
          );
        })}

        {data?.translatedWords.map((card, index) => {
          if (!card) return <MatchWordCard key={`translated_word_${index}`} />;

          return (
            <MatchWordCard
              key={`translated_word_${index}`}
              translated_name={card.name}
              word_id={card.id}
              index={card.index}
              cardType={CardTypes.TRANSLATED_CARD}
              isSelected={
                card.result !== CardResultTypes.CORRECT &&
                card.id == data?.currentTranslatedWord?.id &&
                card.index == data?.currentTranslatedWord?.index
              }
              result={card.result}
              onClick={handleCardClick}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
};
