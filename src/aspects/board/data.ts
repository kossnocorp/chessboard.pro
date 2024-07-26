export interface SquareFeedback {
  type: SquareFeedbackType;
  square: Square;
}

export type SquareFeedbackType = "correct" | "incorrect";

export interface Square {
  rank: number;
  file: number;
  color: SquareColor;
}

export type SquareColor = "white" | "black";

export const squares = new Array(8 * 8).fill(null).map<Square>((_, i) => {
  const rank = 8 - Math.floor(i / 8);
  const file = (i % 8) + 1;
  const color = (rank + file) % 2 === 0 ? "black" : "white";
  return { rank, file, color };
});

export function fileLetter(file: number) {
  return String.fromCharCode(64 + file);
}

export function squareName(square: Square) {
  return `${fileLetter(square.file)}${square.rank}`;
}
