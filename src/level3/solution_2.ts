import { readAs } from "aoc-util";
import { Position } from "./shared";
import { v4 } from "uuid";

interface Gear {
  position: Position;
  neighbors: Position[];
}

interface Neighbor {
  id: string;
  positions: Position[];
  value: number;
  valueRaw: string;
}

const copy = (obj: any) => JSON.parse(JSON.stringify(obj));
const anyPosition = (position: Position, positions: Position[]) => {
  for (const pos of positions) {
    if (pos.x === position.x && pos.y === position.y) {
      return true;
    }
  }
  return false;
}

const findPartNeighbors = (map: string[], part: Gear): Position[] => {
  const neighbors: Position[] = [];
  const { x, y } = part.position;
  neighbors.push(
    { x, y: y - 1 },
    { x: x + 1, y: y - 1 },
    { x: x + 1, y },
    { x: x + 1, y: y + 1 },
    { x, y: y + 1 },
    { x: x - 1, y: y + 1 },
    { x: x - 1, y },
    { x: x - 1, y: y - 1 }
  );
  return neighbors.filter((n) => map[n.y]?.[n.x] !== undefined);
};

const findGears = (map: string[]): Gear[] => {
  const gears: Gear[] = [];
  for (const [y, line] of map.entries()) {
    for (const [x, char] of line.split('').entries()) {
      if (char === '*') {
        gears.push({
          position: { x, y },
          neighbors: findPartNeighbors(map, { position: { x, y }, neighbors: [] })
        });
      }
    }
  }
  return gears;
};

const emptyNeighbor = (): Neighbor => ({
  id: v4(),
  positions: [],
  value: 0,
  valueRaw: ''
});

const cacheNeighbors = (lines: string[]) => {
  let neighborFound = false;
  let neighborPositions: Position[] = [];
  let neighborCache = emptyNeighbor();
  const neighbors: Neighbor[] = [];
  for (const line of lines) {
    // 🤮
    const lineId = lines.indexOf(line);
    const cursor: Position = { x: 0, y: lineId };
    while (cursor.x < line.length) {
      const char = lines[cursor.y][cursor.x];
      if (neighborFound && /\d/.test(char)) {
        neighborPositions.push(copy(cursor));
        neighborCache.valueRaw += char;
      }
      if (!neighborFound && /\d/.test(char)) {
        neighborFound = true;
        neighborPositions.push(copy(cursor));
        neighborCache.valueRaw += char;
      }
      if (neighborFound && (!/\d/.test(char) || cursor.x === line.length - 1)) {
        neighborFound = false;
        neighborCache.positions = copy(neighborPositions);
        neighborCache.value = parseInt(neighborCache.valueRaw);
        neighbors.push(copy(neighborCache));
        neighborPositions = [];
        neighborCache = emptyNeighbor();
      }
      cursor.x++;
    }
  }
  return neighbors;
};

const res = readAs<any>({
  path: './src/level3/input.txt',
  parser: (lines: string[]) => {
    let sum = 0;
    const neighborsCache = cacheNeighbors(lines);
    const gears = findGears(lines);
    for (const gear of gears) {
      const gearNeighbors = gear.neighbors
        .map((n) => neighborsCache.find((nc) => anyPosition(n, nc.positions)))
        .filter((p) => p !== undefined);
      const uniqueNeighbors = gearNeighbors.reduce((acc, cur) => {
        acc[cur.id] = cur.value;
        return acc;
      }, {});
      const uniqueNeighborsValues = Object.values(uniqueNeighbors);
      if (uniqueNeighborsValues.length !== 2) {
        continue;
      }
      const [a, b] = uniqueNeighborsValues;
      sum = sum + (Number(a) * Number(b));
    }

    return sum;
  }
});

console.log(`Level 2 solution: ${res}`);