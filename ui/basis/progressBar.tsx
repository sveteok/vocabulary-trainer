import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import { LocalizationProps } from "@/lib/definitions";
export interface ProgressBarLocalizationProp {
  [key: string]: string;
}

interface ProgressBarProps {
  total: number;
  remaining: number;
  correct?: number;
  incorrect?: number;
  restart?: () => void;
  restartButtonRef?: React.MutableRefObject<HTMLButtonElement | null>;
  localization?: LocalizationProps;
}

export default function ProgressBar(props: ProgressBarProps) {
  const {
    total,
    remaining,
    correct,
    incorrect,
    restart,
    restartButtonRef,
    localization,
  } = props;

  return (
    <div className=" flex items-center justify-between gap-2 mx-5">
      <div className="">
        {localization?.total || "Total"}: {total}
      </div>
      {correct !== undefined && (
        <div className="text-[#008000]">
          {localization?.correct || "Correct"}: {correct}
        </div>
      )}
      {incorrect !== undefined && (
        <div className="text-[#6a0bbd]">
          {localization?.incorrect || "Incorrect"}: {incorrect}
        </div>
      )}
      <div className="">
        {localization?.remaining || "Remaining"}: {remaining}
      </div>

      {restart && (
        <div>
          <button
            title={localization?.restart || "Restart"}
            onClick={restart}
            ref={restartButtonRef}
            className="flex flex-row gap-2 px-2 items-center hover:cursor-pointer focus-visible:ring focus:ring-1 focus:outline-blue-700 focus:rounded-md"
          >
            <RestartAltRoundedIcon />
            <span className="hidden md:block text-sm">
              {localization?.restart || "Restart"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
