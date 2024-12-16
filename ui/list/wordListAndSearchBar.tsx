import { Checkbox } from "@mui/material";

import { WordPairsProp, LocalizationProps } from "@/lib/definitions";
import { useFilteredList } from "@/hooks/useFilteredList";

import SeachForm from "@/ui/basis/seachForm";
import WordRow from "@/ui/list/wordRow";

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
      <div className="static flex ">
        <SeachForm
          placeholderText={localization?.filter_words}
          onUpdateFilterInputHandler={setSeachText}
          seachText={seachText}
        />
        <Checkbox
          checked={isControlCheckboxChecked}
          value="all"
          aria-label={`Select first ${maxNumToSelect} new words to study`}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement>,
            checked: boolean
          ) => {
            onChangeWordSelectState("all", checked);
          }}
          sx={{
            color: "#87837e",
            "&.Mui-checked": {
              color: "#87837e",
            },
          }}
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
