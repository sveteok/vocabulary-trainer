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
          backgroundColor: ["var(--data-bg-hidden)", "var(--data-bg-01)"],
        },
        init: {
          scale: 0,
          opacity: 0,
          borderColor: "var(--data-border-hidden)",
          backgroundColor: "var(--data-bg-hidden)",
        },
        hidden: {
          scale: 0,
          opacity: 0,
          borderColor: "var(--data-border-hidden)",
          backgroundColor: "var(--data-bg-01)",
        },
        card_face_init: {
          scale: 1,
          opacity: 1,
          color: "rgb(35, 42, 50)",
          borderColor: "var(--data-border)",
          backgroundColor: "var(--data-bg)",
        },
        card_face_correct: {
          scale: 1,
          opacity: 0.5,
          color: "var(--data-success)",
          borderColor: "var(--data-success)",
          backgroundColor: "var(--data-bg)",
        },
        card_face_incorrect: {
          opacity: 1,
          scale: 1,
          backgroundColor: "var(--data-bg)",
          borderColor: [
            "var(--data-border)",
            "var(--data-error)",
            "var(--data-error)",
            "var(--data-error)",
            "var(--data-border)",
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
          borderColor: "var(--data-border-selected)",
          backgroundColor: "var(--data-bg)",
        },
      }}
      transition={{ ease: "easeInOut", duration: 0.75 }}
      data-cursor={
        result !== CardResultTypes.CORRECT ? "pointer" : "not-allowed"
      }
      className={`
        flex justify-center border-2 justify-items-stretch text-center place-items-center align-middle p-2 size-full rounded-lg font-semibold md:text-xl data-[cursor='pointer']:cursor-pointer data-[cursor='not-allowed']:cursor-not-allowed 
        ${
          animate_mode !== "card_face_selected"
            ? ""
            : "bg-radial-gradient-card-back-side bg-[length:3px_3px]"
        }

        [--data-bg:#e7e6e6]
        [--data-bg-01:#e7e6e610]
        [--data-bg-hidden:#e7e6e609]
        [--data-border:#b3b1ad]
        [--data-border-hidden:#b3b1ad09]
        [--data-success:#22c55e]
        [--data-error:#ef4444]
        [--data-border-selected:#52504c]

        outline-natural-gray-50
        focus:ring-natural-gray-50  focus:outline-natural-gray-50
      `}
      onClick={
        result !== CardResultTypes.CORRECT && onClick && word_id && index
          ? () => onClick(word_id, index, cardType || CardTypes.CARD)
          : undefined
      }
      tabIndex={0}
      id={word_id}
      onKeyUp={(e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" && document.activeElement?.id === word_id) {
          (document.activeElement as HTMLElement).click();
        }
      }}
    >
      {translated_name}
      {result === CardResultTypes.CORRECT && (
        <DoneRoundedIcon className=" h-6 w-6 text-success" />
      )}
    </motion.div>
  );
};

export default MatchWordCard;
