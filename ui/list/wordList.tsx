"use client";

import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";

import { useWordList } from "@/hooks/useWordList";

import MainContainer from "@/ui/basis/mainContainer";
import WordListAndSearchBar from "@/ui/list/wordListAndSearchBar";
import SubMenu from "@/ui/basis/subMenu";

export default function WordList() {
  const {
    localization,
    onGoToPracticeHandler,
    wordPairs,
    selectedWordsQuantity,
    maxNumToSelect,
    onUpdateWordSelectedState,
    isNextBtnDisabled,
  } = useWordList();

  return (
    <>
      <SubMenu>
        <div className="pl-3">
          {(localization?.select_words_to_study || "Select words to study") +
            ` (${selectedWordsQuantity}/${maxNumToSelect}) ...`}
        </div>
      </SubMenu>

      <MainContainer
        actions={[
          {
            label: localization?.go_to_practice || "Go to practice",
            icon: <NavigateNextRoundedIcon />,
            id: "menu",
            disabled: isNextBtnDisabled,
          },
        ]}
        value="next"
        handleOnChange={onGoToPracticeHandler}
        className=""
      >
        <div
          className={`flex-1 flex flex-col items-stretch p-0 overflow-y-scroll gap-0`}
        >
          <WordListAndSearchBar
            list={wordPairs}
            onChangeWordSelectState={onUpdateWordSelectedState}
            maxNumToSelect={maxNumToSelect}
            isControlCheckboxChecked={
              selectedWordsQuantity === maxNumToSelect ? true : false
            }
            localization={localization}
          />
        </div>
      </MainContainer>
    </>
  );
}
