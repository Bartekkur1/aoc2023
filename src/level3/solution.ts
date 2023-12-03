import { readAs } from "aoc-util";
import { EnginePart, Position } from "./shared";

export const findPartNeighbors = (map: string[], part: EnginePart): string => {
  const neighbors: string[] = [];
  for (const pos of part.positions) {
    const { x, y } = pos;
    const top = map[y - 1]?.[x];
    const topRight = map[y - 1]?.[x + 1];
    const right = map[y]?.[x + 1];
    const bottomRight = map[y + 1]?.[x + 1];
    const bottom = map[y + 1]?.[x];
    const bottomLeft = map[y + 1]?.[x - 1];
    const left = map[y]?.[x - 1];
    const topLeft = map[y - 1]?.[x - 1];
    neighbors.push(top, topRight, right, bottomRight, bottom, bottomLeft, left, topLeft);
  }
  return neighbors.filter((n) => n !== undefined && n !== '.' && !/\d+/.test(n)).join('');
}

const copy = (pos: Position) => JSON.parse(JSON.stringify(pos));

const engineParts = readAs<EnginePart[]>({
  path: './src/level3/input.txt',
  parser: (lines: string[]) => {
    // 🤮
    const engineParts: EnginePart[] = [];
    let currentPart: EnginePart;
    for (const line of lines) {
      const lineId = lines.indexOf(line);
      const cursor: Position = { x: 0, y: lineId };
      let partFound = false;
      while (cursor.x < line.length) {
        const char = line[cursor.x];
        if (partFound && /\d/.test(char)) {
          currentPart.positions.push(copy(cursor));
          currentPart.valueRaw += char;
        }
        if (!partFound && /\d/.test(char)) {
          partFound = true;
          currentPart = {
            adjacent: false,
            neighbors: '',
            positions: [copy(cursor)],
            value: 0,
            valueRaw: char
          };
        }
        if (partFound && (!/\d/.test(char) || cursor.x === line.length - 1)) {
          partFound = false;
          currentPart.value = parseInt(currentPart.valueRaw);
          currentPart.neighbors = findPartNeighbors(lines, currentPart);
          currentPart.adjacent = currentPart.neighbors.length > 0;
          engineParts.push(currentPart);
        }
        cursor.x++;
      }
    }
    return engineParts;
  }
});

const sum = engineParts.reduce((sum, part) => {
  if (part.adjacent) {
    return sum + part.value;
  }
  return sum;
}, 0);
console.log(`Part 1: ${sum}`);

