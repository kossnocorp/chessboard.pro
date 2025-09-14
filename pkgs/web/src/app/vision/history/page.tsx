"use client";

import {
  importVisionHistoryAction,
  listVisionHistoryAction,
} from "@/aspects/vision/actions";
import {
  useVisionHistory,
  VisionHistoryRecord,
} from "@/aspects/vision/history";
import * as d3 from "d3";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function VisionHistoryPage() {
  const { history, clearHistory } = useVisionHistory();
  const [server, setServer] = useState<{
    loggedIn: boolean;
    records: VisionHistoryRecord[];
  }>({ loggedIn: false, records: [] });
  const [importing, setImporting] = useState(false);
  const chartRef = useRef<SVGSVGElement | null>(null);
  const [tooltip, setTooltip] = useState({
    show: false,
    x: 0,
    y: 0,
    content: "",
  });

  // Load server-side records if logged in
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await listVisionHistoryAction();
        if (!cancelled) {
          setServer({ loggedIn: !!res.loggedIn, records: res.records || [] });
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const data: VisionHistoryRecord[] = useMemo(
    () => (server.loggedIn ? server.records : history),
    [server, history],
  );

  useEffect(() => {
    if (data.length === 0 || !chartRef.current) return;

    const svg = d3.select(chartRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 80, bottom: 30, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xExtent = d3.extent(data, (d) => new Date(d.time)) as [Date, Date];
    const xPadding = 0.05 * (xExtent[1].getTime() - xExtent[0].getTime());
    const x = d3
      .scaleTime()
      .domain([
        new Date(xExtent[0].getTime() - xPadding),
        new Date(xExtent[1].getTime() + xPadding),
      ])
      .range([0, width]);

    const yScore = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.score) as number])
      .range([height, 0]);

    const yAccuracy = d3.scaleLinear().domain([0, 1]).range([height, 0]);

    const scoreLine = d3
      .line<VisionHistoryRecord>()
      .x((d) => x(new Date(d.time)))
      .y((d) => yScore(d.score));

    const accuracyLine = d3
      .line<VisionHistoryRecord>()
      .x((d) => x(new Date(d.time)))
      .y((d) => yAccuracy(d.accuracy));

    const verticalLine = g
      .append("line")
      .attr("y1", 0)
      .attr("y2", height)
      .style("stroke", "#555")
      .style("stroke-width", 1)
      .style("opacity", 0);

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "gold")
      .attr("stroke-width", 2)
      .attr("d", scoreLine);

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "gray")
      .attr("stroke-width", 2)
      .attr("d", accuracyLine);

    const addDots = (
      className: string,
      yScale: d3.ScaleLinear<number, number>,
      color: string,
    ) => {
      g.selectAll(`.${className}`)
        .data(data)
        .enter()
        .append("circle")
        .attr("class", className)
        .attr("cx", (d) => x(new Date(d.time)))
        .attr("cy", (d) =>
          yScale(className === "dot-score" ? d.score : d.accuracy),
        )
        .attr("r", 4)
        .attr("fill", color);
    };

    addDots("dot-score", yScore, "gold");
    addDots("dot-accuracy", yAccuracy, "gray");

    g.append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mousemove", (event) => {
        const [mouseX] = d3.pointer(event);
        const xDate = x.invert(mouseX);
        const bisect = d3.bisector(
          (d: VisionHistoryRecord) => new Date(d.time),
        ).left;
        const index = bisect(data, xDate, 1);
        const d0 = data[index - 1];
        const d1 = data[index];

        const d =
          d1 &&
          xDate.getTime() - new Date(d0.time).getTime() >
            new Date(d1.time).getTime() - xDate.getTime()
            ? d1
            : d0;

        if (d) {
          const xPos = x(new Date(d.time));

          verticalLine.attr("x1", xPos).attr("x2", xPos).style("opacity", 1);

          setTooltip({
            show: true,
            x: xPos + margin.left,
            y: Math.min(yScore(d.score), yAccuracy(d.accuracy)) + margin.top,
            content: `${d.score}/${Math.round(d.score / d.accuracy)} ${(
              d.accuracy * 100
            ).toFixed(1)}%`,
          });
        }
      })
      .on("mouseout", () => {
        setTooltip({ ...tooltip, show: false });
        verticalLine.style("opacity", 0);
      });

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(formatTick).ticks(5))
      .call((g) => g.select(".domain").attr("stroke", "#555"))
      .call((g) => g.selectAll(".tick line").attr("stroke", "#555"))
      .call((g) => g.selectAll("text").style("opacity", 0.7));

    g.append("g")
      .call(d3.axisLeft(yScore))
      .call((g) => g.select(".domain").attr("stroke", "#555"))
      .call((g) => g.selectAll(".tick line").attr("stroke", "#555"))
      .call((g) => g.selectAll("text").style("opacity", 0.7));

    g.append("g")
      .attr("transform", `translate(${width},0)`)
      .call(
        d3
          .axisRight(yAccuracy)
          .tickFormat((d: d3.NumberValue) => `${(+d * 100).toFixed(0)}%`),
      )
      .call((g) => g.select(".domain").attr("stroke", "#555"))
      .call((g) => g.selectAll(".tick line").attr("stroke", "#555"))
      .call((g) => g.selectAll("text").style("opacity", 0.7));

    g.append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom)
      .style("text-anchor", "middle")
      .text("Date");

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left)
      .attr("x", -height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("fill", "gold")
      .text("Score");

    g.append("text")
      .attr("transform", "rotate(90)")
      .attr("y", -width - 45)
      .attr("x", height / 2)
      .attr("dy", "-0.5em")
      .style("text-anchor", "middle")
      .style("fill", "gray")
      .text("Accuracy");
  }, [data, setTooltip]);

  const handleImport = useCallback(async () => {
    try {
      setImporting(true);
      const res = await importVisionHistoryAction(history);
      if (res.ok) {
        const refreshed = await listVisionHistoryAction();
        setServer({
          loggedIn: !!refreshed.loggedIn,
          records: refreshed.records || [],
        });
        // Clear local storage and hide the import button
        clearHistory();
      }
    } finally {
      setImporting(false);
    }
  }, [history, clearHistory]);

  return (
    <main>
      <h1>Vision History</h1>
      <div style={{ position: "relative" }}>
        <svg ref={chartRef} width={800} height={400}></svg>
        {tooltip.show && (
          <div
            style={{
              position: "absolute",
              left: `${tooltip.x}px`,
              top: `${tooltip.y}px`,
              background: "rgba(0,0,0,0.7)",
              color: "white",
              padding: "5px",
              borderRadius: "3px",
              fontSize: "12px",
            }}
          >
            {tooltip.content}
          </div>
        )}
      </div>
      {server.loggedIn && history.length > 0 && (
        <div className="mt-4">
          <button
            className="bg-lime-800 hover:bg-lime-700 rounded px-4 py-2"
            onClick={handleImport}
            disabled={importing}
            title="Import local records to your account (marked as local)"
          >
            {importing
              ? "Importing..."
              : `Import ${history.length} local record(s)`}
          </button>
        </div>
      )}
    </main>
  );
}

const formatTick = (value: Date | d3.NumberValue, _index: number): string => {
  if (value instanceof Date) return d3.timeFormat("%b %d")(value);
  return value.toString();
};
