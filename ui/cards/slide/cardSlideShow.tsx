"use client";

import { useContext } from "react";

import FlipCameraAndroidRoundedIcon from "@mui/icons-material/FlipCameraAndroidRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

import MainContainer from "@/ui/basis/mainContainer";
import ProgressBar from "@/ui/basis/progressBar";
import SubMenu from "@/ui/basis/subMenu";

import { DictionaryContext } from "@/store/dict-context";
import { useSlideShow } from "@/hooks/useSlideShow";
import CardSlideShowAnimateFlipCard from "@/ui/cards/slide/cardSlideShowAnimateFlipCard";

export const CardSlideShow = () => {
  const dictContext = useContext(DictionaryContext);
  const { form } = dictContext;

  const {
    cardsState: wordCardsState,
    paginateHandler,
    restartHandler,
    revertHandler,
    isPrevButtonDisabled,
    isNextButtonDisabled,
    pageCount,
    restartButtonRef,
  } = useSlideShow({
    wordPairs: form.wordPairs,
  });

  return (
    <>
      <SubMenu>
        <ProgressBar
          total={pageCount}
          remaining={pageCount === 0 ? 0 : pageCount - wordCardsState.page - 1}
          restart={restartHandler}
          showBackButton={true}
          pageName={form.localization?.flashcards || "Flashcards"}
          localization={form.localization}
        />
      </SubMenu>

      <MainContainer
        actions={[
          {
            id: "revert",
            label:
              form.language && form.translation_language && form.category
                ? form.localization?.revert_cards || ""
                : "",
            icon: <FlipCameraAndroidRoundedIcon />,
          },
        ]}
        value="next"
        handleOnChange={revertHandler}
        className=""
      >
        <section aria-label="cards" className="flex flex-1 size-full ">
          <div className="flex size-full place-items-center overflow-hidden py-1">
            <button
              key="back"
              value="back"
              onClick={() => paginateHandler(-1)}
              disabled={isPrevButtonDisabled}
              className={`${navBtnClassName} ml-2 left-7`}
            >
              <ArrowBackIosNewRoundedIcon />
            </button>

            <CardSlideShowAnimateFlipCard
              wordCardsState={wordCardsState}
              paginate={paginateHandler}
              localization={form.localization}
              isNextButtonDragDisabled={isNextButtonDisabled}
              isPrevButtonDragDisabled={isPrevButtonDisabled}
            />

            <button
              key="next"
              value="next"
              onClick={() => paginateHandler(1)}
              disabled={isNextButtonDisabled}
              className={`${navBtnClassName} mr-2 right-7`}
            >
              <ArrowForwardIosRoundedIcon />
            </button>
          </div>
        </section>
      </MainContainer>
    </>
  );
};

const navBtnClassName = `
      absolute md:static z-10
      border-2 border-natural-gray-100 rounded-full 
                  bg-natural-gray-900 text-natural-gray-50
                  hover:border-natural-gray-100
                  hover:text-white
                  hover:bg-natural-gray-600
                  hover:cursor-pointer
                  disabled:opacity-25
                  outline-none
                  enabled:pointer-events-auto
                  pointer-events-none
                  focus:pointer-events-auto focus:ring-current focus:outline-natural-gray-50
      p-2
      `;
// p-2
// border-2 border-[#32302f] rounded-full
// bg-[#87837e] text-[#fff]
// hover:border-[#414f4d]
// hover:text-[#414f4d]
// hover:bg-[#d5cddc]
// hover:cursor-pointer
// active:bg-[#87837e] active:text-[#fff]
// disabled:bg-gray-300
// disabled:opacity-25
// outline-none
// focus:pointer-events-auto
// enabled:pointer-events-auto
// pointer-events-none
// flex-none
