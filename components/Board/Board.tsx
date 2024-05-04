"use client";

import React, { useEffect, useState } from "react";
import Card from "../Card";

interface CardState {
  row: number;
  col: number;
  cardNumber: number;
  probabilityOfFive: number;
  selected: boolean;
  adjacentToFive: boolean;
}

const initialCardState: CardState = {
  row: 0,
  col: 0,
  cardNumber: 6,
  probabilityOfFive: 0,
  selected: false,
  adjacentToFive: false,
};

const Board: React.FC = () => {
  const [boardState, setBoardState] = useState<CardState[][]>([]);
  const [selectedCardPosition, setSelectedCardPosition] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [fivesRevealed, setFivesRevealed] = useState<number>(0);
  const cardsAdjacentToFive: CardState[] = [];

  useEffect(() => {
    const initialBoardState = Array(5)
      .fill([])
      .map((_, rowIndex) =>
        Array(5)
          .fill({})
          .map((_, colIndex) => ({
            ...initialCardState,
            row: rowIndex,
            col: colIndex,
          }))
      );

    setBoardState(initialBoardState);
  }, []);

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
    const changeFromFiveToOtherCardNumber: boolean | null = selectedCardPosition && boardState[selectedCardPosition.row][selectedCardPosition.col].cardNumber === 4 && newCardNumber !== 4;
    let fivesRevealedLocal = fivesRevealed;
    if (newCardNumber === 4) {
      fivesRevealedLocal = fivesRevealed + 1;
      setFivesRevealed(fivesRevealed + 1);
    }
    if (changeFromFiveToOtherCardNumber) {
      fivesRevealedLocal = fivesRevealed - 1;
      setFivesRevealed(fivesRevealed - 1);
    }
    if (selectedCardPosition !== null) {
      const { row, col } = selectedCardPosition;
      const boardWithNewCard = boardState.map((rowArray, rowIndex) =>
        rowArray.map((card, colIndex) => {
          if (rowIndex === row && colIndex === col) {
            if (newCardNumber !== 7) {
              return {
                ...card,
                cardNumber: newCardNumber,
                probabilityOfFive: 0,
              };
            }
            if (newCardNumber === 7) {
              return {
                ...card,
                adjacentToFive: !card.adjacentToFive,
              };
            }
          }
          return card;
        })
      );
      // setBoardState(boardWithNewCard);

      const boardWithHiddenFives = showHiddenFives(boardWithNewCard);
      // setBoardState(boardWithHiddenFives);

      const boardWithFivesProbability =
        calculateProbabilityOfFive(boardWithHiddenFives);
      // setBoardState(boardWithFivesProbability);

      const triplets = findTripletsWithoutCommonNeighbors(cardsAdjacentToFive);
      const tripletWithLeastAdjacentSevens = findTripletWithLeastAdjacentSevens(
        triplets,
        boardWithFivesProbability
      );

      const boardWithNumbersBasedOnNeighbors = updateNumbersBasedOnNeighbors(
        tripletWithLeastAdjacentSevens,
        fivesRevealedLocal,
        boardWithFivesProbability
      );
      console.log("fivesRevealed: " + fivesRevealed);

      setBoardState(boardWithNumbersBasedOnNeighbors);
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
          cardsAdjacentToFive.push(currentCard);
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

  const findTripletsWithoutCommonNeighbors = (
    cardsAdjacentToFive: CardState[]
  ): CardState[][] => {
    const tripletsWithoutCommonNeighbors: CardState[][] = [];

    // Przeszukaj wszystkie kombinacje trzech kart
    for (let i = 0; i < cardsAdjacentToFive.length; i++) {
      const card1 = cardsAdjacentToFive[i];

      for (let j = i + 1; j < cardsAdjacentToFive.length; j++) {
        const card2 = cardsAdjacentToFive[j];

        for (let k = j + 1; k < cardsAdjacentToFive.length; k++) {
          const card3 = cardsAdjacentToFive[k];

          // Sprawdź, czy trzy karty nie mają wspólnych najbliższych sąsiadów
          if (
            !haveCommonNeighbors(card1, card2) &&
            !haveCommonNeighbors(card1, card3) &&
            !haveCommonNeighbors(card2, card3)
          ) {
            tripletsWithoutCommonNeighbors.push([card1, card2, card3]);
          }
        }
      }
    }

    // Wyświetl znalezione trójki kart
    console.log("Trójki kart bez wspólnych sąsiadów:");
    tripletsWithoutCommonNeighbors.forEach((cards) => {
      console.log(
        `(${cards[0].row},${cards[0].col}) - (${cards[1].row},${cards[1].col}) - (${cards[2].row},${cards[2].col})`
      );
    });

    // // Wypisz zawartość boardState
    // console.log("Zawartość boardState:");
    // boardState.forEach((row, rowIndex) => {
    //   row.forEach((card, colIndex) => {
    //     console.log(
    //       `row: ${card.row}, col: ${card.col}, cardNumber: ${card.cardNumber}`
    //     );
    //   });
    // });

    return tripletsWithoutCommonNeighbors;
  };

  // Funkcja sprawdzająca, czy dwie karty mają wspólnych najbliższych sąsiadów
  const haveCommonNeighbors = (card1: CardState, card2: CardState): boolean => {
    return (
      Math.abs(card1.row - card2.row) <= 2 &&
      Math.abs(card1.col - card2.col) <= 2
    );
  };

  const findTripletWithLeastAdjacentSevens = (
    triplets: CardState[][],
    boardState: CardState[][]
  ): CardState[] | null => {
    if (triplets.length === 0) return null;

    let tripletWithLeastAdjacentSevens: CardState[] = triplets[0];
    let minAdjacentSevens = countAdjacentSevens(triplets[0], boardState);

    for (let i = 0; i < triplets.length; i++) {
      const currentTriplet = triplets[i];
      const adjacentSevens = countAdjacentSevens(currentTriplet, boardState);
      console.log(`Triplet ${i}: Adjacent Sevens: ${adjacentSevens}`);
      if (adjacentSevens < minAdjacentSevens) {
        minAdjacentSevens = adjacentSevens;
        tripletWithLeastAdjacentSevens = currentTriplet;
      }
    }

    console.log(
      `Triplet with least adjacent sevens: ${JSON.stringify(
        tripletWithLeastAdjacentSevens
      )}`
    );

    return tripletWithLeastAdjacentSevens;
  };

  const countAdjacentSevens = (
    cards: CardState[],
    boardState: CardState[][]
  ): number => {
    let count = 0;

    for (const card of cards) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i !== 0 || j !== 0) {
            const newRow = card.row + i;
            const newCol = card.col + j;
            // Sprawdź czy nowe współrzędne są w granicach tablicy
            if (
              newRow >= 0 &&
              newRow < boardState.length &&
              newCol >= 0 &&
              newCol < boardState[0].length
            ) {
              const adjacentCard = boardState[newRow][newCol];
              // Jeśli sąsiadująca karta ma cardNumber równy 7, zwiększ licznik
              if (adjacentCard.cardNumber === 7) {
                console.log(`petla ${JSON.stringify(card)}`);
                count++;
              }
            }
          }
        }
      }
    }

    console.log("count:" + count);

    return count;
  };

  // const updateNumbersBasedOnNeighbors = (triplets: CardState[] | null, fivesRevealed: number, boardState: CardState[][]): CardState[][] => {
  //   if (triplets === null) {
  //     return boardState;
  //   }
  //   const cardsWithoutNeighbourFive: CardState[];
  //   if (fivesRevealed > 0) {
  //     triplets.forEach((triplet, index) => {
  //       napisz w tym miejscu podwójną pętle która będzie sprawdzać najbliższe sąsiadujące karty w poszukiwaniu tych kart z triplet które nie mają najbliższego sąsiada karty o cardNumber===4
  //       jeśli znajdziesz taką to dodaj ją do tablicy cardsWithoutNeighbourFive
  //     });
  //     tutaj jeśli cardsWithoutNeighbourFive posiada jakieś elementy to iteruj przez całą tablice boardState i zmieniaj cardNumber na cardNumber=6 kartom które spełniają następujące dwa warunki: - cardNumber===7
  //     - karta ta nie ma jako najbliżeszgo sąsiada karty która jest w tablicy cardsWithoutNeighbourFive
  //   }

  //   tutaj zwróć nową zmodyfikowaną tablicę boardState
  // };

  const updateNumbersBasedOnNeighbors = (
    triplets: CardState[] | null,
    fivesRevealed: number,
    boardState: CardState[][]
  ): CardState[][] => {
    if (triplets === null) {
      return boardState;
    }

    const cardsWithoutNeighbourFive: CardState[] = [];

    if (fivesRevealed < 3) {
      triplets.forEach((triplet, index) => {
        // Szukanie kart z triplet, które nie mają najbliższego sąsiada z numerem 4
        if (!hasNeighborNumber(triplet, boardState, 4)) {
          cardsWithoutNeighbourFive.push(triplet);
        }
      });
      console.log(
        "cards without neighbor five: " +
          JSON.stringify(cardsWithoutNeighbourFive)
      );

      // Zmiana numerów kart na 6, jeśli spełniają warunki
      if (cardsWithoutNeighbourFive.length > 0) {
        boardState.forEach((row) => {
          row.forEach((card) => {
            if (
              card.cardNumber === 7 &&
              !hasNeighborFromList(card, cardsWithoutNeighbourFive, boardState)
            ) {
              card.cardNumber = 6;
            }
          });
        });
      }
    }
    if (fivesRevealed === 3) {
      boardState.forEach((row) => {
        row.forEach((card) => {
          if (card.cardNumber === 7) {
            card.cardNumber = 6;
          }
        });
      });
    }

    return boardState;
  };

  // Sprawdza, czy wśród sąsiadów karty znajduje się karta z danym numerem
  const hasNeighborNumber = (
    card: CardState,
    boardState: CardState[][],
    number: number
  ): boolean => {
    const { row, col } = card;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newRow = row + i;
        const newCol = col + j;
        if (
          newRow >= 0 &&
          newRow < boardState.length &&
          newCol >= 0 &&
          newCol < boardState[0].length
        ) {
          const neighborCard = boardState[newRow][newCol];
          if (neighborCard.cardNumber === number) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // Sprawdza, czy karta ma sąsiada z listy kart
  const hasNeighborFromList = (
    card: CardState,
    cards: CardState[],
    boardState: CardState[][]
  ): boolean => {
    return cards.some((otherCard) => {
      return hasNeighbor(card, otherCard, boardState);
    });
  };

  // Sprawdza, czy karta ma danego sąsiada
  // Sprawdza, czy karta ma danego sąsiada
  const hasNeighbor = (
    card: CardState,
    otherCard: CardState,
    boardState: CardState[][]
  ): boolean => {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newRow = card.row + i;
        const newCol = card.col + j;
        if (newRow === card.row && newCol === card.col) {
          continue; // Pominięcie sprawdzania karty samej ze sobą
        }
        if (
          newRow >= 0 &&
          newRow < boardState.length &&
          newCol >= 0 &&
          newCol < boardState[0].length
        ) {
          // const neighborCard = boardState[newRow][newCol];
          if (otherCard.row === newRow && otherCard.col === newCol) {
            return true;
          }
        }
      }
    }
    return false;
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
              row={rowIndex}
              col={colIndex}
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
