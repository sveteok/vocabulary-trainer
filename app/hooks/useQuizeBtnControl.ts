import { useEffect, useRef, RefObject } from "react";

export function useQuizeBtnControl({
  isRestartBtnInFocus,
  isNextBtnInFocus,
}: {
  isRestartBtnInFocus?: boolean;
  isNextBtnInFocus?: boolean;
}): {
  nextButtonRef: RefObject<HTMLButtonElement | null>;
  restartButtonRef: RefObject<HTMLButtonElement | null>;
} {
  const nextButtonRef = useRef<HTMLButtonElement | null>(null);
  const restartButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    nextButtonRef?.current?.focus();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isRestartBtnInFocus) {
        restartButtonRef?.current?.focus();
      } else if (isNextBtnInFocus) {
        nextButtonRef?.current?.focus();
      }
    }, 400);

    return () => {
      clearTimeout(timeout);
    };
  }, [isRestartBtnInFocus, isNextBtnInFocus]);

  return {
    nextButtonRef,
    restartButtonRef,
  };
}
