import { readAs } from "aoc-util";

interface Position {
  x: number;
  y: number;
};

enum Direction {
  North = 'north',
  East = ' east',
  South = 'south',
  West = 'west'
};

type Connection = [Direction, Direction];

interface Pipe {
  position: Position;
  type: string;
  connection?: Connection;
  visited: boolean;
  depth?: number;
};

interface GroundCell {
  position: Position;
  inGroup: boolean;
  found: boolean;
};

interface GroundCellGroup {
  cells: GroundCell[];
  withinPipe: boolean;
  id: string;
};

interface Input {
  pipes: Pipe[];
  start: Position;
  groundCells: GroundCell[];
  width: number;
  height: number;
};

const findPipes = (pipes: Pipe[], { x, y }: Position, direction: Direction): Pipe => {
  return pipes
    .find(p =>
      !p.visited && p.connection &&
      p.connection.includes(direction) &&
      p.position.x === x && p.position.y === y);
};

const findNeighbors = ({ x, y }: Position, pipes: Pipe[]): Pipe[] => {
  return [
    findPipes(pipes, { x: x - 1, y }, Direction.East),
    findPipes(pipes, { x: x + 1, y }, Direction.West),
    findPipes(pipes, { x, y: y - 1 }, Direction.South),
    findPipes(pipes, { x, y: y + 1 }, Direction.North)
  ].filter(p => p !== undefined)
};

const isCellOnEdge = (cell: GroundCell, width: number, height: number) => {
  const { position } = cell;
  const { x, y } = position;
  if (x === 0 || x === width || y === 0 || y === height) {
    return true;
  }
  return false;
};

const connections: { [key: string]: Connection | undefined } = {
  'S': undefined,
  '|': [Direction.North, Direction.South],
  '-': [Direction.East, Direction.West],
  'L': [Direction.North, Direction.East],
  'J': [Direction.North, Direction.West],
  '7': [Direction.South, Direction.West],
  'F': [Direction.South, Direction.East],
};

const input = readAs<Input>({
  path: 'src/level10/input.txt',
  parser: (lines: string[]) => {
    const pipes: Pipe[] = [];
    const groundCells: GroundCell[] = [];
    let start: Position | undefined;
    for (let y = 0; y < lines.length; y++) {
      const line = lines[y];
      const cells = line.split('');
      for (let x = 0; x < cells.length; x++) {
        if (cells[x] === '.') {
          groundCells.push({ position: { x, y }, inGroup: false, found: false });
          continue;
        };
        if (cells[x] === 'S') {
          start = { x, y };
          continue;
        };
        const connection = connections[cells[x]];
        pipes.push({
          position: { x, y },
          connection,
          type: cells[x],
          visited: false
        });
      }
    }

    console.log(`Total pipes: ${pipes.length}`);
    console.log(`Ground cells before pipes: ${groundCells.length}`);
    const pipesNotConnected = pipes.filter(p => findNeighbors(p.position, pipes).length === 0);
    console.log(`Pipes not connected: ${pipesNotConnected.length}`);
    for (const pipe of pipesNotConnected) {
      groundCells.push({ position: pipe.position, inGroup: false, found: false });
    }
    console.log(`Ground cells after pipes: ${groundCells.length}`);
    const pipesConnected = pipes.filter(p => findNeighbors(p.position, pipes).length > 0);
    console.log(`Pipes connected: ${pipesConnected.length}`);

    const width = lines[0].length - 1;
    const height = lines.length - 1;
    return {
      pipes: pipesConnected,
      start: start!,
      groundCells: groundCells.filter(c => !isCellOnEdge(c, width, height)),
      height,
      width
    };
  }
});

interface PipeLink {
  pipe: Pipe;
  next: PipeLink | undefined;
}

const buildPipeChain = (pipe: Pipe): PipeLink => {
  pipe.visited = true;
  const nextPipe = findNeighbors(pipe.position, input.pipes)[0];
  if (!nextPipe) {
    return {
      pipe,
      next: undefined
    };
  }
  return {
    pipe,
    next: buildPipeChain(nextPipe)
  };
}

const { start } = input;
const startNeighbors = findNeighbors(start, input.pipes);
// for (const neighbor of startNeighbors) {
//   neighbor.depth = 1;
//   neighbor.visited = true;
// }

const findCellNeighbors = (cell: GroundCell, groundCells: GroundCell[]): GroundCell[] => {
  const { x, y } = cell.position;
  return [
    groundCells.find(c => c.position.x === x - 1 && c.position.y === y)!,
    groundCells.find(c => c.position.x === x + 1 && c.position.y === y)!,
    groundCells.find(c => c.position.x === x && c.position.y === y - 1)!,
    groundCells.find(c => c.position.x === x && c.position.y === y + 1)!,
    groundCells.find(c => c.position.x === x - 1 && c.position.y === y - 1)!,
    groundCells.find(c => c.position.x === x + 1 && c.position.y === y - 1)!,
    groundCells.find(c => c.position.x === x - 1 && c.position.y === y + 1)!,
    groundCells.find(c => c.position.x === x + 1 && c.position.y === y + 1)!
  ].filter(c => c !== undefined);
};

const findCellGroup = (cell: GroundCell): GroundCell[] => {
  cell.inGroup = true;
  const group: GroundCell[] = [cell];
  const cellNeighbors = findCellNeighbors(cell, input.groundCells);
  for (const neighbor of cellNeighbors) {
    if (!neighbor.inGroup) {
      group.push(...findCellGroup(neighbor));
    }
  }
  return group;
};

const groupGroundCells = (groundCells: GroundCell[]): GroundCellGroup[] => {
  const groups: GroundCellGroup[] = [];
  for (const cell of groundCells) {
    if (cell.inGroup) {
      continue;
    }
    groups.push({
      cells: findCellGroup(cell),
      withinPipe: false,
      id: String.fromCharCode(groups.length + 65)
    });
  }
  return groups;
};

// const findGroupsWithinPipe = (groups: GroundCellGroup[]) => {
//   for (const group of groups) {
//     const cells = group.cells;
//     group.withinPipe = !cells.some(c => isCellOnEdge(c));
//   }
// };

// const countGroupWithinPipe = (): number => {
//   const groups = groupGroundCells(input.groundCells)
//   findGroupsWithinPipe(groups);
//   const sum = groups.filter(g => g.withinPipe).reduce((acc, g) => acc + g.cells.length, 0);

//   for (let y = 0; y <= input.mapHeight; y++) {
//     let line = '';
//     for (let x = 0; x <= input.mapWidth; x++) {
//       const group = groups.find(g => g.cells.some(c => c.position.x === x && c.position.y === y));
//       if (group) {
//         line += group.id;
//       } else {
//         line += '.';
//       }
//     }
//     console.log(line);
//   }
//   console.log(groups.map(group => ({ id: group.id, withinPipe: group.withinPipe })));


//   // console.log(groups.map(group => group.cells[0].position));
//   return sum;
// };
// console.log(countGroupWithinPipe());

// const solvePart1 = (): number => {
//   let prevMax = -1;
//   while (input.pipes.some(p => !p.visited)) {
//     const maxDepth = Math.max(...input.pipes.map(p => p.depth || 0));
//     if (maxDepth === prevMax) {
//       break;
//     }
//     prevMax = maxDepth;
//     const depthPipes = input.pipes.filter(p => p.depth === maxDepth);
//     for (const pipe of depthPipes) {
//       const neighbors = findNeighbors(pipe.position, input.pipes);
//       for (const neighbor of neighbors) {
//         neighbor.depth = maxDepth + 1;
//         neighbor.visited = true;
//       }
//     }
//   }
//   return Math.max(...input.pipes.map(p => p.depth || 0));
// }

// const maxDepth = solvePart1();
// console.log(`Max depth: ${maxDepth}`);

const pipeChain = buildPipeChain(startNeighbors[0]);

const findLookPosition = (position: Position, direction: Direction) => {
  if (direction === Direction.North) {
    return { x: position.x, y: position.y - 1 };
  }
  else if (direction === Direction.East) {
    return { x: position.x + 1, y: position.y };
  }
  else if (direction === Direction.South) {
    return { x: position.x, y: position.y + 1 };
  }
  else if (direction === Direction.West) {
    return { x: position.x - 1, y: position.y };
  }
};

const turns = ['L', 'J', '7', 'F'];

const solvePart2 = () => {
  const result: GroundCell[] = [];
  let cursor = pipeChain;
  console.log(cursor.pipe.type);

  let lookDirection = Direction.East;
  let moveDirection: any = Direction.South;

  while (cursor.next) {
    let lookPosition = findLookPosition(cursor.pipe.position, lookDirection);
    let lookCell = input.groundCells.find(c => c.position.x === lookPosition.x && c.position.y === lookPosition.y);
    if (lookCell !== undefined && lookCell.found === false) {
      console.log(`Looking at ${lookPosition.x},${lookPosition.y} from ${cursor.pipe.position.x},${cursor.pipe.position.y} direction: ${lookDirection}`)
      lookCell.found = true;
      result.push(lookCell);
    }

    if (cursor.next.pipe.type !== cursor.pipe.type) {
      if (cursor.next.pipe.type === 'J') {
        if (moveDirection === Direction.East) {
          moveDirection = Direction.North;
          lookDirection = Direction.West; //
        } else if (moveDirection === Direction.South) {
          moveDirection = Direction.West;
          lookDirection = Direction.North;
        }
      }
      else if (cursor.next.pipe.type === 'L') {
        if (moveDirection === Direction.South) {
          moveDirection = Direction.East;
          lookDirection = Direction.South;
        } else if (moveDirection === Direction.West) {
          moveDirection = Direction.North;
          lookDirection = Direction.East;
        }
      }
      else if (cursor.next.pipe.type === '7') {
        if (moveDirection === Direction.North) {
          moveDirection = Direction.West;
          lookDirection = Direction.South; //
        } else if (moveDirection === Direction.East) {
          moveDirection = Direction.South;
          lookDirection = Direction.West;
        }
      }
      else if (cursor.next.pipe.type === 'F') {
        if (moveDirection === Direction.West) {
          moveDirection = Direction.South;
          lookDirection = Direction.West;
        } else if (moveDirection === Direction.North) {
          moveDirection = Direction.East;
          lookDirection = Direction.South;
        }
      }
    }

    cursor = cursor.next;
  }
  return result;
};

const res = solvePart2();
console.log(res.length);

for (let y = 0; y <= input.height; y++) {
  let line = '';
  for (let x = 0; x <= input.width; x++) {
    const lookCell = res.find(c => c.position.x === x && c.position.y === y);
    const pipe = input.pipes.find(p => p.position.x === x && p.position.y === y);
    // const group = groups.find(g => g.cells.some(c => c.position.x === x && c.position.y === y));
    if (lookCell) {
      line += '#';
    } else if (pipe !== undefined) {
      // line += pipe?.type || ".";
      line += ".";
    } else {
      const startPosition = input.start;
      if (startPosition.x === x && startPosition.y === y) {
        line += 'S';
      } else {
        line += '.';
      }
    }
  }
  console.log(line);
}