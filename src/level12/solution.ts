import { readAs } from "aoc-util";
import { Presets, SingleBar } from "cli-progress";
import { SpringLine } from "./types";
import { Worker } from 'worker_threads';

const springLines = readAs<SpringLine[]>({
  path: 'src/level12/input.txt',
  parser: (lines: string[]) => {
    const springLines: SpringLine[] = [];
    for (const line of lines) {
      const [springs, sizesRaw] = line.split(/\s/);
      const sizes = sizesRaw.split(',').map(Number);
      springLines.push({
        sizes,
        springs
      });
    }
    return springLines;
  }
});

const solve = async (springLine: SpringLine, part2: boolean = false): Promise<number> => {
  return new Promise((res, rej) => {
    const worker = new Worker('./build/src/level12/worker.js', {
      workerData: {
        springLine,
        part2
      }
    });

    worker.once('message', (message) => {
      return res(message);
    });
  });
};

const sleep = async (ms: number) => {
  return new Promise((res, rej) => setTimeout(res, ms));
};

let sum = 0;
const workersCount = 10;
let jobsRunning = 0;

(async () => {
  while (springLines.length > 0) {
    if (jobsRunning < workersCount) {
      const spring = springLines.shift();
      console.log(`Starting job for: `, spring!.springs);
      jobsRunning++;
      solve(spring, true).then((res) => {
        sum += res;
        jobsRunning--;
        console.log(sum);
      })
    }
    await sleep(100);
  }
})();


// console.time('Part 1');
// const p1 = countSpringCombinations(springLines);
// console.log(`Part 1: ${p1}`);
// console.timeEnd('Part 1');

// console.time('Part 2');
// const p2 = countSpringCombinations(springLines, true);
// console.log(`Part 2: ${p2}`);
// console.timeEnd('Part 2');