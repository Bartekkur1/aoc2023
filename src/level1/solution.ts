import { readAs } from 'aoc-util';

const numMap: { [key: string]: string } = {
  'one': 'o1e',
  'two': 't2o',
  'three': 't3e',
  'four': 'f4r',
  'five': 'f5e',
  'six': 's6x',
  'seven': 's7n',
  'eight': 'e8t',
  'nine': 'n9e'
};

const replaceStrToNum = (input: string) => {
  const numNames = Object.keys(numMap);
  let checkSize = 1;
  while (checkSize < input.length + 1) {
    const checkStr = input.slice(0, checkSize);
    for (const numName of numNames) {
      const matcher = new RegExp(numName, 'g');
      if (matcher.test(checkStr)) {
        input = input.replace(numName, numMap[numName].toString());
        checkSize = 1;
      }
    }
    checkSize++;
  }
  return input.replace(/\D+/g, '');
};

const lines = readAs<string[]>({
  path: './src/level1/input.txt',
  parser: (lines: string[]) => lines.map(line => replaceStrToNum(line))
});

const sum = lines.reduce((sum, line) => sum += Number(line[0] + line[line.length - 1]), 0);
console.log(sum);
