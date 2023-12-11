import { Direction, GroundCell, Pipe, Position, joins } from "./interfaces";

export const findDirectionBetweenPositions = (from: Position, to: Position): Direction => {
  if (from.x > to.x) {
    return Direction.West;
  } else if (from.x < to.x) {
    return Direction.East;
  } else if (from.y > to.y) {
    return Direction.North;
  } else if (from.y < to.y) {
    return Direction.South;
  }
};

export const findGroundLookPosition = (type: string, moveDirection: Direction): Direction => {
  if (type === '-') {
    if (moveDirection === Direction.East) {
      return Direction.South;
    } else if (moveDirection === Direction.West) {
      return Direction.North;
    }
  } else if (type === '|') {
    if (moveDirection === Direction.South) {
      return Direction.East;
    } else if (moveDirection === Direction.North) {
      return Direction.East;
    }
  } else if (type === 'L') {
    if (moveDirection === Direction.South) {
      return Direction.North;
    } else if (moveDirection === Direction.West) {
      return Direction.East;
    }
  }
  else if (type === 'J') {
    if (moveDirection === Direction.South) {
      return Direction.North;
    } else if (moveDirection === Direction.East) {
      return Direction.West;
    }
  }
  else if (type === '7') {
    if (moveDirection === Direction.East) {
      return Direction.West;
    } else if (moveDirection === Direction.North) {
      return Direction.South;
    }
  }
  else if (type === 'F') {
    if (moveDirection === Direction.North) {
      return Direction.South;
    } else if (moveDirection === Direction.West) {
      return Direction.West;
    }
  }
};

export const findPipeByPositionAndConnection = (pipes: Pipe[], position: Position, direction: Direction): Pipe => {
  return pipes
    .find(p =>
      joins[p.type].includes(direction) &&
      p.position.x === position.x && p.position.y === position.y);
};

export const findConnectedNeighbors = (pipes: Pipe[], position: Position) => {
  const { x, y } = position
  return [
    findPipeByPositionAndConnection(pipes, { x: x + 1, y }, Direction.East),
    findPipeByPositionAndConnection(pipes, { x: x - 1, y }, Direction.West),
    findPipeByPositionAndConnection(pipes, { x, y: y + 1 }, Direction.South),
    findPipeByPositionAndConnection(pipes, { x, y: y - 1 }, Direction.North)
  ].filter(p => p !== undefined)
};

export const findDirectionPosition = (position: Position, direction: Direction): Position => {
  const { x, y } = position;
  switch (direction) {
    case Direction.North:
      return { x, y: y - 1 };
    case Direction.South:
      return { x, y: y + 1 };
    case Direction.East:
      return { x: x + 1, y };
    case Direction.West:
      return { x: x - 1, y };
  }
};

const turns = ['L', 'J', '7', 'F'];
export const changeDirection = (pipeType: string, direction: Direction) => {
  if (!turns.includes(pipeType)) {
    return direction;
  }

  if (pipeType === 'L') {
    if (direction === Direction.South) {
      return Direction.East;
    } else if (direction === Direction.West) {
      return Direction.North;
    }
  }
  else if (pipeType === 'J') {
    if (direction === Direction.South) {
      return Direction.West;
    } else if (direction === Direction.East) {
      return Direction.North;
    }
  }
  else if (pipeType === '7') {
    if (direction === Direction.East) {
      return Direction.South;
    } else if (direction === Direction.North) {
      return Direction.West;
    }
  }
  else if (pipeType === 'F') {
    if (direction === Direction.North) {
      return Direction.East;
    } else if (direction === Direction.West) {
      return Direction.South;
    }
  }

};

export const findNextPipe = (pipes: Pipe[], prev: Pipe, curr: Pipe): Pipe => {
  const moveDirection = findDirectionBetweenPositions(prev.position, curr.position);
  const lookDirection = changeDirection(curr.type, moveDirection);
  const nextPipePos = findDirectionPosition(curr.position, lookDirection);
  return findPipeByPositionAndConnection(pipes, nextPipePos, lookDirection);
};

export const buildPipeChain = (pipes: Pipe[], start: Pipe, firstNeighbor: Pipe) => {
  const chain: Pipe[] = [
    start,
    firstNeighbor
  ];
  let tmp = start;
  let prevPipe = firstNeighbor;
  let nextPipe = findNextPipe(pipes, start, firstNeighbor);
  while (nextPipe) {
    tmp = nextPipe;
    chain.push(nextPipe);
    nextPipe = findNextPipe(pipes, prevPipe, nextPipe);
    if (nextPipe === undefined) {
      break;
    }
    prevPipe = tmp;
  }
  return chain;
};

export const printPositions = (positions: Position[], width: number, height: number) => {
  for (let y = 0; y <= height; y++) {
    let line = '';
    for (let x = 0; x <= width; x++) {
      const pipe = positions.find(p => p.x === x && p.y === y);
      if (pipe) {
        line += '#';
        // line += pipe.type;
      } else {
        line += '.';
        // line += '#';
      }
    }
    console.log(line);
  }
};

export const iteratePipes = (pipes: Pipe[], callback: (prev: Pipe, curr: Pipe) => void) => {
  let prev = pipes[0];
  for (let i = 1; i < pipes.length; i++) {
    const curr = pipes[i];
    callback(prev, curr);
    prev = curr;
  }
};

export const buildGroundCellsMap = (pipes: Pipe[], width: number, height: number): GroundCell[] => {
  const groundCells: GroundCell[] = [];
  for (let y = 0; y <= height; y++) {
    for (let x = 0; x <= width; x++) {
      const pipe = pipes.find(p => p.position.x === x && p.position.y === y);
      if (pipe) {
        continue;
      }
      groundCells.push({
        position: { x, y },
        found: false,
        inGroup: false
      });
    }
  }
  return groundCells;
};