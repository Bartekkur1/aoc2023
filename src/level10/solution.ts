import { readAs } from "aoc-util";
import { Direction, GroundCell, Input, Pipe, Position, connections, turns } from "./interfaces";
import { buildGroundCellsMap, buildPipeChain, changeDirection, findCellGroup, findCellNeighbors, findConnectedNeighbors, findDirectionBetweenPositions, findDirectionPosition, findGroundLookPosition, findPipeByPositionAndConnection, isPointInsideVertices, iteratePipes, printPositions } from "./util";

const input = readAs<Input>({
  path: 'src/level10/input.txt',
  parser: (lines: string[]) => {
    const start: Position = { x: 0, y: 0 };
    const groundCells: GroundCell[] = [];
    const pipes: Pipe[] = [];

    for (let y = 0; y < lines.length; y++) {
      const line = lines[y];
      for (let x = 0; x < line.length; x++) {
        const cell = line[x];
        if (cell === '.') {
          continue;
        } else if (cell === 'S') {
          start.x = x;
          start.y = y;
        } else {
          pipes.push({
            position: { x, y },
            type: cell
          });
        }
      }
    }

    return {
      start,
      pipes,
      groundCells,
      width: lines[0].length - 1,
      height: lines.length - 1
    }
  }
});

console.log('Loaded...');

const startPipe: Pipe = {
  position: input.start,
  type: 'S'
};

const startNeighbors = findConnectedNeighbors(input.pipes, input.start);
const firstNeighbor = startNeighbors[1];

console.log('Building chain...');
const pipeChain = buildPipeChain(input.pipes, startPipe, firstNeighbor);
console.log(`Chain built!, ${pipeChain.length}`);

console.log('Building ground cells...');
const groundCells = buildGroundCellsMap(pipeChain, input.width, input.height);
console.log(`Ground cells built!, ${groundCells.length}`);

// printPositions(groundCells.map(gc => gc.position), input.width, input.height);

const countGroundInsidePipe = (grounds: GroundCell[], pipes: Pipe[]) => {
  const pipeVertices = pipes.map(p => p.position);
  return grounds.filter(g => isPointInsideVertices(g.position, pipeVertices)).length;
};

console.log('Counting ground cells inside pipe...');
console.log(`Count: ${countGroundInsidePipe(groundCells, pipeChain)}`);
