"use client";

import React, { useContext } from "react";

import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

import { DictionaryContext } from "@/store/dict-context";
import { useWriteCard } from "@/app/hooks/useWriteCard";
import { useWriteBtnControl } from "@/app/hooks/useWriteBtnControl";

import MainContainer from "@/app/ui/basis/mainContainer";
import ProgressBar from "@/app/ui/basis/progressBar";
import GameOver from "@/app/ui/basis/gameOver";
import SubMenu from "@/app/ui/basis/sub-menu";
import WriteCardInputContent from "@/app/ui/cards/write/writeCardInputContent";

export const WriteCards = () => {
  const dictContext = useContext(DictionaryContext);
  const { form } = dictContext;

  const {
    writeCard,
    onResetHandler,
    onUpdateAnswerHandler,
    onCheckAnswerHandler,
    onActionChange,
    isNextBtnDisabled,
    isCheckAnswerBtnDisabled,
    isGameDone,
    action,
    remaining,
    total,
    isAnswerInputDisabled,
  } = useWriteCard({
    wordPairs: form.wordPairs,
  });

  const { nextButtonRef, restartButtonRef, answerButtonRef, answerInputRef } =
    useWriteBtnControl({
      isRestartBtnInFocus: isGameDone,
      isNextBtnInFocus: action === "next",
      isAnswerInputInFocus: action === "answer",
    });

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
          {
            label: form.localization?.check_answer || "Check answer",
            icon: <CheckRoundedIcon />,
            id: "check_answer",
            disabled: isCheckAnswerBtnDisabled,
            ref: answerButtonRef,
          },
        ]}
        value={action}
        handleOnChange={onActionChange}
        className=""
      >
        {isGameDone && <GameOver />}

        {!isGameDone && (
          <WriteCardInputContent
            writeCard={writeCard}
            onUpdateAnswerHandler={onUpdateAnswerHandler}
            onCheckAnswerHandler={onCheckAnswerHandler}
            answerInputRef={answerInputRef}
            isAnswerInputDisabled={isAnswerInputDisabled}
            localization={form.localization}
          />
        )}
      </MainContainer>
    </>
  );
};
