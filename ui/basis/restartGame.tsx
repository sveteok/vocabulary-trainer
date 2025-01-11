import { ReactElement, useState } from "react";

import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { LocalizationProps } from "@/lib/definitions";

interface MenuOptionsProp {
  id: string;
  element: ReactElement;
}

export const RestartGame = ({
  localization,
  restart,
}: {
  restart?: () => void;
  localization?: LocalizationProps;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const MenuOptions: MenuOptionsProp[] = [
    {
      id: "restart",
      element: (
        <div
          className="flex justify-start items-center gap-4 text-sm"
          id="option_restart"
        >
          <RestartAltRoundedIcon />
          <span>{localization?.restart || "Restart"}</span>
        </div>
      ),
    },
  ];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);

  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton
        aria-label="more"
        onClick={handleClick}
        aria-controls={open ? "sub-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} onClose={handleClose} open={open}>
        {MenuOptions.map((option: MenuOptionsProp) => (
          <MenuItem
            key={option.id}
            id={option.id}
            onClick={() => {
              if (restart) restart();
              handleClose();
            }}
          >
            {option.element}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
