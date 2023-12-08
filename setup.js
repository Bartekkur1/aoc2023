const fs = require('fs');

const level = process.env.level;

if (level === undefined) {
  throw new Error('Please provide a level number');
}

const basePath = `./src/level${level}`;
fs.mkdirSync(basePath);
console.log(`Directory ${basePath} created ✅`);
fs.writeFileSync(`${basePath}/solution.ts`, '');
console.log(`Solution file created ✅`);
fs.writeFileSync(`${basePath}/input.txt`, '');
console.log(`Input file created ✅`);