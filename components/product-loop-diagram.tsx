"use client";

import { useState } from "react";

const loopSteps = [
  {
    label: "Define",
    description: "Name the user and problem.",
  },
  {
    label: "Ship",
    description: "Release the smallest version that can create an aha moment.",
  },
  {
    label: "Watch",
    description: "Follow the journey from acquisition to revenue.",
  },
  {
    label: "Listen",
    description: "Talk to the users who would genuinely miss the product.",
  },
  {
    label: "Prioritise",
    description:
      "Weigh recurring problems against reach, impact, confidence and effort.",
  },
  {
    label: "Improve",
    description: "Strengthen the product's reason to return.",
  },
  {
    label: "Repeat",
    description: "Carry what you learned into the next pass.",
  },
] as const;

const center = 180;
const radius = 120;
const circumference = 2 * Math.PI * radius;
const segmentLength = circumference / loopSteps.length;

const nodes = loopSteps.map((step, index) => {
  const angle = ((index * 360) / loopSteps.length - 90) * (Math.PI / 180);

  return {
    ...step,
    x: center + Math.cos(angle) * radius,
    y: center + Math.sin(angle) * radius,
  };
});

type DiagramView = "launch" | "loop";

export function ProductLoopDiagram() {
  const [view, setView] = useState<DiagramView>("loop");
  const [activeStep, setActiveStep] = useState(0);
  const selected = loopSteps[activeStep];

  return (
    <figure
      aria-label="Launch view and operating loop"
      className="product-loop-figure"
      data-view={view}
    >
      <header className="product-loop-header">
        <div>
          <h2>What changes after release?</h2>
          <p>
            Compare a launch that ends at shipping with a product loop that
            turns evidence into the next decision.
          </p>
        </div>

        <div aria-label="Choose a product view" className="product-loop-switch">
          {(["launch", "loop"] as const).map((option) => (
            <button
              aria-pressed={view === option}
              key={option}
              onClick={() => setView(option)}
              type="button"
            >
              {option === "launch" ? "Launch view" : "Loop view"}
            </button>
          ))}
        </div>
      </header>

      <div className="product-loop-stage">
        <div className="product-loop-canvas" aria-hidden="true">
          <svg viewBox="0 0 360 360">
            <defs>
              <marker
                id="product-loop-arrow"
                markerHeight="8"
                markerWidth="8"
                orient="auto"
                refX="7"
                refY="4"
                viewBox="0 0 8 8"
              >
                <path d="M0 0l8 4-8 4z" />
              </marker>
            </defs>

            <g
              className="product-launch-view"
              data-visible={view === "launch" || undefined}
            >
              <path
                className="product-launch-line"
                d="M54 180H306"
                markerEnd="url(#product-loop-arrow)"
              />
              {[
                [70, "Define"],
                [180, "Build"],
                [290, "Release"],
              ].map(([x, label]) => (
                <g className="product-launch-node" key={label}>
                  <circle cx={Number(x)} cy="180" r="25" />
                  <text x={Number(x)} y="184">
                    {label}
                  </text>
                </g>
              ))}
              <path className="product-launch-stop" d="M318 153v54" />
              <text className="product-launch-caption" x="318" y="230">
                Finish
              </text>
            </g>

            <g
              className="product-operating-view"
              data-visible={view === "loop" || undefined}
            >
              <circle
                className="product-loop-base"
                cx={center}
                cy={center}
                r={radius}
              />
              <circle
                className="product-loop-flow"
                cx={center}
                cy={center}
                r={radius - 13}
              />
              {nodes.map((node, index) => (
                <circle
                  className="product-loop-segment"
                  cx={center}
                  cy={center}
                  data-active={activeStep === index || undefined}
                  key={node.label}
                  r={radius}
                  strokeDasharray={`${segmentLength - 14} ${circumference - segmentLength + 14}`}
                  strokeDashoffset={-index * segmentLength}
                />
              ))}
              {nodes.map((node, index) => (
                <g
                  className="product-loop-node"
                  data-active={activeStep === index || undefined}
                  key={node.label}
                >
                  <circle cx={node.x} cy={node.y} r="25" />
                  <text x={node.x} y={node.y + 4}>
                    {node.label}
                  </text>
                </g>
              ))}
              <text className="product-loop-center-label" x="180" y="174">
                {selected.label}
              </text>
              <text className="product-loop-center-note" x="180" y="198">
                learning returns
              </text>
            </g>
          </svg>
        </div>

        <div className="product-loop-reading">
          {view === "loop" ? (
            <>
              <div className="product-loop-status" role="status">
                <strong>{selected.label}</strong>
                <span>{selected.description}</span>
              </div>

              <div
                aria-label="Explore the operating loop"
                className="product-loop-steps"
              >
                {loopSteps.map((step, index) => (
                  <button
                    aria-pressed={activeStep === index}
                    key={step.label}
                    onClick={() => setActiveStep(index)}
                    onFocus={() => setActiveStep(index)}
                    onPointerEnter={() => setActiveStep(index)}
                    type="button"
                  >
                    {step.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="product-loop-status" role="status">
              <strong>Launch view</strong>
              <span>
                Release becomes the finish line. Observation, feedback and the
                next decision sit outside the picture.
              </span>
            </div>
          )}
        </div>
      </div>

      <figcaption>
        <span>
          {view === "loop"
            ? "Select a verb to trace the cycle."
            : "Switch to loop view to continue beyond release."}
        </span>
        <span>Built from the operating loop in this essay.</span>
      </figcaption>
    </figure>
  );
}
