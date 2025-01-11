"use client";

import { useRef, RefObject } from "react";

type RippleButtonProps = {
  id?: string;
  title?: string;
  children: React.ReactNode;
  disabled?: boolean;
  value?: number | string;
  handleOnClcik: (newValue: number | string) => void;
  buttonRef?: RefObject<HTMLButtonElement | null>;
};

const RippleButton: React.FC<RippleButtonProps> = (props) => {
  const {
    id = "",
    title = "",
    children,
    disabled = false,
    value,
    handleOnClcik,
    buttonRef,
  } = props;

  const rippleRef = useRef<HTMLSpanElement | null>(null);

  const animateClass = "animate-ripple-effect-active";

  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (disabled === true) return;

    handleOnClcik(e.currentTarget.value);

    handleRippleEffect(e.clientX, e.clientY);
  };

  const handleOnFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleRippleEffect(undefined, undefined);
  };

  const handleRippleEffect = (
    clientX: number | undefined,
    clientY: number | undefined
  ) => {
    if (disabled === true) return;

    const button = buttonRef?.current;
    const ripple = rippleRef.current;

    if (!button || !ripple) return;

    const buttonRect = button?.getBoundingClientRect();
    const { left, top, width, height } = buttonRect;

    let leftPosition, topPosition;
    if (clientX === undefined || clientX === 0) {
      leftPosition = width / 2;
    } else {
      leftPosition = clientX - left;
    }

    if (clientY === undefined || clientY === 0) {
      topPosition = height / 2;
    } else {
      topPosition = clientY - top;
    }

    ripple.style.left = leftPosition + "px";
    ripple.style.top = topPosition + "px";

    ripple.classList.add(animateClass);

    setTimeout(() => {
      ripple.classList.remove(animateClass);
    }, 600);
  };

  return (
    <button
      title={title}
      id={id}
      value={value}
      onClick={handleOnClick}
      onFocus={handleOnFocus}
      ref={buttonRef}
      disabled={disabled}
      className={`relative overflow-hidden flex flex-1 justify-center items-center
                  border-2 border-natural-gray-100 rounded-full 
                  bg-natural-gray-900 text-natural-gray-50
                  hover:border-natural-gray-100
                  hover:text-white
                  hover:bg-natural-gray-600
                  hover:cursor-pointer
                  disabled:opacity-25
                  outline-none
                  enabled:pointer-events-auto
                  pointer-events-none
                  focus:pointer-events-auto focus:ring-current focus:outline-natural-gray-50
                `}
    >
      <span
        ref={rippleRef}
        className={`w-[60px] h-[60px] overflow-hidden bg-[rgba(223,229,228,0.01)]  absolute rounded-full opacity-0`}
      ></span>
      <div className="flex hover:cursor-pointer gap-2 items-center p-4">
        {children}
      </div>
    </button>
  );
};

export default RippleButton;
