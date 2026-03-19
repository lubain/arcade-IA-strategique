export const X = 1;
export const O = -1;

export const checkWinner = (board: number[]) => {
  const lines = [
    { indices: [0, 1, 2], type: "h-1" },
    { indices: [3, 4, 5], type: "h-2" },
    { indices: [6, 7, 8], type: "h-3" },
    { indices: [0, 3, 6], type: "v-1" },
    { indices: [1, 4, 7], type: "v-2" },
    { indices: [2, 5, 8], type: "v-3" },
    { indices: [0, 4, 8], type: "d-1" },
    { indices: [2, 4, 6], type: "d-2" },
  ];

  for (const line of lines) {
    const [a, b, c] = line.indices;
    if (board[a] !== 0 && board[a] === board[b] && board[b] === board[c]) {
      return { winner: board[a], line: line.type };
    }
  }
  return null;
};

export const isFull = (board: number[]): boolean =>
  board.every((cell) => cell !== 0);
