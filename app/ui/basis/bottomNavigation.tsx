"use client";

import { RefObject } from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

export interface bottomNavigationActionType {
  id: string;
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
  ref?: RefObject<HTMLButtonElement | null>;
}

export default function bottomNavigation({
  actions,
  value = 0,
  handleOnChange,
}: {
  actions: bottomNavigationActionType[];
  value?: number | string;
  handleOnChange: (newValue: number) => void;
}) {
  return (
    <BottomNavigation
      showLabels
      value={value}
      onChange={(event, newValue) => {
        handleOnChange(newValue);
      }}
      color="primary"
    >
      {actions.map((action) => (
        <BottomNavigationAction
          label={action.label}
          icon={action.icon}
          key={action.id}
          value={action.id}
          disabled={action.disabled}
          focusRipple={true}
          ref={action.ref}
        />
      ))}
    </BottomNavigation>
  );
}
