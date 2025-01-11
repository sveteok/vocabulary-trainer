"use client";

import React, { useRef } from "react";

import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export interface RadioGroupType {
  id: string;
  name: string;
}

type InfoContainerProps = {
  id?: string;
  infoState?: InfoContainerStates;
  children: React.ReactNode;
  rippleEffectDisabled?: boolean;
};

export enum InfoContainerStates {
  ERROR = "error",
  INFO = "info",
  CORRECT = "correct",
}

export default function InfoContainer(props: InfoContainerProps) {
  const { id = "", infoState, children, rippleEffectDisabled = false } = props;

  const buttonRef = useRef<HTMLDivElement | null>(null);
  const rippleRef = useRef<HTMLSpanElement | null>(null);

  const animateClass = "animate-ripple-effect-active";

  const handleRippleEffect = (e: React.MouseEvent<HTMLInputElement>) => {
    const button = buttonRef.current;
    const ripple = rippleRef.current;

    if (!button || !ripple) return;

    const buttonRect = button?.getBoundingClientRect();
    const { left, top } = buttonRect;
    const leftPosition = e.clientX - left;
    const topPosition = e.clientY - top;

    ripple.style.left = leftPosition + "px";
    ripple.style.top = topPosition + "px";

    ripple.classList.add(animateClass);

    setTimeout(() => {
      ripple.classList.remove(animateClass);
    }, 600);
  };

  return (
    <div
      ref={buttonRef}
      key={`radio_group_option_content_${id}`}
      className={`relative flex justify-between p-4 rounded-md 
                border-2 border-natural-gray-100
                bg-natural-gray-50
                border-success
                mb-1 gap-4  cursor-pointer overflow-hidden
                data-[ripple-effect="disabled"]:cursor-auto     
                data-[state="error"]:text-error
                data-[state="error"]:border-error
                data-[state="correct"]:text-success
                data-[state="correct"]:border-success
                data-[state="info"]:border-natural-gray-100
                data-[state="info"]:text-natural-gray-900
                focus:outline-natural-gray-50 outline-natural-gray-50
                  `}
      onClick={rippleEffectDisabled === true ? undefined : handleRippleEffect}
      data-state={infoState}
      data-ripple-effect={rippleEffectDisabled === true && "disabled"}
    >
      <span
        ref={rippleRef}
        className={`w-[60px] h-[60px] bg-natural-gray-700  absolute rounded-full opacity-0`}
      ></span>
      {children}
      {infoState === InfoContainerStates.ERROR && (
        <CloseRoundedIcon
          className="h-6 w-6 text-error"
          key="radio_group_option_incorrect_icon"
        />
      )}
      {infoState === InfoContainerStates.CORRECT && (
        <DoneRoundedIcon
          className="h-6 w-6 flex-end text-success"
          key="radio_group_option_correct_icon"
        />
      )}
    </div>
  );
}
