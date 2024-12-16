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
      className={`relative overflow-hidden flex flex-1 justify-center items-center  p-2  gap-2
       border-2 border-[#32302f] rounded-full 
      bg-[#87837e] text-[#fff]
      focus:pointer-events-auto
      enabled:pointer-events-auto
      pointer-events-none
      hover:border-[#414f4d] hover:text-[#414f4d] hover:bg-[#d5cddc] hover:cursor-pointer
      active:bg-[#87837e] active:text-[#fff]
      disabled:bg-gray-300 disabled:opacity-25
      outline-none
      `}
    >
      <span
        ref={rippleRef}
        className={`w-[60px] h-[60px] overflow-hidden bg-[rgba(223,229,228,0.01)]  absolute rounded-full opacity-0`}
      ></span>
      <div className="hover: cursor-pointer">{children}</div>
    </button>
  );
};

export default RippleButton;
