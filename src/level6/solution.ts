import { readAs } from "aoc-util";

interface Race {
  time: number;
  record: number;
  waysToWin: number;
}

const findRaceWins = (race: Race) => {
  let res = 0;
  const { record, time } = race;
  for (let m = 1; m < time; m++) {
    const speed = m;
    const distance = speed * (time - m);
    if (distance > record) {
      res++;
    }
  }
  return res;
};

const races = readAs<Race[]>({
  path: 'src/level6/input.txt',
  parser: (lines: string[]) => {
    const races: Race[] = [];
    const times: number[] = [];
    const records: number[] = [];
    for (const line of lines) {
      if (/Time/.test(line)) {
        times.push(...line.match(/\d+/g).map(Number));
      }
      if (/Distance/.test(line)) {
        records.push(...line.match(/\d+/g).map(Number));
      }
    }

    for (let i = 0; i < times.length; i++) {
      const race: Race = {
        record: records[i],
        time: times[i],
        waysToWin: 0
      };
      race.waysToWin = findRaceWins(race);
      races.push(race);
    }

    return races;
  }
});

const part1 = races.reduce((acc, cur) => acc * cur.waysToWin, 1);
console.log(`Part 1 solution: ${part1}`);

const part2Race: Race = {
  waysToWin: 0,
  record: Number(races.reduce((acc, cur) => acc + String(cur.record), '')),
  time: Number(races.reduce((acc, cur) => acc + String(cur.time), ''))
};

const part2 = findRaceWins(part2Race);
console.log(`Part 2 solution: ${part2}`);

