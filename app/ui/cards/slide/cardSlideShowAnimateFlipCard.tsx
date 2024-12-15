import { WordPairsProp, LocalizationProps } from "@/app/lib/definitions";
import CardSlideShowAnimate from "@/app/ui/cards/slide/cardSlideShowAnimate";
import { WordCardsStateProp } from "@/app/hooks/useSlideShow";
import { FlipCard } from "@/app/ui/cards/slide/flipCard";

const CardSlideShowAnimateFlipCard = ({
  wordCardsState,
  paginate,
  localization,
  isNextButtonDragDisabled,
  isPrevButtonDragDisabled,
}: {
  wordCardsState: WordCardsStateProp;
  localization?: LocalizationProps;
  paginate: (newDirection: number) => void;
  isNextButtonDragDisabled: boolean;
  isPrevButtonDragDisabled: boolean;
}) => {
  const currCard = wordCardsState.wordPairsHashTable[
    wordCardsState.page
  ] as WordPairsProp;

  return (
    <CardSlideShowAnimate
      paginate={paginate}
      page={wordCardsState.page}
      direction={wordCardsState.direction}
      isNextButtonDragDisabled={isNextButtonDragDisabled}
      isPrevButtonDragDisabled={isPrevButtonDragDisabled}
    >
      {currCard && (
        <FlipCard
          wordPair={currCard}
          key={currCard.id}
          doReverseCards={wordCardsState.doReverseCards}
          localization={localization}
        />
      )}
    </CardSlideShowAnimate>
  );
};

export default CardSlideShowAnimateFlipCard;
