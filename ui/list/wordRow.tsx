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
      className={`flex flex-row items-center border-b-2 border-[#87837e] overflow-auto`}
    >
      <div className="flex flex-1 flex-col gap-0 m-0 p-0">
        <div> {item.word_name}</div>
        <div className="text-gray-500 text-sm">{item.translated_word_name}</div>
      </div>
      <div className="flex-end">
        <span className="opacity-20 text-gray-400">
          {item.learned
            ? localization?.learned || "learned word"
            : localization?.new_word || "new word"}
        </span>
        <Checkbox
          checked={item.selected === undefined ? false : item.selected}
          value={item.id}
          aria-label="select words to study"
          disabled={!canSelectMoreWords && !item.selected}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement>,
            checked: boolean
          ) => {
            onChangeWordSelectState(item.id, checked);
          }}
          className="disabled:opacity-10"
          sx={{
            color: "#87837e",
            "&.Mui-checked": {
              color: "#87837e",
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
        />
      </div>
    </div>
  );
};

export default WordRow;
