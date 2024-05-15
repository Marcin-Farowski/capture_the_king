import React from "react";

interface CardProps {
  row?: number;
  col?: number;
  cardNumber: number;
  probabilityOfFive?: number;
  isSelected?: boolean;
  adjacentToFive?: boolean;
  isButton?: boolean;
  usedCards?: number;
  onClick: (
    cardNumber: number,
    usedCards: number,
    maxCardQuantity: number
  ) => void;
}

const Card: React.FC<CardProps> = ({
  row = 0,
  col = 0,
  cardNumber,
  probabilityOfFive = 0,
  isSelected = false,
  adjacentToFive = false,
  isButton = false,
  usedCards = 0,
  onClick,
}) => {
  let backgroundPosition = "";
  let grayCardBackgroundPosition = "";
  let maxCardQuantity = 0;
  let buttonWithCardLimit = false;
  let allCardsUsed = false;

  switch (cardNumber) {
    case 0:
      backgroundPosition = "-106px -78px";
      break;
    case 1:
      backgroundPosition = "0 0";
      grayCardBackgroundPosition = "0 -39px";
      break;
    case 2:
      backgroundPosition = "-53px 0";
      grayCardBackgroundPosition = "-53px -39px";
      break;
    case 3:
      backgroundPosition = "-106px 0";
      grayCardBackgroundPosition = "-106px -39px";
      break;
    case 4:
      backgroundPosition = "-159px 0";
      grayCardBackgroundPosition = "-159px -39px";
      break;
    case 5:
      backgroundPosition = "-212px 0";
      grayCardBackgroundPosition = "-212px -39px";
      break;
    case 6:
      backgroundPosition = "0 -78px";
      grayCardBackgroundPosition = "-53px -78px";
      break;
    case 7:
      backgroundPosition = "-212px -39px";
      break;
    default:
      backgroundPosition = "-106px -78px";
  }

  if (isButton) {
    switch (cardNumber) {
      case 1:
        maxCardQuantity = 7;
        break;
      case 2:
        maxCardQuantity = 4;
        break;
      case 3:
        maxCardQuantity = 5;
        break;
      case 4:
        maxCardQuantity = 5;
        break;
      case 5:
        maxCardQuantity = 3;
        break;
      case 6:
        maxCardQuantity = 1;
        break;
      default:
        maxCardQuantity = 0;
    }
    if (maxCardQuantity > 0) {
      buttonWithCardLimit = true;
      if (usedCards === maxCardQuantity) {
        allCardsUsed = true;
        backgroundPosition = grayCardBackgroundPosition;
      }
    }
  }

  return (
    <div
      className={`relative bg-sprite bg-no-repeat w-[50px] 
        ${isSelected && "brightness-125 scale-105 cursor-pointer"}
        ${isButton && !allCardsUsed && "hover:scale-105 cursor-pointer"}
        ${!allCardsUsed && "hover:brightness-125 cursor-pointer"}
        ${allCardsUsed && "cursor-not-allowed"}
      }`}
      style={{
        width: "50px",
        height: "36px",
        position: "relative",
        overflow: "hidden",
        backgroundPosition,
      }}
      onClick={() => onClick(cardNumber, usedCards, maxCardQuantity)}
    >
      <div
        className="bg-cover"
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        {cardNumber === 7 && probabilityOfFive > 0 && (
          <span
            className="
         text-xs text-red-50 absolute -bottom-1 right-0 cursor-pointer"
            style={{ userSelect: "none" }}
          >
            {Math.round(probabilityOfFive * 1000) / 10}%
          </span>
        )}
        {buttonWithCardLimit && (
          <span
            className={`text-xs text-red-50 bg-zinc-950/50 rounded absolute -bottom-1 right-0 px-1 cursor-pointer
              ${allCardsUsed && "saturate-0 cursor-not-allowed"}`}
            style={{ userSelect: "none" }}
          >
            {usedCards}/{maxCardQuantity}
          </span>
        )}
      </div>
    </div>
  );
};

export default Card;
