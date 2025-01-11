import { RefObject } from "react";
import { useWriteCardInput } from "@/hooks/useWriteCardInput";

import { CurrentWriteCardProp, CardResultTypes } from "@/hooks/useWriteCard";
import { LocalizationProps } from "@/lib/definitions";

import InfoContainer from "@/ui/basis/infoContainer";
import Card from "@/ui/basis/card";
import { LoadingSkeleton } from "@/ui/basis/loadingSkeleton";

const WriteCardInputContent = (props: {
  writeCard?: CurrentWriteCardProp;
  onUpdateAnswerHandler: (answer: string) => void;
  onCheckAnswerHandler: () => void;
  localization?: LocalizationProps;
  answerInputRef: RefObject<HTMLInputElement | null>;
  isAnswerInputDisabled: boolean;
}) => {
  const {
    writeCard,
    onUpdateAnswerHandler,
    onCheckAnswerHandler,
    answerInputRef,
    localization,
    isAnswerInputDisabled,
  } = props;

  const {
    cardInfoText,
    cardInfoState,
    infoContainerState,
    infoContainerText,
    inputPlaceHolder,
  } = useWriteCardInput({
    localization,
    writeCard: writeCard,
  });

  return (
    <>
      <Card
        id={writeCard?.word.word_id}
        description={writeCard?.word.word_desc}
        name={writeCard?.word.word_name}
        hideDetails={writeCard === undefined}
        infoText={cardInfoText}
        infoState={cardInfoState}
        descriptionLabel={localization?.example}
      />

      {writeCard?.result !== CardResultTypes.NO_ANSWER && (
        <InfoContainer
          infoState={infoContainerState}
          rippleEffectDisabled={true}
        >
          {infoContainerText || <LoadingSkeleton />}
        </InfoContainer>
      )}

      {writeCard?.result === CardResultTypes.NO_ANSWER && (
        <input
          type="text"
          id={writeCard?.word.id}
          name={writeCard?.word.translated_word_name}
          value={writeCard?.answer}
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
            onUpdateAnswerHandler(event.target.value);
          }}
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>): void => {
            const value = (event.target as HTMLInputElement).value;
            if (event.key === "Enter" && value.trim().length > 0) {
              onUpdateAnswerHandler((event.target as HTMLInputElement).value);
              onCheckAnswerHandler();
            }
          }}
          autoComplete="off"
          placeholder={inputPlaceHolder}
          className="p-4 mb-1 gap-4 
                      border-2 border-natural-gray-100 rounded-md  
                      bg-natural-gray-50
                      outline-border-natural-gray-100
                      focus:ring-current focus:outline-natural-gray-50
                      "
          required={true}
          aria-describedby={inputPlaceHolder}
          autoFocus
          ref={answerInputRef}
          disabled={isAnswerInputDisabled}
        />
      )}
    </>
  );
};

export default WriteCardInputContent;
