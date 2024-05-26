"use client";

import React, { useState, useRef } from "react";
import Card from "./Card";

interface CardState {
  row: number;
  col: number;
  cardNumber: number;
  probabilityOfFive: number;
  isSelected: boolean;
  adjacentToFive: boolean;
}

const initialCardState: CardState = {
  row: 0,
  col: 0,
  cardNumber: 0,
  probabilityOfFive: 0,
  isSelected: false,
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
  const cardsAdjacentToFiveWithoutRevealedNeighbours: CardState[] = [];
  const usedCardsQuantityRef = useRef<number[]>(
    Array.from({ length: 8 }, () => 0)
  );

  const handleCardSelection = (selectedRow: number, selectedCol: number) => {
    setBoardState((prevBoardState) => {
      const updatedBoardState = prevBoardState.map((rowArray, rowIndex) =>
        rowArray.map((card, colIndex) => {
          const isSelected =
            rowIndex === selectedRow && colIndex === selectedCol;
          return {
            ...card,
            isSelected: isSelected ? !card.isSelected : false,
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

  const handleCardChangeClick = (
    newCardNumber: number,
    usedCardsQuantity: number,
    maxCardQuantity: number
  ) => {
    if (usedCardsQuantity > 0 && maxCardQuantity === usedCardsQuantity) {
      return;
    }
    const boardWithNewCard = updateBoardWithNewCard(newCardNumber);
    const boardWithHiddenFives = showHiddenFives(boardWithNewCard);

    const triplets = findTripletsWithoutCommonNeighbors(cardsAdjacentToFive);

    const tripletWithLeastAdjacentPotentialFives =
      findTripletWithLeastAdjacentPotentialFives(
        triplets,
        boardWithHiddenFives
      );

    const boardWithNumbersBasedOnNeighbors = updateNumbersBasedOnNeighbors(
      tripletWithLeastAdjacentPotentialFives,
      fivesRevealedRef.current,
      boardWithHiddenFives
    );

    const boardWithExcludedAdjacentFivesCards =
      removePotentialFivesNotCommonToTwoSets(
        boardWithNumbersBasedOnNeighbors,
        tripletWithLeastAdjacentPotentialFives
      );

    const boardWithFivesProbability = updateProbabilityOfFives(
      boardWithExcludedAdjacentFivesCards
    );

    // Second pass

    const tripletWithLeastAdjacentPotentialFives2 =
      findTripletWithLeastAdjacentPotentialFives(
        triplets,
        boardWithFivesProbability
      );

    const boardWithNumbersBasedOnNeighbors2 = updateNumbersBasedOnNeighbors(
      tripletWithLeastAdjacentPotentialFives2,
      fivesRevealedRef.current,
      boardWithFivesProbability
    );

    const boardWithExcludedAdjacentFivesCards2 =
      removePotentialFivesNotCommonToTwoSets(
        boardWithNumbersBasedOnNeighbors2,
        tripletWithLeastAdjacentPotentialFives2
      );

    const boardWithFivesProbability2 = updateProbabilityOfFives(
      boardWithExcludedAdjacentFivesCards2
    );

    console.log(tripletWithLeastAdjacentPotentialFives2);

    countUsedCards(boardWithFivesProbability2, usedCardsQuantityRef);

    setBoardState(boardWithFivesProbability2);
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
          // Check the neighbors of the card
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const newRow = row + i;
              const newCol = col + j;
              // Skip the currently selected card
              if (i === 0 && j === 0) {
                continue;
              }
              // Check if new coordinates are within the array bounds
              if (
                newRow >= 0 &&
                newRow < boardState.length &&
                newCol >= 0 &&
                newCol < boardState[row].length
              ) {
                const adjacentCard = boardState[newRow][newCol];
                // If the adjacent card has cardNumber equal to 0, change it to 7
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
          // Check the neighbors of the card
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const newRow = row + i;
              const newCol = col + j;
              // Check if new coordinates are within the array bounds
              if (
                newRow >= 0 &&
                newRow < boardState.length &&
                newCol >= 0 &&
                newCol < boardState[row].length
              ) {
                const adjacentCard = boardState[newRow][newCol];
                // If the adjacent card has cardNumber equal to 7, change it to 0
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
    // First pass: changing gray fives to unrevealed cards, i.e., resetting fields where 5 is likely to be before new assumptions
    boardState = resetPotentialFivesLocations(boardState);

    // Second pass: changing cards adjacent to cards with the adjacentToFive flag set
    boardState = addPotentialFives(boardState);

    // Third pass: changing adjacent cards with cardNumber <= 5 that do not have the adjacentToFive flag
    boardState = removeExcludedPotentialFives(boardState);

    return boardState;
  };

  const getAdjacentPotentialFivesCount = (
    boardState: CardState[][],
    row: number,
    col: number
  ): number => {
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
          if (adjacentCard.cardNumber === 7) {
            countAdjacentPotentialFives++;
          }
        }
      }
    }
    return countAdjacentPotentialFives;
  };

  const updateProbabilityOfFives = (
    boardState: CardState[][]
  ): CardState[][] => {
    for (let row = 0; row < boardState.length; row++) {
      for (let col = 0; col < boardState[row].length; col++) {
        const currentCard = boardState[row][col];
        if (currentCard.adjacentToFive) {
          const countAdjacentPotentialFives = getAdjacentPotentialFivesCount(
            boardState,
            row,
            col
          );
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

    // Find all cards with probabilityOfFive === 1
    const cardsWithProbabilityOne = [];
    for (let row = 0; row < boardState.length; row++) {
      for (let col = 0; col < boardState[row].length; col++) {
        if (boardState[row][col].probabilityOfFive === 1) {
          cardsWithProbabilityOne.push(boardState[row][col]);
        }
      }
    }

    // If there are at least three such cards, update the cardNumbers and probabilities
    if (cardsWithProbabilityOne.length >= 3) {
      for (let row = 0; row < boardState.length; row++) {
        for (let col = 0; col < boardState[row].length; col++) {
          if (
            boardState[row][col].probabilityOfFive < 1 &&
            boardState[row][col].probabilityOfFive > 0
          ) {
            boardState[row][col].cardNumber = 0;
            boardState[row][col].probabilityOfFive = 0;
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

    // Search through all combinations of three cards
    for (let i = 0; i < cardsAdjacentToFive.length; i++) {
      const card1 = cardsAdjacentToFive[i];

      for (let j = i + 1; j < cardsAdjacentToFive.length; j++) {
        const card2 = cardsAdjacentToFive[j];

        for (let k = j + 1; k < cardsAdjacentToFive.length; k++) {
          const card3 = cardsAdjacentToFive[k];

          // Check if the three cards do not share common closest neighbors
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

    return tripletsWithoutCommonNeighbors;
  };

  // Function to check if two cards share common closest neighbors
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
    let minAdjacentFives = countAdjacentPotentialFives(triplets[0], boardState);

    for (let i = 0; i < triplets.length; i++) {
      const currentTriplet = triplets[i];
      const adjacentFives = countAdjacentPotentialFives(
        currentTriplet,
        boardState
      );
      if (adjacentFives < minAdjacentFives) {
        minAdjacentFives = adjacentFives;
        tripletWithLeastAdjacentPotentialFives = currentTriplet;
      }
    }

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
            // Check if the new coordinates are within the bounds of the array
            if (
              newRow >= 0 &&
              newRow < boardState.length &&
              newCol >= 0 &&
              newCol < boardState[0].length
            ) {
              const adjacentCard = boardState[newRow][newCol];
              // If the neighboring card has a cardNumber equal to 7, increment the counter
              if (adjacentCard.cardNumber === 7) {
                count++;
              }
            }
          }
        }
      }
    }

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
        // Searching for cards from the triplet that do not have a neighboring card with the number 5
        if (!hasNeighborNumber(triplet, boardState, 5)) {
          cardsWithoutNeighbourFive.push(triplet);
        }
      });

      // Changing card numbers to 0 if they meet the conditions
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

  // Checks if among the neighbors of the card there is a card with a given number
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

  // Checks if the card has a neighbor from the list of cards
  const hasNeighborFromList = (
    card: CardState,
    cards: CardState[],
    boardState: CardState[][]
  ): boolean => {
    return cards.some((otherCard) => {
      return hasNeighbor(card, otherCard, boardState);
    });
  };

  // Checks if the card has a specific neighbor
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
          continue; // Skip checking the card itself
        }
        if (
          newRow >= 0 &&
          newRow < boardState.length &&
          newCol >= 0 &&
          newCol < boardState[0].length
        ) {
          if (otherCard.row === newRow && otherCard.col === newCol) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const removePotentialFivesNotCommonToTwoSets = (
    boardState: CardState[][],
    tripletWithLeastAdjacentPotentialFives: CardState[] | null
  ): CardState[][] => {
    const excludedAdjacentFivesCards: CardState[] = [];

    if (!tripletWithLeastAdjacentPotentialFives) {
      return boardState;
    }

    // Traverse the board
    for (let row = 0; row < boardState.length; row++) {
      for (let col = 0; col < boardState[row].length; col++) {
        const currentCard = boardState[row][col];

        // Check if the card has the adjacentToFive flag set to true
        if (
          currentCard.adjacentToFive &&
          !tripletWithLeastAdjacentPotentialFives.includes(currentCard)
        ) {
          const cardsFromTriplet = new Set<CardState>();

          // Iterate through neighboring cards
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const newRow = row + i;
              const newCol = col + j;

              // Skip the current card
              if (i === 0 && j === 0) {
                continue;
              }

              // Check if the neighboring card is within the bounds of the board
              if (
                newRow >= 0 &&
                newRow < boardState.length &&
                newCol >= 0 &&
                newCol < boardState[0].length
              ) {
                const adjacentCard = boardState[newRow][newCol];

                // Check if the neighboring card has a neighbor that is one of the cards from tripletWithLeastAdjacentPotentialFives
                tripletWithLeastAdjacentPotentialFives.forEach(
                  (adjacentToFiveCard) => {
                    if (
                      hasNeighbor(adjacentCard, adjacentToFiveCard, boardState)
                    ) {
                      cardsFromTriplet.add(adjacentToFiveCard);
                    }
                  }
                );
              }
            }
          }

          // Check if the neighboring cards form a set that contains elements from only one of the three sets
          if (cardsFromTriplet.size === 1) {
            excludedAdjacentFivesCards.push(currentCard);
            const iterator = cardsFromTriplet.values();
            const firstElementFromTriplet = iterator.next().value;
            boardState = removePotentialFivesNotCommonToTwoCards(
              firstElementFromTriplet,
              currentCard,
              boardState
            );
          }
        }
      }
    }

    return boardState;
  };

  const removePotentialFivesNotCommonToTwoCards = (
    card1: CardState,
    card2: CardState,
    boardState: CardState[][]
  ): CardState[][] => {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newRow = card1.row + i;
        const newCol = card1.col + j;

        // Skip the current card
        if (i === 0 && j === 0) {
          continue;
        }

        // Check if the neighboring card is within the bounds of the board
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

  const countUsedCards = (
    boardState: CardState[][],
    usedCardsQuantityRef: React.MutableRefObject<number[]>
  ) => {
    // Initialize the result array with zeros
    const counts: number[] = Array.from({ length: 8 }, () => 0);

    // Iterate through each card in the boardState array
    boardState.forEach((row) => {
      row.forEach((card) => {
        // Increment the counter for the given card
        counts[card.cardNumber]++;
      });
    });

    // Update the values in the usedCardsQuantityRef array
    usedCardsQuantityRef.current = counts;
  };

  return (
    <>
      <div className="bg-sprite bg-no-repeat bg-[0_-117px] grid grid-cols-5 grid-rows-[repeat(5,_36)] gap-px p-[5px] mb-10">
        {boardState.map((row, rowIndex) =>
          row.map((card, colIndex) => (
            <Card
              key={`${rowIndex}*${colIndex}`}
              row={rowIndex}
              col={colIndex}
              cardNumber={card.cardNumber}
              isSelected={card.isSelected}
              probabilityOfFive={card.probabilityOfFive}
              onClick={() => handleCardSelection(rowIndex, colIndex)}
            />
          ))
        )}
      </div>
      {selectedCardPosition !== null && (
        <div className="flex flex-wrap-reverse gap-1 max-w-96 justify-center mb-20">
          {[...Array(8)].map((_, index) => (
            <Card
              key={index}
              cardNumber={index}
              isButton={true}
              usedCards={usedCardsQuantityRef.current[index]}
              onClick={(cardNumber, usedCards, maxCardQuantity) =>
                handleCardChangeClick(cardNumber, usedCards, maxCardQuantity)
              }
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Board;
