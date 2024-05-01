"use client";

import React, { useState } from "react";
import Card from "../Card";

interface CardState {
  cardNumber: number;
  probabilityOfFive: number;
  selected: boolean;
  adjacentToFive: boolean;
}

const initialCardState: CardState = {
  cardNumber: 6,
  probabilityOfFive: 0,
  selected: false,
  adjacentToFive: false,
};

const Board: React.FC = () => {
  const [boardState, setBoardState] = useState<CardState[][]>(
    Array(5).fill(Array(5).fill(initialCardState))
  );
  const [selectedCardPosition, setSelectedCardPosition] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const handleCardSelection = (row: number, col: number) => {
    const boardWithSelectedCard = boardState.map((rowArray, rowIndex) =>
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
    setBoardState(boardWithSelectedCard);

    if (boardWithSelectedCard[row][col].selected) {
      setSelectedCardPosition({ row, col });
    } else {
      setSelectedCardPosition(null);
    }
  };

  const handleCardChangeClick = (newCardNumber: number) => {
    if (selectedCardPosition !== null) {
      const { row, col } = selectedCardPosition;
      const boardWithNewCard = boardState.map((rowArray, rowIndex) =>
        rowArray.map((card, colIndex) => {
          if (rowIndex === row && colIndex === col && newCardNumber !== 7) {
            return {
              ...card,
              cardNumber: newCardNumber,
              probabilityOfFive: 0,
            };
          }
          if (rowIndex === row && colIndex === col && newCardNumber === 7) {
            return {
              ...card,
              adjacentToFive: !card.adjacentToFive,
            };
          }
          return card;
        })
      );
      // setBoardState(boardWithNewCard);

      const boardWithHiddenFives = showHiddenFives(boardWithNewCard);
      // setBoardState(boardWithHiddenFives);

      const boardWithFivesProbability =
        calculateProbabilityOfFive(boardWithHiddenFives);
      setBoardState(boardWithFivesProbability);
    }
  };

  const showHiddenFives = (boardState: CardState[][]) => {
    // Pierwszy przebieg: zmiana szarych piątek na nieodkryte karty czyli reset pól na których prawdopodobnie może znajdować się 5 przed nowymi ustaleniami
    for (let row = 0; row < boardState.length; row++) {
      for (let col = 0; col < boardState[row].length; col++) {
        const currentCard = boardState[row][col];
        if (currentCard.cardNumber === 7)
          boardState[row][col] = {
            ...currentCard,
            cardNumber: 6,
            probabilityOfFive: 0,
          };
      }
    }

    // Drugi przebieg: zmiana kart sąsiadujących z kartami, które mają ustawioną flagę adjacentToFive
    for (let row = 0; row < boardState.length; row++) {
      for (let col = 0; col < boardState[row].length; col++) {
        const currentCard = boardState[row][col];
        if (currentCard.adjacentToFive) {
          // Sprawdź sąsiadów karty
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const newRow = row + i;
              const newCol = col + j;
              // Pomiń aktualnie wybraną kartę
              if (i === 0 && j === 0) {
                continue;
              }
              // Sprawdź czy nowe współrzędne są w granicach tablicy
              if (
                newRow >= 0 &&
                newRow < boardState.length &&
                newCol >= 0 &&
                newCol < boardState[row].length
              ) {
                const adjacentCard = boardState[newRow][newCol];
                // Jeśli sąsiadująca karta ma cardNumber równy 6, zmień go na 7
                if (adjacentCard.cardNumber === 6) {
                  boardState[newRow][newCol] = {
                    ...adjacentCard,
                    cardNumber: 7,
                  };
                }
              }
            }
          }
        }
      }
    }

    // Trzeci przebieg: zmiana sąsiadujących kart z kartami o cardNumber <= 5, które nie mają flagi adjacentToFive
    for (let row = 0; row < boardState.length; row++) {
      for (let col = 0; col < boardState[row].length; col++) {
        const currentCard = boardState[row][col];
        if (currentCard.cardNumber <= 5 && !currentCard.adjacentToFive) {
          // Sprawdź sąsiadów karty
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const newRow = row + i;
              const newCol = col + j;
              // Sprawdź czy nowe współrzędne są w granicach tablicy
              if (
                newRow >= 0 &&
                newRow < boardState.length &&
                newCol >= 0 &&
                newCol < boardState[row].length
              ) {
                const adjacentCard = boardState[newRow][newCol];
                // Jeśli sąsiadująca karta ma cardNumber równy 7, zmień go na 6
                if (adjacentCard.cardNumber === 7) {
                  boardState[newRow][newCol] = {
                    ...adjacentCard,
                    cardNumber: 6,
                  };
                }
              }
            }
          }
        }
      }
    }

    return boardState;
  };

  const calculateProbabilityOfFive = (boardState: CardState[][]) => {
    for (let row = 0; row < boardState.length; row++) {
      for (let col = 0; col < boardState[row].length; col++) {
        const currentCard = boardState[row][col];
        if (currentCard.adjacentToFive) {
          let countAdjacentSevens = 0;
          // Sprawdź sąsiadów karty
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const newRow = row + i;
              const newCol = col + j;
              // Sprawdź czy nowe współrzędne są w granicach tablicy
              if (
                newRow >= 0 &&
                newRow < boardState.length &&
                newCol >= 0 &&
                newCol < boardState[row].length
              ) {
                const adjacentCard = boardState[newRow][newCol];
                // Jeśli sąsiadująca karta ma cardNumber równy 7, zwiększ licznik
                if (
                  adjacentCard.cardNumber === 7 ||
                  adjacentCard.cardNumber === 4
                ) {
                  countAdjacentSevens++;
                }
              }
            }
          }

          // Dla każdej karty o cardNumber === 7 ustaw probabilityOfFive
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const newRow = row + i;
              const newCol = col + j;
              // Sprawdź czy nowe współrzędne są w granicach tablicy
              if (
                newRow >= 0 &&
                newRow < boardState.length &&
                newCol >= 0 &&
                newCol < boardState[row].length
              ) {
                const adjacentCard = boardState[newRow][newCol];
                if (adjacentCard.cardNumber === 7) {
                  const oldProbabilityOfFive =
                    boardState[newRow][newCol].probabilityOfFive;
                  const newProbabilityOfFive = 1 / countAdjacentSevens;
                  // Ustaw probabilityOfFive dla każdej karty o cardNumber === 7
                  if (newProbabilityOfFive > oldProbabilityOfFive) {
                    boardState[newRow][newCol].probabilityOfFive =
                      newProbabilityOfFive;
                  }
                }
              }
            }
          }
        }
      }
    }
    return boardState;
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
              key={`${rowIndex}*${colIndex}`}
              cardNumber={card.cardNumber}
              selected={card.selected}
              probabilityOfFive={card.probabilityOfFive}
              onClick={() => handleCardSelection(rowIndex, colIndex)}
            />
          ))
        )}
      </div>
      {selectedCardPosition !== null && (
        <div className="flex flex-wrap-reverse gap-1 w-96 justify-center">
          {[...Array(8)].map((_, index) => (
            <Card
              key={index}
              cardNumber={index}
              isButton={true}
              onClick={() => handleCardChangeClick(index)}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Board;
