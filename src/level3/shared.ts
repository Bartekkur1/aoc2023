export interface Position {
  x: number;
  y: number;
}

export interface EnginePart {
  value: number;
  valueRaw: string;
  positions: Position[];
  neighbors: string;
  adjacent: boolean;
}