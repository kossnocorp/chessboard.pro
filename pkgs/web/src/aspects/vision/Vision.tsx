"use client";

import { recordVisionResultAction } from "@/aspects/vision/actions";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Board } from "../board/Board";
import { Square, SquareFeedback, squareName, squares } from "../board/data";
import { useVisionHistory } from "./history";

const defaultSeconds = 30;

export function Vision({ loggedIn }: { loggedIn: boolean }) {
  const [started, setStarted] = useState<number>();
  const [squareToFind, setSquareToFind] = useState<Square>();
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined,
  );
  const [timeLeft, setTimeLeft] = useState(defaultSeconds);
  const [score, setScore] = useState<number>();
  const [accuracy, setAccuracy] = useState<number>(0);
  const [totalSquares, setTotalSquares] = useState(0);
  const [feedback, setFeedback] = useState<SquareFeedback>();
  const [highScore, setHighScore] = useState(() => {
    let stored;
    try {
      stored = localStorage.getItem("visionHighScore");
    } catch {}
    return (stored && parseInt(stored)) || 0;
  });
  const { addRecord } = useVisionHistory();

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
      if (typeof score === "number" && score > highScore) {
        setHighScore(score);
        if (!loggedIn) {
          try {
            localStorage.setItem("visionHighScore", score.toString());
          } catch {}
        }
      }
      const time = Date.now();
      (async () => {
        if (loggedIn) {
          try {
            const res = await recordVisionResultAction({
              score: score || 0,
              time,
              accuracy,
              settings: {},
            });
            if (!res?.ok) {
              addRecord({ score: score || 0, time, accuracy });
            }
          } catch {
            addRecord({ score: score || 0, time, accuracy });
          }
        } else {
          addRecord({ score: score || 0, time, accuracy });
        }
      })();
    }
  }, [timeLeft, score, accuracy]);

  const handleSquareClick = (square: Square) => {
    if (!started || !squareToFind) return;

    const newTotalSquares = totalSquares + 1;
    let newScore = score || 0;

    if (square === squareToFind) {
      newScore += 1;
      setScore(newScore);
      setFeedback({ type: "correct", square: squareToFind });
    } else {
      setFeedback({ type: "incorrect", square: squareToFind });
    }

    setTotalSquares(newTotalSquares);
    setAccuracy(newScore / newTotalSquares);

    let nextSquare;
    do {
      nextSquare = pickRandomSquare();
    } while (
      !nextSquare ||
      nextSquare.file === squareToFind.file ||
      nextSquare.rank === squareToFind.rank
    );

    setSquareToFind(nextSquare);
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
            <div className="flex items-center justify-between h-full">
              <div className="text-4xl text-neutral-400">
                0:{timeLeft.toString().padStart(2, "0")}
              </div>

              <div className="text-4xl">
                <span className="text-lime-400">{score}</span>
                <span className="text-gray-700">/{totalSquares}</span>{" "}
                <span className="text-blue-400 ml-4">
                  {(accuracy * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <Link href="/vision/history">
                {typeof score === "number" ? (
                  <span>
                    <span className="text-orange-300 text-5xl">{score}</span>{" "}
                    <span className="text-orange-600/50 text-5xl">
                      ({highScore})
                    </span>
                  </span>
                ) : (
                  <span className="text-orange-300 text-5xl">{highScore}</span>
                )}
              </Link>
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
