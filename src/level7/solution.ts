import { readAs } from "aoc-util";

interface Hand {
  cards: string[];
  bestCards?: string[];
  bestScore?: number;
  bestPairScore?: number;
  bet: number;
  rank?: number;
  score: number;
  pairScore: number;
}

const cardsPart1 = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const cardsPart2 = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'];

const findBiggestCard = (cards: string[], deck: string[]) => {
  const biggestCardIndex = Math.min(...cards.map((card) => deck.indexOf(card)));
  return 14 - biggestCardIndex;
};

const findHandScore = (cards: string[], deck: string[]) => {
  let score = 0;
  let pairScore = 0;

  const cardsMap: { [key: string]: number } = cards.reduce((acc, card) => {
    if (acc[card] === undefined) {
      acc[card] = 1;
    } else {
      acc[card]++;
    }
    return acc;
  }, {});

  const cardsCount = Object.values(cardsMap);
  const cardsMax = Math.max(...cardsCount);

  if (cardsMax === 5) {
    pairScore = 7;
    score += 84;
    score += findBiggestCard(cards, deck);
  }
  else if (cardsMax === 4) {
    pairScore = 6;
    score += 70;
    score += findBiggestCard(cards.filter((card) => cardsMap[card] === 4), deck);
  }
  else if (cardsMax === 3) {
    if (cardsCount.includes(2)) {
      pairScore = 5;
      score += 56;
      score += findBiggestCard(cards.filter((card) => cardsMap[card] === 3), deck) / 2;
      score += findBiggestCard(cards.filter((card) => cardsMap[card] === 2), deck) / 4;
    } else {
      pairScore = 4;
      score += 42;
      score += findBiggestCard(cards.filter((card) => cardsMap[card] === 3), deck);
    }
  }
  else if (cardsMax === 2) {
    score += 14;
    if (cardsCount.filter(c => c === 2).length === 1) {
      pairScore = 2;
      score += findBiggestCard(cards.filter((card) => cardsMap[card] === 2), deck);
    } else {
      pairScore = 3;
      score += 14;
      const twoPairs = cards.filter((card) => cardsMap[card] === 2);
      const pair1Score = findBiggestCard([twoPairs[0]], deck);
      const pair2Score = findBiggestCard([twoPairs[2]], deck);
      score += (pair1Score + pair2Score) / 2;
    }
  }
  else if (cardsMax === 1) {
    pairScore = 1;
    score += findBiggestCard(cards, deck);
  }

  return [score, pairScore];
};

const sortHands = (hands: Hand[], bestScore: boolean = false) => {
  return hands.sort((a, b) => {
    if (bestScore) {
      if (a.bestPairScore !== b.bestPairScore) {
        return b.bestPairScore - a.bestPairScore;
      } else {
        const cardsCount = a.cards.length;
        for (let i = 0; i <= cardsCount; i++) {
          if (a.cards[i] != b.cards[i]) {
            return cardsPart2.indexOf(a.cards[i]) - cardsPart2.indexOf(b.cards[i]);
          }
        }
      }
    }
    else {
      if (a.pairScore !== b.pairScore) {
        return b.pairScore - a.pairScore;
      } else {
        const cardsCount = a.cards.length;
        for (let i = 0; i <= cardsCount; i++) {
          if (a.cards[i] != b.cards[i]) {
            return cardsPart1.indexOf(a.cards[i]) - cardsPart1.indexOf(b.cards[i]);
          }
        }
      }
    };
  })
};

const rankHands = (hands: Hand[]) => {
  return hands.map((hand, i) => {
    hand.rank = (hands.length - i);
    return hand;
  });
};

const hands = readAs<Hand[]>({
  path: "src/level7/input.txt",
  parser: (lines: string[]) => {
    const result: Hand[] = [];
    for (const line of lines) {
      const [cards, bet] = line.split(" ");
      const [score, pairScore] = findHandScore(cards.split(""), cardsPart1);
      result.push({
        cards: cards.split(""),
        score,
        pairScore,
        bet: Number(bet),
      })
    }
    return result;
  }
});

const part1Hands = rankHands(sortHands(hands));
const winnings = part1Hands.reduce((acc, hand) => {
  acc += hand.bet * hand.rank;
  return acc;
}, 0);
console.log(`Part 1 solution: ${winnings}`);

const findAllCombinations = (card: string[]): string[][] => {
  const combinations: string[][] = [];
  if (!card.includes('J')) {
    return combinations;
  }

  const jIndex = card.indexOf('J');
  for (const c of cardsPart2) {
    if (c === 'J') continue;
    const newCard = card.map((cc, i) => i === jIndex ? c : cc);
    combinations.push(newCard);
    combinations.push(...findAllCombinations(newCard));
  }

  return combinations;
};

const findBestCombination = (hand: Hand) => {
  if (!hand.cards.includes('J')) {
    hand.bestScore = hand.score;
    hand.bestCards = hand.cards;
    hand.bestPairScore = hand.pairScore;
    return;
  }

  const combinations = findAllCombinations(hand.cards);
  let bestScore = 0;
  let bestCards = [];
  let bestPairScore = 0;
  for (const combination of combinations) {
    const [score, pairScore] = findHandScore(combination, cardsPart2);
    if (score > bestScore) {
      bestScore = score;
      bestCards = combination;
      bestPairScore = pairScore;
    }
  }
  hand.bestScore = bestScore;
  hand.bestCards = bestCards;
  hand.bestPairScore = bestPairScore;
}

for (const hand of part1Hands) {
  findBestCombination(hand);
}

const part2Hands = rankHands(sortHands(hands, true));

const winnings2 = part2Hands.reduce((acc, hand) => {
  acc += hand.bet * hand.rank;
  return acc;
}, 0);
console.log(`Part 2 solution: ${winnings2}`);