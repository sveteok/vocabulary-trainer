"use client";

import { useState, useEffect } from "react";
import ReactCardFlip from "react-card-flip";

import { WordPairsProp, LocalizationProps } from "@/app/lib/definitions";
import Card from "@/app/ui/basis/card";

export const FlipCard = (props: {
  wordPair: WordPairsProp;
  doReverseCards: boolean;
  localization?: LocalizationProps;
}) => {
  const { wordPair, doReverseCards, localization } = props;
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  useEffect(() => {
    setIsFlipped(doReverseCards);
  }, [doReverseCards]);

  return (
    <ReactCardFlip
      isFlipped={isFlipped}
      flipDirection="vertical"
      containerClassName="ReactCardFlip px-8 flex-1"
      cardZIndex="10"
    >
      <Card
        onClick={() => setIsFlipped(true)}
        id={wordPair.translated_word_id}
        name={wordPair.translated_word_name}
        description={wordPair.translated_word_desc}
        infoText={localization?.tap_to_view_word || "Tap to view the word"}
        descriptionLabel={localization?.example || "Example"}
      />
      <Card
        onClick={() => setIsFlipped(false)}
        id={wordPair.word_id}
        name={wordPair.word_name}
        description={wordPair.word_desc}
        infoText={
          localization?.tap_to_view_translation || "Tap to view translation"
        }
        descriptionLabel={localization?.example || "Example"}
        isFrontSide={false}
      />
    </ReactCardFlip>
  );
};
