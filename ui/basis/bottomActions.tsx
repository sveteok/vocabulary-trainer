"use client";

import { RefObject } from "react";

import RippleButton from "@/ui/basis/rippleButton";

export interface bottomActionsType {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  ref?: RefObject<HTMLButtonElement | null>;
}

export default function bottomActions({
  actions,
  handleOnChange,
}: {
  actions: bottomActionsType[];
  handleOnChange: (newValue: number | string) => void;
}) {
  return (
    <div className="flex gap-4  justify-center p-4 relative ">
      {actions.map((action) => (
        <RippleButton
          key={action.id}
          value={action.id}
          disabled={action.disabled}
          buttonRef={action.ref}
          handleOnClcik={handleOnChange}
        >
          {action.icon}
          <label className="hover:cursor-pointer">{action.label}</label>
        </RippleButton>
      ))}
    </div>
  );
}
