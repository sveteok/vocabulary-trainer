import { Checkbox } from "@mui/material";
import { WordPairsProp, LocalizationProps } from "@/lib/definitions";

const WordRow = ({
  item,
  canSelectMoreWords,
  onChangeWordSelectState,
  localization,
}: {
  item: WordPairsProp;
  canSelectMoreWords: boolean;
  onChangeWordSelectState: (id: string, checked: boolean) => void;
  localization?: LocalizationProps;
}) => {
  return (
    <div
      key={item.id}
      className={`flex flex-row items-center border-b border-natural-gray-700 overflow-auto`}
    >
      <div className="flex flex-1 flex-col gap-0 m-0 p-0">
        <div> {item.word_name}</div>
        <div className="text-natural-gray-700 text-sm">
          {item.translated_word_name}
        </div>
      </div>
      <div className="flex-end">
        <span className="opacity-20 text-natural-gray-400">
          {item.learned
            ? localization?.learned || "learned word"
            : localization?.new_word || "new word"}
        </span>
        <Checkbox
          checked={item.selected === undefined ? false : item.selected}
          value={item.id}
          id={item.id}
          aria-label="select words to study"
          {...{ inputProps: { "aria-label": "word checkbox" } }}
          disabled={!canSelectMoreWords && !item.selected}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement>,
            checked: boolean
          ) => {
            onChangeWordSelectState(item.id, checked);
          }}
          onKeyUp={(e: React.KeyboardEvent<HTMLButtonElement>) => {
            if (e.key === "Enter" && document.activeElement?.id === item.id) {
              (document.activeElement as HTMLElement).click();
            }
          }}
          sx={{
            color: "var(--data-color)",
            "&.Mui-checked": {
              color: "var(--data-color)",
            },
            "&.Mui-disabled": {
              pointerEvents: "auto",
              "&:hover": {
                backgroundColor: "transparent",
              },
              cursor: "not-allowed",
              "& .MuiSvgIcon-root": {
                backgroundColor: "transparent",
              },
            },
          }}
          className="disabled:opacity-10 data-color:color-natural-gray-700"
          data-color
        />
      </div>
    </div>
  );
};

export default WordRow;
