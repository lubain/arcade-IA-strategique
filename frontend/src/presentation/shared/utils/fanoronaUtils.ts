export const X = 1;
export const O = -1;
export const BOARD_SIZE = 9;
export const PIECES_PER_PLAYER = 3;

// --- Logique de voisinage (indispensable pour le déplacement) ---
const inBounds = (x: number, y: number) => x >= 0 && x < 3 && y >= 0 && y < 3;

export const getAdjacent = (index: number): number[] => {
  const x = index % 3;
  const y = Math.floor(index / 3);
  const dirs =
    (x + y) % 2 === 0
      ? [
          { dx: 1, dy: 0 },
          { dx: -1, dy: 0 },
          { dx: 0, dy: 1 },
          { dx: 0, dy: -1 },
          { dx: 1, dy: 1 },
          { dx: 1, dy: -1 },
          { dx: -1, dy: 1 },
          { dx: -1, dy: -1 },
        ]
      : [
          { dx: 1, dy: 0 },
          { dx: -1, dy: 0 },
          { dx: 0, dy: 1 },
          { dx: 0, dy: -1 },
        ];

  const result: number[] = [];
  for (const d of dirs) {
    const nx = x + d.dx,
      ny = y + d.dy;
    if (inBounds(nx, ny)) result.push(ny * 3 + nx);
  }
  return result;
};

// --- État du jeu ---
export const isPlacementPhase = (board: number[]): boolean => {
  const count = board.filter((c) => c !== 0).length;
  return count < PIECES_PER_PLAYER * 2;
};

export const checkWinner = (board: number[]): number => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (board[a] !== 0 && board[a] === board[b] && board[b] === board[c])
      return board[a];
  }
  return 0;
};

// --- Génération des coups (pour validation humaine) ---
export const getSuccessors = (board: number[], turn: number): number[][] => {
  const successors: number[][] = [];
  if (isPlacementPhase(board)) {
    for (let i = 0; i < BOARD_SIZE; i++) {
      if (board[i] === 0) {
        const next = [...board];
        next[i] = turn;
        successors.push(next);
      }
    }
  } else {
    for (let i = 0; i < BOARD_SIZE; i++) {
      if (board[i] !== turn) continue;
      for (const adj of getAdjacent(i)) {
        if (board[adj] === 0) {
          const next = [...board];
          next[i] = 0;
          next[adj] = turn;
          successors.push(next);
        }
      }
    }
  }
  return successors;
};
