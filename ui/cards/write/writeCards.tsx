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
    form,
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
    nextButtonRef,
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
          showBackButton={true}
          pageName={form.localization?.writing || "Writing"}
          localization={form.localization}
        />
      </SubMenu>
      <MainContainer
        actions={[
          {
            label:
              (form.language &&
                form.translation_language &&
                form.localization?.next_page) ||
              "",
            icon: <NavigateNextRoundedIcon />,
            id: "next",
            disabled: isNextBtnDisabled,
            ref: nextButtonRef,
          },
          {
            label:
              (form.language &&
                form.translation_language &&
                form.localization?.check_answer) ||
              "",
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
            writeCard={
              form.language && form.translation_language ? writeCard : undefined
            }
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
