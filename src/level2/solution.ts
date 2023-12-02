import { readAs } from 'aoc-util';

interface Cubes {
  red: number;
  green: number;
  blue: number;
};

interface Game {
  id: number;
  cubes: Cubes;
};

const findGameId = (line: string): number => Number(line.match(/Game\s(\d+)\:/)[1]);
const findGameRounds = (line: string): string[] => line.replace(/Game\s(\d+)\:\s/, '').split(';');
const findGameCubesPower = ({ cubes }: Game): number => cubes.red * cubes.blue * cubes.green;

const findMax = (res: Cubes, cubes: string[]) =>
  cubes.forEach(cube => {
    const [count, color] = cube.split(/\s/);
    res[color] < Number(count) && (res[color] = Number(count));
  });

const findGameCubes = (line: string): Cubes => {
  const cubes: Cubes = { red: 0, blue: 0, green: 0 };
  const rounds = findGameRounds(line);
  rounds.forEach(round => findMax(cubes, round.split(',').map((cube) => cube.trim())));
  return cubes;
};

const loadGames = () => {
  return readAs<Game[]>({
    path: './src/level2/input.txt',
    parser: (lines: string[]) => lines.map(line => ({
      id: findGameId(line),
      cubes: findGameCubes(line)
    }))
  });
};

const findPossibleGames = (games: Game[], cubes: Cubes) => {
  const possibleGames: number[] = [];
  for (const game of games) {
    const { red, blue, green } = game.cubes;
    if (cubes.red >= red && cubes.blue >= blue && cubes.green >= green) {
      possibleGames.push(game.id);
    }
  }
  return possibleGames;
};

const games = loadGames();
const possibleGames = findPossibleGames(games, { red: 12, green: 13, blue: 14 });
console.log(`Part 1 answer: ${possibleGames.reduce((sum, id) => sum + id, 0)}`);
console.log(`Part 2 answer: ${games.reduce((sum, game) => sum + findGameCubesPower(game), 0)}`);