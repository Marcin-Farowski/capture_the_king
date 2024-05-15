import React from "react";
import Image, { StaticImageData } from "next/image";
import oneImg from "../public/assets/one.png";
import twoImg from "../public/assets/two.png";
import threeImg from "../public/assets/three.png";
import fourImg from "../public/assets/four.png";
import fiveImg from "../public/assets/five.png";
import kingImg from "../public/assets/king.png";
import faceDownCardImg from "../public/assets/face-down-card.png";
import grayOneImg from "../public/assets/gray-one.png";
import grayTwoImg from "../public/assets/gray-two.png";
import grayThreeImg from "../public/assets/gray-three.png";
import grayFourImg from "../public/assets/gray-four.png";
import grayFiveImg from "../public/assets/gray-five.png";
import grayKingImg from "../public/assets/gray-king.png";

// Preload images
const preloadedImages = [
  oneImg,
  twoImg,
  threeImg,
  fourImg,
  fiveImg,
  kingImg,
  faceDownCardImg,
  grayOneImg,
  grayTwoImg,
  grayThreeImg,
  grayFourImg,
  grayFiveImg,
  grayKingImg,
];

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
  let imgSrc: StaticImageData;
  let maxCardQuantity = 0;
  let buttonWithCardLimit = false;
  let allCardsUsed = false;
  let allCardsUsedImgSrc: StaticImageData = faceDownCardImg;

  switch (cardNumber) {
    case 0:
      imgSrc = faceDownCardImg;
      break;
    case 1:
      imgSrc = oneImg;
      allCardsUsedImgSrc = grayOneImg;
      break;
    case 2:
      imgSrc = twoImg;
      allCardsUsedImgSrc = grayTwoImg;
      break;
    case 3:
      imgSrc = threeImg;
      allCardsUsedImgSrc = grayThreeImg;
      break;
    case 4:
      imgSrc = fourImg;
      allCardsUsedImgSrc = grayFourImg;
      break;
    case 5:
      imgSrc = fiveImg;
      allCardsUsedImgSrc = grayFiveImg;
      break;
    case 6:
      imgSrc = kingImg;
      allCardsUsedImgSrc = grayKingImg;
      break;
    case 7:
      imgSrc = grayFiveImg;
      break;
    default:
      imgSrc = faceDownCardImg;
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
      <Image src={imgSrc} alt="Card" width={50} height={36} priority={true} />

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
