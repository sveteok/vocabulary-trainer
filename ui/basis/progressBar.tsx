import { useRouter } from "next/navigation";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";

import { RestartGame } from "@/ui/basis/restartGame";
import { LocalizationProps } from "@/lib/definitions";

export interface ProgressBarLocalizationProp {
  [key: string]: string;
}

interface ProgressBarProps {
  showBackButton: boolean;
  pageName: string;
  total: number;
  remaining: number;
  restart?: () => void;
  localization?: LocalizationProps;
}

export default function ProgressBar(props: ProgressBarProps) {
  const { total, remaining, restart, showBackButton, pageName, localization } =
    props;
  const router = useRouter();

  return (
    <div className=" flex justify-between gap-2 items-center   ">
      <div className="flex  justify-start gap-2 items-center ">
        {showBackButton && (
          <IconButton
            aria-label="more"
            onClick={() => router.back()}
            aria-controls="back-button"
          >
            <ArrowBackIcon />
          </IconButton>
        )}
        <p className="hidden md:block">
          {`${localization?.training_mode || "Training mode"} "${pageName}"`}
        </p>
        <p className="block md:hidden text-sm">{pageName}</p>
      </div>

      <div className="flex  justify-end gap-2  items-center text-sm md:text-current">
        {`${Math.floor(100 - (remaining / total) * 100) || 0} % ${
          localization?.ready || "ready"
        }`}

        {restart && (
          <RestartGame restart={restart} localization={localization} />
        )}
      </div>
    </div>
  );
}
