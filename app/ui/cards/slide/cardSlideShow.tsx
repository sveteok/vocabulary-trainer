"use client";

import { useContext } from "react";

import FlipCameraAndroidRoundedIcon from "@mui/icons-material/FlipCameraAndroidRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

import MainContainer from "@/app/ui/basis/mainContainer";
import ProgressBar from "@/app/ui/basis/progressBar";
import SubMenu from "@/app/ui/basis/sub-menu";

import { DictionaryContext } from "@/store/dict-context";
import { useSlideShow } from "@/app/hooks/useSlideShow";
import CardSlideShowAnimateFlipCard from "@/app/ui/cards/slide/cardSlideShowAnimateFlipCard";

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
          restartButtonRef={restartButtonRef}
          localization={form.localization}
        />
      </SubMenu>

      <MainContainer
        actions={[
          {
            id: "revert",
            label: form.localization?.revert_cards || "Revert cards",
            icon: <FlipCameraAndroidRoundedIcon />,
          },
        ]}
        value="next"
        handleOnChange={revertHandler}
        className=""
      >
        <section aria-label="cards" className="flex flex-1 size-full ">
          <div className="flex size-full place-items-center ">
            <button
              key="back"
              value="back"
              onClick={() => paginateHandler(-1)}
              disabled={isPrevButtonDisabled}
              className={navBtnClassName}
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
              className={`${navBtnClassName} content-end`}
            >
              <ArrowForwardIosRoundedIcon />
            </button>
          </div>
        </section>
      </MainContainer>
    </>
  );
};

const navBtnClassName = `p-2  gap-2
       border-2 border-[#32302f] rounded-full 
      bg-[#87837e] text-[#fff]
      hover:border-[#414f4d]
      hover:text-[#414f4d]
      hover:bg-[#d5cddc]
      hover:cursor-pointer
      active:bg-[#87837e] active:text-[#fff]
      disabled:bg-gray-300
      disabled:opacity-25
      outline-none
      focus:pointer-events-auto
      enabled:pointer-events-auto
      pointer-events-none
      flex-none
      `;
