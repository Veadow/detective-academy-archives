import { randomBytes, randomInt, pbkdf2Sync, createCipheriv } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { createSolvedCube, applyMoves, toNet, scramble } from './cube-model.mjs';

const password = 'Aletheia';
const plaintext = "You can't see the whole truth.But the key is the truth.";
const salt = randomBytes(8);
const material = pbkdf2Sync(password, salt, 10000, 48, 'sha256');
const cipher = createCipheriv('aes-256-cbc', material.subarray(0, 32), material.subarray(32));
const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
const ciphertext = Buffer.concat([Buffer.from('Salted__'), salt, encrypted]).toString('base64');
const cube = createSolvedCube(() => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[randomInt(26)]);
const cubeFaces = toNet(applyMoves(cube, scramble));
const output = `// Generated once; keep the same puzzle for every player and refresh.\nexport const ciphertext = ${JSON.stringify(ciphertext)};\nexport const cubeFaces = ${JSON.stringify(cubeFaces, null, 2)};\n`;
writeFileSync(new URL('../src/cube-puzzle.js', import.meta.url), output);
console.log('Generated a legal scrambled cube and Base64 AES ciphertext.');
