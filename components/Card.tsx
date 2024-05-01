import React from "react";

interface CardProps {
  cardNumber: number;
  probabilityOfFive?: number;
  selected?: boolean;
  adjacentToFive?: boolean;
  isButton?: boolean;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({
  cardNumber,
  probabilityOfFive = 0,
  selected = false,
  adjacentToFive = false,
  isButton = false,
  onClick,
}) => {
  let backgroundPosition = "";

  switch (cardNumber) {
    case 0:
      backgroundPosition = "0 0";
      break;
    case 1:
      backgroundPosition = "-53px 0";
      break;
    case 2:
      backgroundPosition = "-106px 0";
      break;
    case 3:
      backgroundPosition = "-159px 0";
      break;
    case 4:
      backgroundPosition = "-212px 0";
      break;
    case 5:
      backgroundPosition = "0 -78px";
      break;
    case 6:
      backgroundPosition = "-106px -78px";
      break;
    case 7:
      backgroundPosition = "-212px -39px";
      break;
    default:
      backgroundPosition = "-106px -78px";
  }

  return (
    <div
      className={`bg-sprite bg-no-repeat cursor-pointer hover:brightness-125 ${
        (selected && "brightness-125 scale-105") ||
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
        {cardNumber === 0 && probabilityOfFive > 0 && (
          <span
            className="
         text-xs text-red-50 absolute -bottom-1 right-0 cursor-pointer"
            style={{ userSelect: "none" }}
          >
            {probabilityOfFive * 100}%
          </span>
        )}
      </div>
    </div>
  );
};

export default Card;
