import { workerData, parentPort } from 'worker_threads';
import { SpringLine } from './types';

const arrIdentical = (a: number[], b: number[]) => {
  if (a.length !== b.length) {
    return false;
  }
  for (const i in a) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
};

const generateCombinations = ({ sizes, springs }: SpringLine): string[] => {
  const combinations: string[] = [];
  const stack: string[] = [springs];
  const maxSize = Math.max(...sizes);
  const maxSizeMatcher = new RegExp(`\#{${maxSize + 1}}`);

  let operations = 0;
  while (stack.length > 0) {
    operations++;
    const current = stack.pop() as string;
    const index = current.indexOf('?');

    if (index !== -1) {
      const firstOption = current.slice(0, index) + '.' + current.slice(index + 1);
      const secondOption = current.slice(0, index) + '#' + current.slice(index + 1);
      if (firstOption.indexOf('?') === - 1 && arrIdentical(sizes, firstOption.split(/\.+/).filter(e => e !== '').map(e => e.length))) {
        combinations.push(firstOption);
      }
      if (secondOption.indexOf('?') === - 1 && arrIdentical(sizes, secondOption.split(/\.+/).filter(e => e !== '').map(e => e.length))) {
        combinations.push(secondOption);
      }
      if (!maxSizeMatcher.test(firstOption) && firstOption.indexOf('?') !== -1) {// && maxFirstOption <= maxSize) {
        stack.push(firstOption);
      }
      if (!maxSizeMatcher.test(secondOption) && firstOption.indexOf('?') !== -1) {// && maxFirstOption <= maxSize) {
        stack.push(secondOption);
      }
    }
    operations++;
  }
  return combinations;
};

const unfoldSpringLine = (times: number, { sizes, springs }: SpringLine): SpringLine => {
  if (times === 0) {
    return {
      sizes,
      springs
    }
  }
  const newSizes: number[] = [];
  const newSprings: string[] = [];
  for (let i = 1; i <= times; i++) {
    newSizes.push(...sizes);
    newSprings.push(springs + '?');
  }
  return {
    sizes: newSizes,
    springs: newSprings.join('').slice(0, -1)
  };
};
// const countSpringCombinations = (springLines: SpringLine[], part2: boolean = false) => {
//   let sum = 0;
//   let i = 0;
//   for (const springLine of springLines) {
//     console.log(`Starting on: `, springLine.springs);
//     if (part2) {
//       const initialCombinations = generateCombinations(unfoldSpringLine(1, springLine));
//       const oneCombination = generateCombinations(springLine);
//       const twoUnfold = unfoldSpringLine(2, springLine);
//       const twoCombination = generateCombinations(twoUnfold);
//       const growFactor = twoCombination.length / initialCombinations.length;
//       const fiveTimes = oneCombination.length * growFactor * growFactor * growFactor * growFactor;
//       sum += fiveTimes;
//     } else {
//       sum += generateCombinations(springLine).length;
//     }
//     i++;
//   }
//   return sum;
// };

const countSpringCombinations = (springLine: SpringLine, part2: boolean = false) => {
  let sum = 0;
  // console.log(`Starting on: `, springLine.springs);
  if (part2) {
    const initialCombinations = generateCombinations(unfoldSpringLine(1, springLine));
    const oneCombination = generateCombinations(springLine);
    const twoUnfold = unfoldSpringLine(2, springLine);
    const twoCombination = generateCombinations(twoUnfold);
    const growFactor = twoCombination.length / initialCombinations.length;
    const fiveTimes = oneCombination.length * growFactor * growFactor * growFactor * growFactor;
    sum += fiveTimes;
  } else {
    sum += generateCombinations(springLine).length;
  }
  return sum;
};

const input = workerData.springLine;
const part2 = workerData.part2;
// console.log(input);

const res = countSpringCombinations(input, part2 || false);

parentPort?.postMessage(res);