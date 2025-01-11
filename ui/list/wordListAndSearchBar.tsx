import { Checkbox } from "@mui/material";

import { WordPairsProp, LocalizationProps } from "@/lib/definitions";
import { useFilteredList } from "@/hooks/useFilteredList";

import SeachForm from "@/ui/basis/seachForm";
import WordRow from "@/ui/list/wordRow";
import { KeyboardEventHandler } from "react";

const WordListAndSearchBar = ({
  list,
  onChangeWordSelectState,
  maxNumToSelect,
  isControlCheckboxChecked,
  localization,
}: {
  list: WordPairsProp[];
  onChangeWordSelectState: (id: string, checked: boolean) => void;
  maxNumToSelect?: number;
  isControlCheckboxChecked: boolean;
  localization?: LocalizationProps;
}) => {
  const { seachText, setSeachText, filteredList, canSelectMoreWords } =
    useFilteredList({ list, maxNumToSelect });

  return (
    <>
      <div className="static flex gap-2 items-center">
        <SeachForm
          placeholderText={localization?.filter_words}
          onUpdateFilterInputHandler={setSeachText}
          seachText={seachText}
        />
        <Checkbox
          checked={isControlCheckboxChecked}
          id="checkbox_all"
          value="all"
          aria-label={`Select ${maxNumToSelect} new words to study`}
          {...{ inputProps: { "aria-label": "Checkbox All" } }}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement>,
            checked: boolean
          ) => {
            onChangeWordSelectState("all", checked);
          }}
          onKeyUp={(e: React.KeyboardEvent<HTMLButtonElement>) => {
            if (
              e.key === "Enter" &&
              document.activeElement?.id === "checkbox_all"
            ) {
              (document.activeElement as HTMLElement).click();
            }
          }}
          sx={{
            color: "var(--data-color)",
            "&.Mui-checked": {
              color: "var(--data-color)",
            },
          }}
          className="data-color:color-natural-gray-700 w-10 h-10"
          data-color
        />
      </div>
      <div
        className={`flex-1 flex flex-col items-stretch mt-4 overflow-y-scroll gap-0`}
      >
        <div className="grid grid-cols-1 gap-1">
          {filteredList.map((item, i) => (
            <WordRow
              key={item.id}
              item={item}
              canSelectMoreWords={canSelectMoreWords}
              onChangeWordSelectState={onChangeWordSelectState}
              localization={localization}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default WordListAndSearchBar;
