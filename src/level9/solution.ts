import { readAs } from "aoc-util";

type Report = number[];

const reports = readAs<Report[]>({
  path: 'src/level9/input.txt',
  parser: (lines: string[]) => {
    return lines.map(line => line.split(/\s/).map(Number));
  }
});

const isReportBottom = (report: Report) => report.filter((v) => v !== 0).length === 0

const findEdgeValue = (report: Report, last: boolean = true) => {
  const reportDiff = report.slice(0, -1).map((val, i) => report[i + 1] - val);

  if (isReportBottom(reportDiff)) {
    return last ? report[report.length - 1] : report[0];
  }

  const edgeElement = last ? report[report.length - 1] : report[0];
  const lastDiffElement = findEdgeValue(reportDiff, last);
  return last ? edgeElement + lastDiffElement : edgeElement - lastDiffElement;
};

const lastNumbers = reports.map((report) => findEdgeValue(report));
const sum = lastNumbers.reduce((acc, val) => acc + val, 0);
console.log(`Part 1 solution: ${sum}`);

const firstNumbers = reports.map((report) => findEdgeValue(report, false));
const sum2 = firstNumbers.reduce((acc, val) => acc + val, 0);
console.log(`Part 2 solution: ${sum2}`);