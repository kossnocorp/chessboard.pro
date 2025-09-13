"use client";

import { squareName, squares, Square as Square_, SquareFeedback } from "./data";
import { Square } from "./Square";

export interface BoardProps {
  onClick?: (square: Square_) => void;
  feedback?: SquareFeedback | undefined;
}

export function Board(props: BoardProps) {
  const { onClick, feedback } = props;
  return (
    <div className="grid grid-cols-8 grid-rows-8 aspect-square select-none">
      {squares.map((square) => (
        <Square
          square={square}
          onClick={() => onClick?.(square)}
          feedback={
            feedback && feedback.square === square ? feedback.type : undefined
          }
          key={squareName(square)}
        />
      ))}
    </div>
  );
}
