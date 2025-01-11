"use client";

import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";

import { useWordList } from "@/hooks/useWordList";
import SubMenu from "@/ui/basis/subMenu";
import { LoadingSkeleton } from "@/ui/basis/loadingSkeleton";
import MainContainer from "@/ui/basis/mainContainer";
import WordListAndSearchBar from "@/ui/list/wordListAndSearchBar";

export default function WordList() {
  const {
    form,
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
        {form.language &&
        form.translation_language &&
        form.localization?.select_words_to_study ? (
          `${form.localization?.select_words_to_study} (${selectedWordsQuantity}/${maxNumToSelect}) ...`
        ) : (
          <LoadingSkeleton />
        )}
      </SubMenu>

      <MainContainer
        actions={[
          {
            label:
              form.language && form.translation_language
                ? form.localization?.go_to_practice || ""
                : "",
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
            localization={form.localization}
          />
        </div>
      </MainContainer>
    </>
  );
}
