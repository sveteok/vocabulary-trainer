import { RefObject } from "react";
import { useWriteCardInput } from "@/app/hooks/useWriteCardInput";

import {
  CurrentWriteCardProp,
  CardResultTypes,
} from "@/app/hooks/useWriteCard";
import { LocalizationProps } from "@/app/lib/definitions";

import InfoContainer from "@/app/ui/basis/infoContainer";
import Card from "@/app/ui/basis/card";

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
          {infoContainerText}
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
          className="p-4 mb-1 bg-[#f8f7f5] border-2 border-[#87837e] rounded-md  gap-4 focus:ring-1 outline-[#a49487]"
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
