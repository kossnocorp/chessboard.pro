"use client";

import { useEffect, useRef, useState } from "react";
import { Board } from "../board/Board";
import { Square, SquareFeedback, squareName, squares } from "../board/data";

const defaultSeconds = 30;

export function Vision() {
  const [started, setStarted] = useState<number>();
  const [squareToFind, setSquareToFind] = useState<Square>();
  const timerRef = useRef<NodeJS.Timeout>();
  const [timeLeft, setTimeLeft] = useState(defaultSeconds);
  const [score, setScore] = useState(0);
  const [totalSquares, setTotalSquares] = useState(0);
  const [feedback, setFeedback] = useState<SquareFeedback>();
  const [highScore, setHighScore] = useState(() => {
    const stored = localStorage.getItem("highScore");
    return (stored && parseInt(stored)) || 0;
  });

  useEffect(() => {
    if (!started) return clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const newLeft =
        Date.now() - started > defaultSeconds * 1000
          ? 0
          : defaultSeconds - Math.floor((Date.now() - started) / 1000);
      setTimeLeft(newLeft);
    }, 100);
    return () => clearInterval(timerRef.current);
  }, [started, setTimeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      setStarted(undefined);
      setSquareToFind(undefined);
      setTimeLeft(defaultSeconds);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("highScore", score.toString());
      }
    }
  }, [timeLeft]);

  const handleSquareClick = (square: Square) => {
    if (!started || !squareToFind) return;

    if (square === squareToFind) {
      setScore(score + 1);
      setFeedback({ type: "correct", square: squareToFind });
    } else {
      setFeedback({ type: "incorrect", square: squareToFind });
    }

    setSquareToFind(pickRandomSquare());
    setTotalSquares(totalSquares + 1);
  };

  useEffect(() => {
    if (!squareToFind) return;
    announceSquare(squareToFind);
  }, [squareToFind]);

  return (
    <div className="h-screen flex justify-center">
      <div className="grid grid-rows-[auto_1fr_auto]">
        <div className="h-40">
          {started ? (
            <div className="flex items-center justify-between">
              <div className="text-4xl text-neutral-400">
                0:{timeLeft.toString().padStart(2, "0")}
              </div>

              <div className="text-4xl">
                <span className="text-lime-400">{score}</span>
                <span className="text-gray-700">/{totalSquares}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-orange-300 text-5xl">{highScore}</span>
            </div>
          )}
        </div>

        <Board onClick={handleSquareClick} feedback={feedback} />

        <div className="flex justify-center items-center h-40">
          {started ? (
            <div className="text-5xl">
              {squareToFind ? squareName(squareToFind) : "..."}
            </div>
          ) : (
            <button
              className="bg-lime-800 hover:bg-lime-700 rounded-xl text-2xl py-5 px-12 select-none"
              onClick={() => {
                setStarted(Date.now());
                setScore(0);
                setSquareToFind(pickRandomSquare());
                setTotalSquares(0);
              }}
            >
              Train vision
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function pickRandomSquare() {
  return squares[Math.floor(Math.random() * 64)];
}

function announceSquare(square: Square) {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(squareName(square));
    utterance.lang = "en-US";
    utterance.rate = 1.2;
    window.speechSynthesis.speak(utterance);
  }
}
