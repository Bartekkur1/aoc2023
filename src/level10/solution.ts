import { readAs } from "aoc-util";
import { Direction, GroundCell, GroundCellGroup, Input, Pipe, Position, connections, turns } from "./interfaces";
import { buildGroundCellsMap, buildPipeChain, changeDirection, findConnectedNeighbors, findDirectionBetweenPositions, findDirectionPosition, findGroundLookPosition, findPipeByPositionAndConnection, iteratePipes, printPositions } from "./util";

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
// const firstNeighbor = startNeighbors[0];

console.log('Building chain...');
const pipeChain = buildPipeChain(input.pipes, startPipe, firstNeighbor);
console.log(`Chain built!, ${pipeChain.length}`);

console.log('Building ground cells...');
const groundCells = buildGroundCellsMap(pipeChain, input.width, input.height);
console.log(`Ground cells built!, ${groundCells.length}`);

console.log('\n');
printPositions(pipeChain.map(p => p.position), input.width, input.height);
const startMoveDirection = findDirectionBetweenPositions(startPipe.position, firstNeighbor.position);
let groundLookDirection: Direction | undefined = findGroundLookPosition(firstNeighbor.type, startMoveDirection);

const foundGroundCells: GroundCell[] = [];

iteratePipes(pipeChain, (prev, curr) => {
  const moveDirection = findDirectionBetweenPositions(prev.position, curr.position)
  const nextGroundLook = findGroundLookPosition(curr.type, moveDirection);
  if (nextGroundLook) {
    groundLookDirection = nextGroundLook;
  }
  const groundLookPosition = findDirectionPosition(curr.position, groundLookDirection);
  const groundCell = groundCells.find(gc =>
    !gc.found &&
    gc.position.x === groundLookPosition.x && gc.position.y === groundLookPosition.y);
  if (groundCell) {
    groundCell.found = true;
    foundGroundCells.push(groundCell);
  }
  console.log(`Pipe: ${curr.type}, ${moveDirection}, looking: ${groundLookDirection}, ${groundLookPosition.x}, ${groundLookPosition.y}`);
});

const findCellNeighbors = (cell: GroundCell, groundCells: GroundCell[]): GroundCell[] => {
  const { x, y } = cell.position;
  return [
    groundCells.find(c => c.position.x === x + 1 && c.position.y === y)!,
    groundCells.find(c => c.position.x === x - 1 && c.position.y === y)!,
    groundCells.find(c => c.position.x === x && c.position.y === y + 1)!,
    groundCells.find(c => c.position.x === x && c.position.y === y - 1)!,
  ].filter(c => c !== undefined);
};

const findCellGroup = (cell: GroundCell, cells: GroundCell[]): GroundCell[] => {
  cell.inGroup = true;
  const group: GroundCell[] = [cell];
  const cellNeighbors = findCellNeighbors(cell, cells);
  for (const neighbor of cellNeighbors) {
    if (!neighbor.inGroup) {
      group.push(...findCellGroup(neighbor, cells));
    }
  }
  return group;
};

const findGroundCellsGroups = (groundCells: GroundCell[]) => {
  const groups: GroundCellGroup[] = [];
  for (const cell of groundCells) {
    if (cell.inGroup) {
      continue;
    }
    groups.push({
      cells: findCellGroup(cell, groundCells),
      withinPipe: true,
      id: String.fromCharCode(groups.length + 65)
    });
  }
  return groups;
};

console.log('\n');
printPositions(foundGroundCells.map(p => p.position), input.width, input.height);
console.log(findGroundCellsGroups(foundGroundCells));
