import { cn, CNProps } from "crab";
import {
  Square as Square_,
  SquareColor,
  SquareFeedbackType,
  squareName,
  squares,
} from "./data";
import { useEffect, useState } from "react";

export interface SquareProps {
  square: Square_;
  onClick?: () => void;
  feedback?: SquareFeedbackType | undefined;
}

export function Square(props: SquareProps) {
  const { square, onClick, feedback } = props;
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    if (!feedback) return;
    setBlinking(true);
    const timer = setTimeout(() => setBlinking(false), 500);
    return () => clearTimeout(timer);
  }, [feedback]);

  return (
    <div
      className={squareCn({ color: square.color, feedback, blinking })}
      onClick={onClick}
    />
  );
}

const squareCn = cn<{
  color: SquareColor;
  feedback: SquareFeedbackType;
  blinking: boolean;
}>()
  .base("transition-colors duration-200")
  .color("black", {
    white: "bg-white text-neutral-800",
    black: "bg-neutral-800 text-white",
  })
  .feedback("correct", {})
  .blinking(false, {
    true: [
      [{ feedback: "correct" }, "bg-green-500"],
      [{ feedback: "incorrect" }, "bg-orange-500"],
    ],
  });
