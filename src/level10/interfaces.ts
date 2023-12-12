export interface Position {
  x: number;
  y: number;
};

export enum Direction {
  North = 'north',
  East = ' east',
  South = 'south',
  West = 'west'
};

export const turns: string[] = ['L', 'J', '7', 'F'];

export const connections: { [key: string]: Connection | undefined } = {
  '|': [Direction.North, Direction.South],
  '-': [Direction.East, Direction.West],
  'L': [Direction.North, Direction.East],
  'J': [Direction.North, Direction.West],
  '7': [Direction.South, Direction.West],
  'F': [Direction.South, Direction.East],
};

export const joins: { [key: string]: Connection | undefined } = {
  '|': [Direction.North, Direction.South],
  '-': [Direction.East, Direction.West],
  'L': [Direction.South, Direction.West],
  'J': [Direction.East, Direction.South],
  '7': [Direction.East, Direction.North],
  'F': [Direction.North, Direction.West],
};

type Connection = [Direction, Direction];

export interface Pipe {
  position: Position;
  type: string;
};

export interface GroundCell {
  position: Position;
  inGroup: boolean;
  found: boolean;
};

export interface Input {
  start: Position;
  pipes: Pipe[];
  groundCells: GroundCell[];
  width: number;
  height: number;
};
