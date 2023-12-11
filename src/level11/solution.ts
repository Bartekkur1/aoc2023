import { readAs } from "aoc-util";

interface Star {
  id: number;
  position: Position;
}

interface Position {
  x: number;
  y: number;
};

const findManhattanDistance = (a: Position, b: Position) => {
  return (Math.abs(b.x - a.x)) + (Math.abs(b.y - a.y));
};

const rotateArray = (space: string[]) => {
  const result: string[] = [];
  for (let col = 0; col < space[0].length; col++) {
    let rowValue: string[] = [];
    for (let row = 0; row < space.length; row++) {
      rowValue.push(space[row][col]);
    }
    result.push(rowValue.join(''));
  }
  return result;
};

const findSpaceStars = (space: string[]): Star[] => {
  const stars: Star[] = [];
  for (let row = 0; row < space.length; row++) {
    for (let col = 0; col < space[row].length; col++) {
      if (space[row][col] === "#") {
        stars.push({ position: { x: col, y: row }, id: stars.length + 1 });
      }
    }
  }
  return stars;
};

const findStarDistances = (stars: Star[]) => {
  const distances: number[] = [];
  for (let i = 0; i < stars.length; i++) {
    const source = stars[i];
    for (let j = i + 1; j < stars.length; j++) {
      const target = stars[j];
      // console.log(`Source star ${source.id} is at ${source.position.x},${source.position.y}`);
      // console.log(`Target star ${target.id} is at ${target.position.x},${target.position.y}`);
      const distance = findManhattanDistance(source.position, target.position);
      // console.log(`Distance from ${source.id} to ${target.id} is ${distance}`);
      distances.push(distance);
    }
  }
  return distances;
};

const loadSpace = (age: number) => {
  return readAs({
    path: 'src/level11/input.txt',
    parser: (lines: string[]) => {
      const result: string[] = [];
      for (const line of lines) {
        if (line.split('').filter(l => l === "#").length === 0) {
          for (let i = 0; i < age - 2; i++) {
            result.push(line);
          }
          result.push(line);
        }
        result.push(line);
      }

      const horizontalResult: string[] = [];
      for (let col = 0; col < result[0].length; col++) {
        let rowValue: string[] = [];
        for (let row = 0; row < result.length; row++) {
          rowValue.push(result[row][col]);
        }
        if (rowValue.join('').split('').filter(l => l === "#").length === 0) {
          for (let i = 0; i < age - 2; i++) {
            horizontalResult.push(rowValue.join(''));
          }
          horizontalResult.push(rowValue.join(''));
        }
        horizontalResult.push(rowValue.join(''));
      }

      return rotateArray(horizontalResult);
    }
  });
}

const findGrowFactor = (): number => {
  const space = loadSpace(2);
  const nextSpace = loadSpace(3);
  const spaceDist = findStarDistances(findSpaceStars(space));
  const sum = spaceDist.reduce((acc, curr) => acc + curr, 0);
  const nextSpaceDist = findStarDistances(findSpaceStars(nextSpace));
  const nextSum = nextSpaceDist.reduce((acc, curr) => acc + curr, 0);
  return nextSum - sum;
};

const space = loadSpace(1);
const stars = findSpaceStars(space);
const distances = findStarDistances(stars);
const age1Dist = distances.reduce((acc, curr) => acc + curr, 0);
console.log(`Part 1 Solution: ${age1Dist}`);

const growFactor = findGrowFactor();
console.log(growFactor);

// // 82000210
// const growFactor = 82; // nawet nie pytaj, mam to na excelu XD
const milionYearsLater = (age1Dist + (1_000_000 - 2) * growFactor);
console.log(milionYearsLater);