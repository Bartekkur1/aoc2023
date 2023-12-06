import { readAs } from "aoc-util";
import { SingleBar, Presets } from 'cli-progress';

interface Direction {
  source: string;
  destination: string;
}

interface Map extends Direction {
  range: number;
  destinationRangeStart: number;
  sourceRangeStart: number;
  sourceRange: number;
}

interface Input {
  seeds: number[];
  maps: Map[];
}

type MapsCache = { [key: string]: Map[] };
const mapCache: MapsCache = {};

const input = readAs<Input>({
  path: 'src/level5/input.txt',
  parser: (input) => {
    const result: Input = {
      maps: [],
      seeds: [],
    };
    let currentDirection: Direction | undefined;
    for (const line of input) {
      if (/seeds\:/.test(line)) {
        result.seeds = line.match(/\d+/g).map(Number);
      }
      if (/^(?!\n)\D+\-\D+\-\D+\smap:$/.test(line)) {
        const [source, _, destination] = line.split(/\s/)[0].split('-');
        currentDirection = { source, destination };
      }
      if (/^\d+\s\d+\s\d+$/.test(line) && currentDirection) {
        const [destinationRangeStart, sourceRangeStart, range] = line.split(/\s/).map(Number);
        result.maps.push({ ...currentDirection, range, destinationRangeStart, sourceRangeStart, sourceRange: sourceRangeStart + range });
      }
      if (/^\n/.test(line)) {
        currentDirection = undefined;
      }
    }

    return result;
  }
});

for (const map of input.maps) {
  if (mapCache[map.destination] === undefined) {
    mapCache[map.destination] = [map];
  } else {
    mapCache[map.destination].push(map);
  }
}
console.log('Map cache built!');

const nextOrder = {
  'seed': 'soil',
  'soil': 'fertilizer',
  'fertilizer': 'water',
  'water': 'light',
  'light': 'temperature',
  'temperature': 'humidity',
  'humidity': 'location'
}

const nextSource = (source: string): string => {
  return nextOrder[source];
};

const executeMap = (maps: MapsCache, destination: string, value: number) => {
  let result = value;
  const map = maps[destination].find(map =>
    value >= map.sourceRangeStart && value < map.sourceRange
  );
  if (!map) return value;
  return map.destinationRangeStart + (result - map.sourceRangeStart);
};


const transformValues = (source: string, values: number[]) => {
  if (source === undefined) {
    return values;
  }
  return transformValues(
    nextSource(source),
    values.map(val => executeMap(mapCache, source, val))
  );
};

const transformValue = (source: string, value: number): number => {
  if (source === undefined) {
    return value;
  }
  return transformValue(
    nextSource(source),
    executeMap(mapCache, source, value)
  );
};

let part2MinLocation: number | undefined;
let part2Seed = 0;
const solvePart2 = (input: Input) => {
  for (let i = 0; i < input.seeds.length; i += 2) {
    const start = input.seeds[i];
    const range = input.seeds[i + 1];
    const progress = new SingleBar({}, Presets.shades_classic);
    progress.start(range, 0);
    for (let j = start; j < start + range; j++) {
      j % 500_000 === 0 && progress.update(j - start);
      let res = transformValue('soil', j);
      if (res < part2MinLocation || part2MinLocation === undefined) {
        part2MinLocation = res;
        part2Seed = j;
      }
    }
    progress.update(range);
    progress.stop();
  }
}

console.time('part2')
solvePart2(input);
console.timeEnd('part2')
// 15880236 3283824076
console.log({
  part2MinLocation,
  part2Seed
});
