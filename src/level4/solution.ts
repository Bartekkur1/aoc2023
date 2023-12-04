import { readAs } from "aoc-util";

interface ScratchCard {
  id: number;
  numbers: number[];
  winningNumbers: number[];
  matchingNumbersCount: number;
  score: number;
}

const findCardScore = (card: ScratchCard) => {
  let score = card.numbers.reduce((acc, num) => {
    if (card.winningNumbers.includes(num)) {
      acc += 1;
    }
    return acc;
  }, 0);
  card.matchingNumbersCount = score;
  card.score = score > 0 ? Math.pow(2, score - 1) : 0;
};

const cards = readAs<ScratchCard[]>({
  path: './src/level4/input.txt',
  parser: (lines: string[]) => {
    const cards: ScratchCard[] = [];
    for (const line of lines) {
      const cardId = Number(line.split(':')[0].match(/\d+/g)[0]);
      const inputNumbers = line.split(':')[1].split('|');
      const numbers = inputNumbers[0].match(/\d+/g).map(Number);
      const winningNumbers = inputNumbers[1].match(/\d+/g).map(Number);
      const card: ScratchCard = {
        id: cardId,
        numbers,
        winningNumbers,
        matchingNumbersCount: 0,
        score: 0
      }
      findCardScore(card);
      cards.push(card);
    }
    return cards;
  }
});

let cardsProcessed = 0;
let cardsToProcess = [...cards];
while (cardsToProcess.length > 0) {
  const nextIteration = [];
  for (const card of cardsToProcess) {
    cardsProcessed += 1;
    if (card.matchingNumbersCount === 0) {
      continue;
    }
    const idRange = (c: ScratchCard) => c.id > card.id && c.id <= card.id + card.matchingNumbersCount;
    const cardsWon = cards.filter(idRange);
    nextIteration.push(...cardsWon);
  }
  cardsToProcess = nextIteration;
}

console.log(cardsProcessed);
