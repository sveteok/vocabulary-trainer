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
      className={`relative flex sitems-center justify-between p-4 rounded-md border-2 border-grey-500 mb-1 gap-4  cursor-pointer overflow-hidden
                  data-[ripple-effect="disabled"]:cursor-auto        
                  data-[state="error"]:bg-red-50
                  data-[state="error"]:text-[#ff355e] 
                  data-[state="error"]:border-[#ff355e] 
                  data-[state="correct"]:bg-green-50 
                  data-[state="correct"]:text-[#009966] 
                  data-[state="correct"]:border-[#009966] 
                  data-[state="info"]:bg-[#f8f7f5]
                  data-[state="info"]:border-[#87837e] 
                  data-[state="info"]:text-[#232a32]
                  `}
      onClick={rippleEffectDisabled === true ? undefined : handleRippleEffect}
      data-state={infoState}
      data-ripple-effect={rippleEffectDisabled === true && "disabled"}
    >
      <span
        ref={rippleRef}
        className={`w-[60px] h-[60px] bg-gray-700  absolute rounded-full opacity-0`}
      ></span>
      {children}
      {infoState === InfoContainerStates.ERROR && (
        <CloseRoundedIcon
          className="h-6 w-6 text-[#ff355e]"
          key="radio_group_option_incorrect_icon"
        />
      )}
      {infoState === InfoContainerStates.CORRECT && (
        <DoneRoundedIcon
          className="h-6 w-6 flex-end text-[#009966]"
          key="radio_group_option_correct_icon"
        />
      )}
    </div>
  );
}
