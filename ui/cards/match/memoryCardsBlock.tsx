import { AnimatePresence } from "framer-motion";

import MatchWordCard from "@/ui/cards/match/matchWordCard";

import {
  PlayingBlockProp,
  CardTypes,
  CardResultTypes,
} from "@/hooks/useMatchCard";

const MemoryCardsBlock = ({
  data,
  handleCardClick,
}: {
  data: PlayingBlockProp | undefined;
  handleCardClick: (
    word_id: string,
    index: string,
    card_type: CardTypes
  ) => void;
}) => {
  return (
    <div className="grid grid-rows-5 p-2 grid-flow-col grid-cols-2 size-full gap-4 justify-items-stretch space-evenly overflow-x-hidden">
      <AnimatePresence initial={true}>
        {data?.words.map((card, index) => {
          if (!card) return <MatchWordCard key={`word_${index}`} />;

          return (
            <MatchWordCard
              key={`word_${index}`}
              translated_name={card.name}
              word_id={card.id}
              index={card.index}
              cardType={CardTypes.CARD}
              isSelected={
                card.result !== CardResultTypes.CORRECT &&
                card.id == data?.currentWord?.id &&
                card.index == data?.currentWord?.index
              }
              result={card.result}
              onClick={handleCardClick}
            />
          );
        })}

        {data?.translatedWords.map((card, index) => {
          if (!card) return <MatchWordCard key={`translated_word_${index}`} />;

          return (
            <MatchWordCard
              key={`translated_word_${index}`}
              translated_name={card.name}
              word_id={card.id}
              index={card.index}
              cardType={CardTypes.TRANSLATED_CARD}
              isSelected={
                card.result !== CardResultTypes.CORRECT &&
                card.id == data?.currentTranslatedWord?.id &&
                card.index == data?.currentTranslatedWord?.index
              }
              result={card.result}
              onClick={handleCardClick}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
};
export default MemoryCardsBlock;
