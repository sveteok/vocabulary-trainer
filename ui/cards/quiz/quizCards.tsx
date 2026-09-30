"use client";

import React, { useContext } from "react";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";

import { DictionaryContext } from "@/store/dict-context";
import { useQuizCard } from "@/hooks/useQuizCard";
import { useQuizBtnControl } from "@/hooks/useQuizBtnControl";

import MainContainer from "@/ui/basis/mainContainer";
import QuizRadioGroup from "@/ui/cards/quiz/quizRadioGroup";
import ProgressBar from "@/ui/basis/progressBar";
import Card from "@/ui/basis/card";
import GameOver from "@/ui/basis/gameOver";
import SubMenu from "@/ui/basis/subMenu";

export const QuizCards = () => {
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
  } = useQuizCard({
    wordPairs: form.wordPairs,
  });

  const { nextButtonRef } = useQuizBtnControl({
    isNextBtnInFocus: wordCard?.selectedWordId !== undefined,
  });

  return (
    <>
      <SubMenu>
        <ProgressBar
          total={total}
          remaining={remaining}
          restart={onResetHandler}
          showBackButton={true}
          pageName={form.localization?.quiz || "Quiz"}
          localization={form.localization}
        />
      </SubMenu>

      <MainContainer
        actions={[
          {
            label: wordCard?.word ? form.localization?.next_page || "" : "",
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
          aria-label="quiz"
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
                className="flex flex-1 min-h-[80px]"
              />
              <div className="flex ">
                <QuizRadioGroup
                  name="Answers"
                  options={wordCard?.answers}
                  correctAnswerId={wordCard?.word.translated_word_id}
                  value={wordCard?.selectedWordId || ""}
                  onSelect={onSelectAnswerHandler}
                  headText={
                    wordCard?.answers
                      ? form.localization?.select_correct_translation
                      : ""
                  }
                  isNextBtnDisabled={isNextBtnDisabled}
                />
              </div>
            </>
          )}
        </section>
      </MainContainer>
    </>
  );
};
