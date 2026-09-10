"use client";

import { useState } from "react";

/*
  2×2 grid, urgent × important. Hovering or focusing a quadrant dims the
  others and surfaces its verb. Visitors pick up a sample task, then place it
  in a quadrant to feel the sorting. Everything is a real button; no pointer
  is required. State:

  tray task ──select──▶ picked ──place──▶ quadrant list
       ▲                  │ Escape / reselect
       └──────────────────┘
*/

const quadrants = [
  {
    id: "do",
    urgency: "Urgent",
    importance: "Important",
    verb: "Do",
    note: "Now, yourself.",
  },
  {
    id: "schedule",
    urgency: "Not urgent",
    importance: "Important",
    verb: "Schedule",
    note: "Give it a date. This is where long-term work lives.",
  },
  {
    id: "delegate",
    urgency: "Urgent",
    importance: "Not important",
    verb: "Delegate",
    note: "Someone or something else can carry it.",
  },
  {
    id: "delete",
    urgency: "Not urgent",
    importance: "Not important",
    verb: "Delete",
    note: "Without ceremony.",
  },
] as const;

type QuadrantId = (typeof quadrants)[number]["id"];

const sampleTasks = [
  { id: "reply", label: "Reply to a message that just arrived" },
  { id: "direction", label: "Think through next quarter's direction" },
  { id: "booking", label: "Book travel for next month" },
  { id: "feed", label: "Scroll one more feed" },
] as const;

export function EisenhowerMatrix() {
  const [placements, setPlacements] = useState<
    Partial<Record<string, QuadrantId>>
  >({});
  const [picked, setPicked] = useState<string | null>(null);
  const [status, setStatus] = useState(
    "Pick up a task, then choose the quadrant it belongs in.",
  );

  const trayTasks = sampleTasks.filter((task) => !placements[task.id]);

  function pickTask(taskId: string) {
    const task = sampleTasks.find((item) => item.id === taskId);
    if (!task) return;
    if (picked === taskId) {
      setPicked(null);
      setStatus("Put the task back down.");
      return;
    }
    setPicked(taskId);
    setStatus(`Holding “${task.label}”. Now choose a quadrant.`);
  }

  function placeTask(quadrantId: QuadrantId) {
    if (!picked) return;
    const task = sampleTasks.find((item) => item.id === picked);
    const quadrant = quadrants.find((item) => item.id === quadrantId);
    if (!task || !quadrant) return;
    setPlacements((current) => ({ ...current, [task.id]: quadrantId }));
    setPicked(null);
    setStatus(`“${task.label}” sorted into ${quadrant.verb.toLowerCase()}.`);
  }

  function reset() {
    setPlacements({});
    setPicked(null);
    setStatus("Cleared. Pick up a task to sort it again.");
  }

  return (
    <div className="fw-visual fw-eisenhower" data-picking={picked !== null}>
      <div
        className="fw-eisenhower-grid"
        role="group"
        aria-label="Eisenhower matrix: four quadrants crossing urgency and importance"
      >
        <span
          className="fw-eisenhower-axis fw-eisenhower-axis-x"
          aria-hidden="true"
        >
          Urgent → Not urgent
        </span>
        <span
          className="fw-eisenhower-axis fw-eisenhower-axis-y"
          aria-hidden="true"
        >
          Important → Not important
        </span>
        {quadrants.map((quadrant) => (
          <button
            className="fw-quadrant"
            key={quadrant.id}
            type="button"
            data-quadrant={quadrant.id}
            aria-label={
              picked
                ? `Place the held task in ${quadrant.verb}: ${quadrant.importance.toLowerCase()}, ${quadrant.urgency.toLowerCase()}`
                : `${quadrant.verb}: ${quadrant.importance.toLowerCase()}, ${quadrant.urgency.toLowerCase()}. ${quadrant.note}`
            }
            onClick={() => placeTask(quadrant.id)}
          >
            <span className="fw-quadrant-meta">
              {quadrant.importance} · {quadrant.urgency}
            </span>
            <span className="fw-quadrant-verb">{quadrant.verb}</span>
            <span className="fw-quadrant-note">{quadrant.note}</span>
            <span className="fw-quadrant-tasks">
              {sampleTasks
                .filter((task) => placements[task.id] === quadrant.id)
                .map((task) => (
                  <span className="fw-chip fw-chip-placed" key={task.id}>
                    {task.label}
                  </span>
                ))}
            </span>
          </button>
        ))}
      </div>

      <div className="fw-eisenhower-tray">
        <p className="fw-tray-label" id="fw-eisenhower-tray-label">
          Try sorting these:
        </p>
        <div
          className="fw-tray-chips"
          role="group"
          aria-labelledby="fw-eisenhower-tray-label"
        >
          {trayTasks.map((task) => (
            <button
              className="fw-chip"
              key={task.id}
              type="button"
              aria-pressed={picked === task.id}
              onClick={() => pickTask(task.id)}
            >
              {task.label}
            </button>
          ))}
          {trayTasks.length === 0 && (
            <button className="fw-reset" type="button" onClick={reset}>
              Sort them again
            </button>
          )}
        </div>
        <p className="fw-status" role="status">
          {status}
        </p>
      </div>
    </div>
  );
}
