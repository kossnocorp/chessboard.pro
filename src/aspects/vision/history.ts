import { useCallback, useState } from "react";

export interface VisionHistoryRecord {
  /** The number of found squares. */
  score: number;
  /** The round timestamp. */
  time: number;
  /** Round accuracy (0.0-1.0). */
  accuracy: number;
}

export function useVisionHistory() {
  const [history, setHistory] = useState<VisionHistoryRecord[]>(() => {
    let stored;
    try {
      stored = localStorage.getItem("visionHistory");
    } catch {}
    return (stored && JSON.parse(stored)) || [];
  });

  const addRecord = useCallback(
    (record: VisionHistoryRecord) => {
      setHistory((history) => {
        const newHistory = [...history, record];
        try {
          localStorage.setItem("visionHistory", JSON.stringify(newHistory));
        } catch {}
        return newHistory;
      });
    },
    [setHistory]
  );

  return { history, addRecord };
}
