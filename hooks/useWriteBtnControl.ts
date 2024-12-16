import { useEffect, useRef, RefObject } from "react";

export enum CardResultTypes {
  CORRECT = 0,
  INCORRECT = 1,
  NO_ANSWER = 2,
}

export function useWriteBtnControl({
  isRestartBtnInFocus,
  isNextBtnInFocus,
  isAnswerInputInFocus,
}: {
  isRestartBtnInFocus?: boolean;
  isNextBtnInFocus?: boolean;
  isAnswerInputInFocus?: boolean;
}): {
  nextButtonRef: RefObject<HTMLButtonElement | null>;
  restartButtonRef: RefObject<HTMLButtonElement | null>;
  answerButtonRef: RefObject<HTMLButtonElement | null>;
  answerInputRef: RefObject<HTMLInputElement | null>;
} {
  const nextButtonRef = useRef<HTMLButtonElement | null>(null);
  const answerButtonRef = useRef<HTMLButtonElement | null>(null);
  const restartButtonRef = useRef<HTMLButtonElement | null>(null);
  const answerInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    nextButtonRef?.current?.focus();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isRestartBtnInFocus) {
        restartButtonRef?.current?.focus();
      } else if (isAnswerInputInFocus) {
        answerInputRef?.current?.focus();
      } else if (isNextBtnInFocus) {
        nextButtonRef?.current?.focus();
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [isRestartBtnInFocus, isNextBtnInFocus, isAnswerInputInFocus]);

  return {
    nextButtonRef,
    restartButtonRef,
    answerButtonRef,
    answerInputRef,
  };
}
