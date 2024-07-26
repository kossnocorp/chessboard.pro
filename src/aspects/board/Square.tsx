import { cn } from "crab";
import { useEffect, useRef, useState } from "react";
import { Square as Square_, SquareColor, SquareFeedbackType } from "./data";

export interface SquareProps {
  square: Square_;
  onClick?: () => void;
  feedback?: SquareFeedbackType | undefined;
}

export function Square(props: SquareProps) {
  const { square, onClick, feedback } = props;
  const [blinking, setBlinking] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!feedback || timerRef.current) return;
    setBlinking(true);
    timerRef.current = setTimeout(() => {
      setBlinking(false);
      timerRef.current = undefined;
    }, 500);
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
    white: ["text-neutral-800", [{ blinking: false }, "bg-white "]],
    black: ["text-white", [{ blinking: false }, "bg-neutral-800"]],
  })
  .feedback("correct", {})
  .blinking(false, {
    true: [
      [{ feedback: "correct" }, "bg-green-500"],
      [{ feedback: "incorrect" }, "bg-orange-500"],
    ],
  });
