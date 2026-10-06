// Sticker positions and outward normals implement legal face turns in 3D.
export const faces = {
  U: { normal: [0, 1, 0], right: [1, 0, 0], down: [0, 0, 1], color: 'white' },
  L: { normal: [-1, 0, 0], right: [0, 0, 1], down: [0, -1, 0], color: 'orange' },
  F: { normal: [0, 0, 1], right: [1, 0, 0], down: [0, -1, 0], color: 'green' },
  R: { normal: [1, 0, 0], right: [0, 0, -1], down: [0, -1, 0], color: 'red' },
  B: { normal: [0, 0, -1], right: [-1, 0, 0], down: [0, -1, 0], color: 'blue' },
  D: { normal: [0, -1, 0], right: [1, 0, 0], down: [0, 0, -1], color: 'yellow' },
};
export const scramble = "R U2 F' L D B2 R' U F2 D' L2 B U' R2 F D2";
export const dot = (a, b) => a.reduce((sum, value, i) => sum + value * b[i], 0);
const cross = (a, b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
const rotate = (vector, axis) => {
  const perpendicular = cross(vector, axis); // Clockwise looking at the face from outside.
  return vector.map((_, i) => perpendicular[i] + axis[i] * dot(vector, axis));
};
export function createSolvedCube(randomLetter) {
  return Object.entries(faces).flatMap(([face, {normal, right, down, color}]) =>
    Array.from({ length: 9 }, (_, index) => ({
      id: `${face}${index}`, color,
      letter: face === 'U' ? 'Aletheia '[index] : face === 'D' ? 'Logos    '[index] : randomLetter(),
      normal: [...normal],
      position: normal.map((value, axis) => value + right[axis] * (index % 3 - 1) + down[axis] * (Math.floor(index / 3) - 1)),
    })));
}
export function applyMoves(cube, sequence) {
  for (const move of sequence.trim().split(/\s+/).filter(Boolean)) {
    const axis = faces[move[0]].normal;
    const turns = move.endsWith('2') ? 2 : move.endsWith("'") ? 3 : 1;
    for (let turn = 0; turn < turns; turn++) {
      for (const sticker of cube) {
        if (dot(sticker.position, axis) === 1) {
          sticker.position = rotate(sticker.position, axis);
          sticker.normal = rotate(sticker.normal, axis);
        }
      }
    }
  }
  return cube;
}
export function inverseMoves(sequence) {
  return sequence.split(/\s+/).reverse().map(move => move.endsWith('2') ? move : move.endsWith("'") ? move.slice(0, -1) : `${move}'`).join(' ');
}
export function toNet(cube) {
  return Object.entries(faces).map(([face, {normal, right, down}]) => {
    const stickers = cube.filter(sticker => dot(sticker.normal, normal) === 1);
    stickers.sort((a, b) => (dot(a.position, down) - dot(b.position, down)) * 3 + dot(a.position, right) - dot(b.position, right));
    return { face, stickers: stickers.map(({color, letter}) => ({color, letter})) };
  });
}
