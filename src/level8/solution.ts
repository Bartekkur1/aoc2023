import { readAs } from "aoc-util";

const LEFT = 'left';
const RIGHT = 'right';

interface Input {
  moves: string[];
  map: string[][];
}

const input = readAs<Input>({
  path: 'src/level8/input.txt',
  parser: (lines: string[]) => {
    const input: Input = {
      moves: [],
      map: []
    };
    for (const line of lines) {
      if (line === '') { continue; }
      if (input.moves.length === 0) {
        input.moves = line.split('');
        continue;
      }

      const [_, value, left, right] = line.match(/([0-9A-Z]+)\s=\s\(([0-9A-Z]+),\s([0-9A-Z]+)\)/);
      input.map[value] = [];
      input.map[value][LEFT] = left;
      input.map[value][RIGHT] = right;
    }
    return input;
  }
});

const findStartPositions = (input: Input) => Object.keys(input.map).filter((e) => e[2] === 'A');

const findMoves = (input: Input, start: string) => {
  let steps = 0;
  let iteration = start;
  let moveIndex = 0;
  let move = undefined;

  while (iteration[2] !== 'Z') {
    move = input.moves[moveIndex];
    if (move === undefined) {
      moveIndex = 0;
      move = input.moves[moveIndex];
    }
    moveIndex++;

    let direction = move === 'L' ? LEFT : RIGHT;
    iteration = input.map[iteration][direction];
    steps++;
  }
  return steps;
};

// [ 'AAA', 'RLA', 'QLA', 'QFA', 'RXA', 'JSA' ]
const startingPositions = findStartPositions(input);
// [18157, 14363, 16531, 12737, 19783, 19241];
const stepsCount = [];
for (const p of startingPositions) {
  stepsCount.push(findMoves(input, p));
}

const biggestCommonDivisor = (a: number, b: number) => b === 0 ? a : biggestCommonDivisor(b, a % b);

const biggestCommonArrayDivisor = (arr: number[]) => {
  let res = arr[0];
  for (let i = 1; i < arr.length; i++) {
    res = (res * arr[i]) / biggestCommonDivisor(res, arr[i]);
  }
  return res;
};

const part2Res = biggestCommonArrayDivisor(stepsCount);
console.log(part2Res);
