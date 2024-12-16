import { CurrentWriteCardProp, CardResultTypes } from "@/hooks/useWriteCard";

import { LocalizationProps } from "@/lib/definitions";
import { InfoContainerStates } from "@/ui/basis/infoContainer";
import { CardInfoStates } from "@/ui/basis/card";

interface WriteCardInputDataType {
  cardInfoText: string;
  cardInfoState: CardInfoStates;
  infoContainerState: InfoContainerStates;
  infoContainerText: string;
  inputPlaceHolder: string;
}

export function useWriteCardInput({
  localization,
  writeCard,
}: {
  localization?: LocalizationProps;
  writeCard?: CurrentWriteCardProp;
}): WriteCardInputDataType {
  const writeTranslationText =
    localization?.write_translation || "Write word's translation";
  const correctAnswerText = localization?.correct_answer || "Correct answer";
  const theAnswerCorrectText =
    localization?.answer_is_correct || "The answer is correct";

  let cardInfoText = "";
  let cardInfoState = CardInfoStates.INFO;
  let infoContainerState = InfoContainerStates.INFO;

  if (writeCard?.result === CardResultTypes.INCORRECT) {
    cardInfoText = `${correctAnswerText}: ${writeCard?.word.translated_word_name}`;
    cardInfoState = CardInfoStates.ERROR;
    infoContainerState = InfoContainerStates.ERROR;
  } else if (writeCard?.result === CardResultTypes.CORRECT) {
    cardInfoText = theAnswerCorrectText;
    cardInfoState = CardInfoStates.CORRECT;
    infoContainerState = InfoContainerStates.CORRECT;
  }

  return {
    cardInfoText,
    cardInfoState,
    infoContainerState,
    infoContainerText: writeCard?.answer || writeTranslationText,
    inputPlaceHolder: writeTranslationText,
  };
}
