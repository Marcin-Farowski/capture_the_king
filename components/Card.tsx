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
  onClick: () => void;
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
  let maxCardQuantity = 0;

  switch (cardNumber) {
    case 0:
      backgroundPosition = "-106px -78px";
      break;
    case 1:
      backgroundPosition = "0 0";
      break;
    case 2:
      backgroundPosition = "-53px 0";
      break;
    case 3:
      backgroundPosition = "-106px 0";
      break;
    case 4:
      backgroundPosition = "-159px 0";
      break;
    case 5:
      backgroundPosition = "-212px 0";
      break;
    case 6:
      backgroundPosition = "0 -78px";
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
  }

  return (
    <div
      className={`bg-sprite bg-no-repeat cursor-pointer hover:brightness-125 ${
        (isSelected && "brightness-125 scale-105") ||
        (isButton && "hover:scale-105")
      }`}
      style={{
        width: "50px",
        height: "36px",
        position: "relative",
        overflow: "hidden",
        backgroundPosition,
      }}
      onClick={onClick}
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
        {maxCardQuantity > 0 && (
          <span
            className="
         text-xs text-red-50 bg-zinc-950/50 rounded absolute -bottom-1 right-0 px-1 cursor-pointer"
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
