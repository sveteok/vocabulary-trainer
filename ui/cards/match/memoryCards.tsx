"use client";

import React, { useContext } from "react";

import { DictionaryContext } from "@/store/dict-context";
import { useMatchCard } from "@/hooks/useMatchCard";

import ProgressBar from "@/ui/basis/progressBar";
import SubMenu from "@/ui/basis/subMenu";
import GameOver from "@/ui/basis/gameOver";

import MemoryCardsBlock from "@/ui/cards/match/memoryCardsBlock";

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
