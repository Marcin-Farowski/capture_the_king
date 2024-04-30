"use client";

import React, { useState } from "react";
import Card from "../Card";

interface CardState {
  cardNumber: number;
  probabilityOfFive: number;
  fiveExcluded: boolean;
  selected: boolean;
}

const initialCardState: CardState = {
  cardNumber: 6,
  probabilityOfFive: 0,
  fiveExcluded: false,
  selected: false,
};

const Board: React.FC = () => {
  const [boardState, setBoardState] = useState<CardState[][]>(
    Array(5).fill(Array(5).fill(initialCardState))
  );
  const [selectedCardPosition, setSelectedCardPosition] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const handleCardClick = (row: number, col: number) => {
    const newBoardState = boardState.map((rowArray, rowIndex) =>
      rowArray.map((card, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          return {
            ...card,
            selected: !card.selected,
          };
        } else if (card.selected) {
          return {
            ...card,
            selected: false,
          };
        }
        return card;
      })
    );
    setBoardState(newBoardState);

    if (newBoardState[row][col].selected) {
      setSelectedCardPosition({ row, col });
    } else {
      setSelectedCardPosition(null);
    }
  };

  const handleCardChangeClick = (cardNumber: number) => {
    if (selectedCardPosition !== null) {
      const { row, col } = selectedCardPosition;
      const newBoardState = boardState.map((rowArray, rowIndex) =>
        rowArray.map((card, colIndex) => {
          if (rowIndex === row && colIndex === col && cardNumber != 7) {
            return {
              ...card,
              cardNumber: cardNumber === 7 ? cardNumber : cardNumber,
              probabilityOfFive: 0,
              fiveExcluded: false,
              selected: false,
            };
          } else if (cardNumber === 7) {
            return {
              ...card,
              adjacentToFive: true,
            };
          }
          return card;
        })
      );
      setBoardState(newBoardState);
      setSelectedCardPosition(null);
    }
  };

  return (
    <>
      <div
        className="bg-sprite bg-no-repeat"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 50px)",
          gridTemplateRows: "repeat(5, 36px)",
          gap: "1px",
          width: "264px",
          height: "220px",
          padding: "5px",
          backgroundPosition: "0 -117px",
        }}
      >
        {boardState.map((row, rowIndex) =>
          row.map((card, colIndex) => (
            <Card
              key={`${rowIndex}-${colIndex}`}
              cardNumber={card.cardNumber}
              probabilityOfFive={0}
              fiveExcluded={card.fiveExcluded}
              selected={card.selected}
              adjacentToFive={false}
              onClick={() => handleCardClick(rowIndex, colIndex)}
            />
          ))
        )}
      </div>
      <div>
        {[...Array(8)].map((_, index) => (
          <Card
            key={index}
            cardNumber={index}
            probabilityOfFive={index}
            fiveExcluded={false}
            selected={false}
            adjacentToFive={false}
            onClick={() => handleCardChangeClick(index)}
          />
        ))}
      </div>
    </>
  );
};

export default Board;
