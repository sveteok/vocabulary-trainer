"use client";

import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

import { useWriteCard } from "@/hooks/useWriteCard";

import MainContainer from "@/ui/basis/mainContainer";
import ProgressBar from "@/ui/basis/progressBar";
import GameOver from "@/ui/basis/gameOver";
import SubMenu from "@/ui/basis/subMenu";
import WriteCardInputContent from "@/ui/cards/write/writeCardInputContent";

export const WriteCards = () => {
  const {
    writeCard,
    localization,
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
    nextButtonRef,
    restartButtonRef,
    answerButtonRef,
    answerInputRef,
  } = useWriteCard();

  return (
    <>
      <SubMenu>
        <ProgressBar
          total={total}
          remaining={remaining}
          restart={onResetHandler}
          restartButtonRef={restartButtonRef}
          localization={localization}
        />
      </SubMenu>
      <MainContainer
        actions={[
          {
            label: localization?.next_page || "Next",
            icon: <NavigateNextRoundedIcon />,
            id: "next",
            disabled: isNextBtnDisabled,
            ref: nextButtonRef,
          },
          {
            label: localization?.check_answer || "Check answer",
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
            localization={localization}
          />
        )}
      </MainContainer>
    </>
  );
};
