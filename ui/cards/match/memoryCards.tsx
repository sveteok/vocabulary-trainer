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

  const { data, isGameDone, onCardClickHandler, onResetHandler } = useMatchCard(
    { wordPairs: form.wordPairs }
  );

  return (
    <>
      <SubMenu>
        <ProgressBar
          total={data.total}
          remaining={data.remaining}
          restart={onResetHandler}
          showBackButton={true}
          pageName="Match Game"
        />
      </SubMenu>
      <section aria-label="match cards" className="flex flex-1 p-5 size-full ">
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
