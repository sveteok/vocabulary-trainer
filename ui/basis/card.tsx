import { MouseEvent } from "react";

export enum CardInfoStates {
  ERROR,
  INFO,
  CORRECT,
}

const Card = (props: {
  id?: string;
  name?: string;
  description?: string;
  descriptionLabel?: string;
  isFrontSide?: boolean;
  hideDetails?: boolean;
  infoText?: string;
  infoState?: CardInfoStates;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  className?: string;
}) => {
  const {
    id,
    name,
    description,
    onClick,
    hideDetails,
    infoText,
    infoState,
    descriptionLabel,
    className,
    isFrontSide = true,
  } = props;

  return (
    <div
      className={`${className} 
      flex flex-1 flex-col justify-center items-center gap-2 h-full
       text-natural-gray-700
      bg-natural-gray-100
      border-8 border-natural-gray-300   rounded-md  
      
      focus:ring-1 outline-[#a49487]
      ${
        isFrontSide
          ? ""
          : "bg-radial-gradient-card-back-side bg-[length:10px_10px]"
      }
      `}
      onClick={onClick}
    >
      {infoText && <div className="text-sm flex-1 p-4">&nbsp;</div>}
      <div className="font-bold ">{name || ""}</div>
      {id && !hideDetails && (
        <div className="text-sm italic opacity-50 px-4">
          {descriptionLabel || "Example"}: {description}
        </div>
      )}
      {infoText && (
        <div
          className={`text-gray-500 text-sm flex-1 flex flex-col justify-end p-4 ${
            infoState === CardInfoStates.ERROR
              ? "text-error"
              : infoState === CardInfoStates.CORRECT
              ? "text-success"
              : ""
          }`}
        >
          {infoText}
        </div>
      )}
    </div>
  );
};

export default Card;
