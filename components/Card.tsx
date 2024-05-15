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
  let imgSrc: string;
  let maxCardQuantity = 0;
  let buttonWithCardLimit = false;
  let allCardsUsed = false;
  let allCardsUsedImgSrc: string = "/assets/face-down-card.png";

  switch (cardNumber) {
    case 0:
      imgSrc = "/assets/face-down-card.png";
      break;
    case 1:
      imgSrc = `/assets/one.png`;
      allCardsUsedImgSrc = `/assets/gray-one.png`;
      break;
    case 2:
      imgSrc = `/assets/two.png`;
      allCardsUsedImgSrc = `/assets/gray-two.png`;
      break;
    case 3:
      imgSrc = `/assets/three.png`;
      allCardsUsedImgSrc = `/assets/gray-three.png`;
      break;
    case 4:
      imgSrc = `/assets/four.png`;
      allCardsUsedImgSrc = `/assets/gray-four.png`;
      break;
    case 5:
      imgSrc = `/assets/five.png`;
      allCardsUsedImgSrc = `/assets/gray-five.png`;
      break;
    case 6:
      imgSrc = `/assets/king.png`;
      allCardsUsedImgSrc = `/assets/gray-king.png`;
      break;
    case 7:
      imgSrc = `/assets/gray-five.png`;
      break;
    default:
      imgSrc = "/assets/face-down-card.png";
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
        imgSrc = allCardsUsedImgSrc;
      }
    }
  }

  return (
    <div
      className={`relative
        ${isSelected && "brightness-125 scale-105 cursor-pointer"}
        ${isButton && !allCardsUsed && "hover:scale-105 cursor-pointer"}
        ${allCardsUsed && "cursor-not-allowed"}
        ${!allCardsUsed && "hover:brightness-125 cursor-pointer"}
      }`}
      onClick={() => onClick(cardNumber, usedCards, maxCardQuantity)}
    >
      <img src={imgSrc} alt={"Card " + cardNumber} width={50} height={36} />

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
          className={`text-xs text-red-50 bg-zinc-950/50 rounded absolute -bottom-1 right-0 px-1
              ${!allCardsUsed && "cursor-pointer"}
              ${allCardsUsed && "saturate-0 cursor-not-allowed"}`}
          style={{ userSelect: "none" }}
        >
          {usedCards}/{maxCardQuantity}
        </span>
      )}
    </div>
  );
};

export default Card;
