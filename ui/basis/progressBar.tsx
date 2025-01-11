import { useRouter } from "next/navigation";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";

import { RestartGame } from "@/ui/basis/restartGame";

export interface ProgressBarLocalizationProp {
  [key: string]: string;
}

interface ProgressBarProps {
  showBackButton: boolean;
  pageName: string;
  total: number;
  remaining: number;
  restart?: () => void;
}

export default function ProgressBar(props: ProgressBarProps) {
  const { total, remaining, restart, showBackButton, pageName } = props;
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
        {pageName}
      </div>

      <div className="flex  justify-end gap-2  items-center">
        {`${Math.floor(100 - (remaining / total) * 100) || 0} % ready`}

        {restart && <RestartGame restart={restart} />}
      </div>
    </div>
  );
}
