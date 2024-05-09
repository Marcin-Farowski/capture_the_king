"use client";

import React, { useState, useRef } from "react";
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
  cardNumber: 0,
  probabilityOfFive: 0,
  selected: false,
  adjacentToFive: false,
};

const Board: React.FC = () => {
  const [boardState, setBoardState] = useState(() => {
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

    return initialBoardState;
  });
  const [selectedCardPosition, setSelectedCardPosition] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const fivesRevealedRef = useRef<number>(0);
  const cardsAdjacentToFive: CardState[] = [];

  const handleCardSelection = (selectedRow: number, selectedCol: number) => {
    setBoardState((prevBoardState) => {
      const updatedBoardState = prevBoardState.map((rowArray, rowIndex) =>
        rowArray.map((card, colIndex) => {
          const isSelected =
            rowIndex === selectedRow && colIndex === selectedCol;
          return {
            ...card,
            selected: isSelected ? !card.selected : false,
          };
        })
      );

      return updatedBoardState;
    });

    setSelectedCardPosition((prevPosition) =>
      prevPosition?.row === selectedRow && prevPosition?.col === selectedCol
        ? null
        : { row: selectedRow, col: selectedCol }
    );
  };

  const handleCardChangeClick = (newCardNumber: number) => {
    const boardWithNewCard = updateBoardWithNewCard(newCardNumber);
    const boardWithHiddenFives = showHiddenFives(boardWithNewCard);
    
    const triplets = findTripletsWithoutCommonNeighbors(cardsAdjacentToFive);
    const tripletWithLeastAdjacentPotentialFives = findTripletWithLeastAdjacentPotentialFives(
      triplets,
      boardWithHiddenFives
    );
    const boardWithNumbersBasedOnNeighbors = updateNumbersBasedOnNeighbors(
      tripletWithLeastAdjacentPotentialFives,
      fivesRevealedRef.current,
      boardWithHiddenFives
    );

    const boardWithExcludedAdjacentFivesCards = findExcludedAdjacentFivesCards(boardWithNumbersBasedOnNeighbors, tripletWithLeastAdjacentPotentialFives);

    const boardWithFivesProbability =
      updateProbabilityOfFives(boardWithExcludedAdjacentFivesCards);

    setBoardState(boardWithFivesProbability);
  };

  const updateBoardWithNewCard = (newCardNumber: number): CardState[][] => {
    if (!selectedCardPosition) {
      return boardState;
    }

    const changeFromFiveToOtherCardNumber: boolean | null =
      selectedCardPosition &&
      boardState[selectedCardPosition.row][selectedCardPosition.col]
        .cardNumber === 5 &&
      newCardNumber !== 5;
    if (newCardNumber === 5) {
      fivesRevealedRef.current += 1;
    }
    if (changeFromFiveToOtherCardNumber) {
      fivesRevealedRef.current -= 1;
    }

    const { row, col } = selectedCardPosition;
    let boardWithNewCard = boardState.map((rowArray, rowIndex) =>
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
    return boardWithNewCard;
  };

  const resetPotentialFivesLocations = (
    boardState: CardState[][]
  ): CardState[][] => {
    for (let row = 0; row < boardState.length; row++) {
      for (let col = 0; col < boardState[row].length; col++) {
        const currentCard = boardState[row][col];
        if (currentCard.cardNumber === 7)
          boardState[row][col] = {
            ...currentCard,
            cardNumber: 0,
            probabilityOfFive: 0,
          };
      }
    }

    return boardState;
  };

  const addPotentialFives = (boardState: CardState[][]): CardState[][] => {
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
                if (adjacentCard.cardNumber === 0) {
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

    return boardState;
  };

  const removeExcludedPotentialFives = (
    boardState: CardState[][]
  ): CardState[][] => {
    for (let row = 0; row < boardState.length; row++) {
      for (let col = 0; col < boardState[row].length; col++) {
        const currentCard = boardState[row][col];
        if (
          currentCard.cardNumber > 0 &&
          currentCard.cardNumber <= 6 &&
          !currentCard.adjacentToFive
        ) {
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
                // Jeśli sąsiadująca karta ma cardNumber równy 7, zmień go na 0
                if (adjacentCard.cardNumber === 7) {
                  boardState[newRow][newCol] = {
                    ...adjacentCard,
                    cardNumber: 0,
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

  const showHiddenFives = (boardState: CardState[][]) => {
    // Pierwszy przebieg: zmiana szarych piątek na nieodkryte karty czyli reset pól na których prawdopodobnie może znajdować się 5 przed nowymi ustaleniami
    boardState = resetPotentialFivesLocations(boardState);

    // Drugi przebieg: zmiana kart sąsiadujących z kartami, które mają ustawioną flagę adjacentToFive
    boardState = addPotentialFives(boardState);

    // Trzeci przebieg: zmiana sąsiadujących kart z kartami o cardNumber <= 5, które nie mają flagi adjacentToFive
    boardState = removeExcludedPotentialFives(boardState);

    return boardState;
  };

  const getAdjacentPotentialFivesCount = (boardState: CardState[][], row: number, col: number): number => {
    let countAdjacentPotentialFives = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newRow = row + i;
        const newCol = col + j;
        if (
          newRow >= 0 &&
          newRow < boardState.length &&
          newCol >= 0 &&
          newCol < boardState[row].length
        ) {
          const adjacentCard = boardState[newRow][newCol];
          if (adjacentCard.cardNumber === 7 || adjacentCard.cardNumber === 5) {
            countAdjacentPotentialFives++;
          }
        }
      }
    }
    return countAdjacentPotentialFives;
  };
  
  const updateProbabilityOfFives = (boardState: CardState[][]) => {
    for (let row = 0; row < boardState.length; row++) {
      for (let col = 0; col < boardState[row].length; col++) {
        const currentCard = boardState[row][col];
        if (currentCard.adjacentToFive) {
          const countAdjacentPotentialFives = getAdjacentPotentialFivesCount(boardState, row, col);
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const newRow = row + i;
              const newCol = col + j;
              if (
                newRow >= 0 &&
                newRow < boardState.length &&
                newCol >= 0 &&
                newCol < boardState[row].length
              ) {
                const adjacentCard = boardState[newRow][newCol];
                if (adjacentCard.cardNumber === 7) {
                  const oldProbabilityOfFive = adjacentCard.probabilityOfFive;
                  const newProbabilityOfFive = 1 / countAdjacentPotentialFives;
                  if (newProbabilityOfFive > oldProbabilityOfFive) {
                    adjacentCard.probabilityOfFive = newProbabilityOfFive;
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

    return tripletsWithoutCommonNeighbors;
  };

  // Funkcja sprawdzająca, czy dwie karty mają wspólnych najbliższych sąsiadów
  const haveCommonNeighbors = (card1: CardState, card2: CardState): boolean => {
    return (
      Math.abs(card1.row - card2.row) <= 2 &&
      Math.abs(card1.col - card2.col) <= 2
    );
  };

  const findTripletWithLeastAdjacentPotentialFives = (
    triplets: CardState[][],
    boardState: CardState[][]
  ): CardState[] | null => {
    if (triplets.length === 0) return null;

    let tripletWithLeastAdjacentPotentialFives: CardState[] = triplets[0];
    let minAdjacentSevens = countAdjacentPotentialFives(triplets[0], boardState);

    for (let i = 0; i < triplets.length; i++) {
      const currentTriplet = triplets[i];
      const adjacentSevens = countAdjacentPotentialFives(currentTriplet, boardState);
      console.log(`Triplet ${i}: Adjacent Sevens: ${adjacentSevens}`);
      if (adjacentSevens < minAdjacentSevens) {
        minAdjacentSevens = adjacentSevens;
        tripletWithLeastAdjacentPotentialFives = currentTriplet;
      }
    }

    console.log(
      `Triplet with least adjacent sevens: ${JSON.stringify(
        tripletWithLeastAdjacentPotentialFives
      )}`
    );

    return tripletWithLeastAdjacentPotentialFives;
  };

  const countAdjacentPotentialFives = (
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

  const updateNumbersBasedOnNeighbors = (
    triplets: CardState[] | null,
    fivesRevealedRef: number,
    boardState: CardState[][]
  ): CardState[][] => {
    if (triplets === null) {
      return boardState;
    }

    const cardsWithoutNeighbourFive: CardState[] = [];

    if (fivesRevealedRef < 3) {
      triplets.forEach((triplet, index) => {
        // Szukanie kart z triplet, które nie mają najbliższego sąsiada z numerem 5
        if (!hasNeighborNumber(triplet, boardState, 5)) {
          cardsWithoutNeighbourFive.push(triplet);
        }
      });
      console.log(
        "cards without neighbor five: " +
          JSON.stringify(cardsWithoutNeighbourFive)
      );

      // Zmiana numerów kart na 0, jeśli spełniają warunki
      if (cardsWithoutNeighbourFive.length > 0) {
        boardState.forEach((row) => {
          row.forEach((card) => {
            if (
              card.cardNumber === 7 &&
              !hasNeighborFromList(card, cardsWithoutNeighbourFive, boardState)
            ) {
              card.cardNumber = 0;
            }
          });
        });
      }
    }
    if (fivesRevealedRef >= 3) {
      boardState.forEach((row) => {
        row.forEach((card) => {
          if (card.cardNumber === 7) {
            card.cardNumber = 0;
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

  const findExcludedAdjacentFivesCards = (
    boardState: CardState[][],
    tripletWithLeastAdjacentPotentialFives: CardState[] | null
  ): CardState[][] => {
    const excludedAdjacentFivesCards: CardState[] = [];

    if (!tripletWithLeastAdjacentPotentialFives) {
      return boardState;
    }
  
    // Przejście przez planszę
    for (let row = 0; row < boardState.length; row++) {
      for (let col = 0; col < boardState[row].length; col++) {
        const currentCard = boardState[row][col];
  
        // Sprawdzenie czy karta ma flagę adjacentToFive ustawioną na true
        if (currentCard.adjacentToFive && !tripletWithLeastAdjacentPotentialFives.includes(currentCard)) {
          const cardsFromTriplet = new Set<CardState>();
  
          // Przejście przez sąsiadujące karty
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const newRow = row + i;
              const newCol = col + j;
  
              // Pominięcie aktualnej karty
              if (i === 0 && j === 0) {
                continue;
              }
  
              // Sprawdzenie czy sąsiadująca karta mieści się w granicach planszy
              if (
                newRow >= 0 &&
                newRow < boardState.length &&
                newCol >= 0 &&
                newCol < boardState[0].length
              ) {
                const adjacentCard = boardState[newRow][newCol];
  
                // Sprawdzenie czy sąsiednia karta ma sąsiada z którąś z kart z tripletWithLeastAdjacentPotentialFives
                  tripletWithLeastAdjacentPotentialFives.forEach((adjacentToFiveCard) => {
                    if (
                    hasNeighbor(adjacentCard, adjacentToFiveCard, boardState)) {

                      cardsFromTriplet.add(adjacentToFiveCard);
                    }
                  })
              }
            }
          }
  
          // Sprawdzenie czy sąsiadujące karty tworzą zbiór, który zawiera elementy z tylko jednego z trzech zbiorów
          if (cardsFromTriplet.size === 1) {
            excludedAdjacentFivesCards.push(currentCard);
            const iterator = cardsFromTriplet.values();
            const firstElementFromTriplet = iterator.next().value;
            boardState = updateNeighborCards(firstElementFromTriplet, currentCard, boardState);
          }
        }
      }
    }
  
    // Wypisanie znalezionych kart
    console.log("Znalezione karty:");
    excludedAdjacentFivesCards.forEach((card) => {
      console.log(`(${card.row}, ${card.col})`);
    });
  
    return boardState;
  };

  const updateNeighborCards = (
    card1: CardState,
    card2: CardState,
    boardState: CardState[][]
  ): CardState[][] => {  
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newRow = card1.row + i;
        const newCol = card1.col + j; 
          
        // Pominięcie aktualnej karty
        if (i === 0 && j === 0) {
          continue;
        }

        // Sprawdzenie czy sąsiadująca karta mieści się w granicach planszy
        if (
          newRow >= 0 &&
          newRow < boardState.length &&
          newCol >= 0 &&
          newCol < boardState[0].length
        ) {
          const adjacentCard = boardState[newRow][newCol];

        if (!hasNeighbor(adjacentCard, card2, boardState)) {
          if (adjacentCard.cardNumber === 7) {
            adjacentCard.cardNumber = 0;
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
          width: "265px",
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
