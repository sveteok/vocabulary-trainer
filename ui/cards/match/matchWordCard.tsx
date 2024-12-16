import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import { motion } from "framer-motion";

import { CardTypes, CardResultTypes } from "@/hooks/useMatchCard";

export interface MatchWordProp {
  translated_name?: string;
  word_id?: string;
  index?: string;
  cardType?: CardTypes;
  isSelected?: boolean;
  result?: CardResultTypes;
  onClick?: (word_id: string, index: string, card_type: CardTypes) => void;
}

const MatchWordCard = (props: MatchWordProp) => {
  const {
    translated_name,
    word_id,
    index,
    cardType,
    isSelected,
    result,
    onClick,
  } = props;

  let animate_mode;
  if (word_id === undefined) {
    animate_mode = "visible";
  } else if (result == CardResultTypes.CORRECT) {
    animate_mode = "card_face_correct";
  } else if (result == CardResultTypes.INCORRECT) {
    animate_mode = "card_face_incorrect";
  } else if (isSelected) {
    animate_mode = "card_face_selected";
  } else {
    animate_mode = "card_face_init";
  }

  return (
    <motion.div
      initial={!word_id ? "init" : "hidden"}
      animate={animate_mode}
      exit="hidden"
      variants={{
        visible: {
          scale: 1,
          opacity: 1,
          backgroundColor: [
            "rgba(248, 247, 245, 0)",
            "rgba(248, 247, 245, 0.1)",
          ],
        },
        init: {
          scale: 0,
          opacity: 0,
          borderColor: "rgb(135, 131, 126, 0)",
          backgroundColor: "rgba(248, 247, 245, 0)",
        },
        hidden: {
          scale: 0,
          opacity: 0,
          borderColor: "rgb(135, 131, 126, 0)",
          backgroundColor: "rgba(248, 247, 245, 0.1)",
        },
        card_face_init: {
          scale: 1,
          opacity: 1,
          color: "rgb(35, 42, 50)",
          borderColor: "rgb(135, 131, 126)",
          backgroundColor: "rgb(248, 247, 245)",
        },
        card_face_correct: {
          scale: 1,
          opacity: 0.5,
          color: "rgb(0, 153, 102)",
          borderColor: "rgb(135, 131, 126)",
          backgroundColor: "rgb(248, 247, 245)",
        },
        card_face_incorrect: {
          opacity: 1,
          scale: 1,
          backgroundColor: "rgb(248, 247, 245)",
          borderColor: [
            "rgb(135, 131, 126)",
            "rgb(255, 53, 94)",
            "rgb(255, 53, 94)",
            "rgb(255, 53, 94)",
            "rgb(135, 131, 126)",
          ],
          boxShadow: [
            "none",
            "3px 3px 0 rgba(135, 164, 160, 0.5)",
            "3px 3px 0 rgba(135, 164, 160, 0.5)",
            "3px 3px 0 rgba(135, 164, 160, 0.5)",
            "none",
          ],
          rotate: [2, -2, 2, -2, 0],
          transition: { duration: 0.5 },
        },
        card_face_selected: {
          scale: 1,
          opacity: 1,
          borderColor: "rgb(35, 42, 50)",
          backgroundColor: "rgb(248, 247, 245)",
        },
      }}
      transition={{ ease: "easeInOut", duration: 0.75 }}
      data-cursor={
        result !== CardResultTypes.CORRECT ? "pointer" : "not-allowed"
      }
      className=" flex justify-center border-2 justify-items-stretch text-center text-[#232a32] place-items-center align-middle p-2 size-full rounded-lg font-semibold md:text-xl data-[cursor='pointer']:cursor-pointer data-[cursor='not-allowed']:cursor-not-allowed "
      onClick={
        result !== CardResultTypes.CORRECT && onClick && word_id && index
          ? () => onClick(word_id, index, cardType || CardTypes.CARD)
          : undefined
      }
    >
      {translated_name}
      {result === CardResultTypes.CORRECT && (
        <DoneRoundedIcon className=" h-6 w-6 text-[#009966]" />
      )}
    </motion.div>
  );
};

export default MatchWordCard;
