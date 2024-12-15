"use client";

import React, { useContext } from "react";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";

import { DictionaryContext } from "@/store/dict-context";
import { useQuizeCard } from "@/app/hooks/useQuizeCard";
import { useQuizeBtnControl } from "@/app/hooks/useQuizeBtnControl";

import MainContainer from "@/app/ui/basis/mainContainer";
import QuizeRadioGroup from "@/app/ui/cards/quize/quizeRadioGroup";
import ProgressBar from "@/app/ui/basis/progressBar";
import Card from "@/app/ui/basis/card";
import GameOver from "@/app/ui/basis/gameOver";
import SubMenu from "@/app/ui/basis/sub-menu";

export const QuizeCards = () => {
  const dictContext = useContext(DictionaryContext);
  const { form } = dictContext;

  const {
    wordCard,
    getNextCardHandler,
    onSelectAnswerHandler,
    onResetHandler,
    isGameDone,
    isNextBtnDisabled,
    total,
    remaining,
  } = useQuizeCard({
    wordPairs: form.wordPairs,
  });

  const { nextButtonRef, restartButtonRef } = useQuizeBtnControl({
    isRestartBtnInFocus: isGameDone,
    isNextBtnInFocus: wordCard?.selectedWordId !== undefined,
  });

  const localization = form.localization?.[`${form.language}`];

  return (
    <>
      <SubMenu>
        <ProgressBar
          total={total}
          remaining={remaining}
          restart={onResetHandler}
          restartButtonRef={restartButtonRef}
          localization={form.localization}
        />
      </SubMenu>

      <MainContainer
        actions={[
          {
            label: form.localization?.next_page || "Next",
            icon: <NavigateNextRoundedIcon />,
            id: "next",
            disabled: isNextBtnDisabled,
            ref: nextButtonRef,
          },
        ]}
        value="next"
        handleOnChange={() => getNextCardHandler(false)}
      >
        <section
          aria-label="quize"
          className="flex flex-col content-end size-full"
        >
          {isGameDone ? (
            <GameOver />
          ) : (
            <>
              <Card
                id={wordCard?.word.word_id}
                name={wordCard?.word.word_name}
                hideDetails={true}
                className="min-h-[100px]"
              />
              <div className="flex flex-1">
                <QuizeRadioGroup
                  name="Answers"
                  options={wordCard?.answers}
                  correctAnswerId={wordCard?.word.translated_word_id}
                  value={wordCard?.selectedWordId || ""}
                  onSelect={onSelectAnswerHandler}
                  headText={
                    form.localization?.select_correct_translation ||
                    "Select the correct translation"
                  }
                />
              </div>
            </>
          )}
        </section>
      </MainContainer>
    </>
  );
};
