"use client";

import { useState } from "react";

/*
  Musk's semantic tree. The whole tree is drawn faint. Building it in order —
  trunk, then branches, then leaves — solidifies each part. Clicking a leaf
  whose branch is not built makes it fall: there is nothing for it to hang on
  to. Every part is a real button.

  trunk ──▶ branch a ──▶ leaves a1 a2 a3
       └──▶ branch b ──▶ leaves b1 b2
       └──▶ branch c ──▶ leaves c1 c2
*/

const branches = [
  { id: "a", label: "core truth", d: "M200 240 C 186 196, 150 172, 108 150" },
  { id: "b", label: "core truth", d: "M200 240 C 202 188, 210 150, 216 108" },
  { id: "c", label: "core truth", d: "M200 240 C 216 200, 258 176, 300 158" },
] as const;

const leaves = [
  { id: "a1", branch: "a", x: 84, y: 132 },
  { id: "a2", branch: "a", x: 112, y: 112 },
  { id: "a3", branch: "a", x: 140, y: 138 },
  { id: "b1", branch: "b", x: 196, y: 84 },
  { id: "b2", branch: "b", x: 238, y: 92 },
  { id: "c1", branch: "c", x: 296, y: 122 },
  { id: "c2", branch: "c", x: 324, y: 146 },
] as const;

export function KnowledgeTree() {
  const [trunkBuilt, setTrunkBuilt] = useState(false);
  const [builtBranches, setBuiltBranches] = useState<string[]>([]);
  const [attachedLeaves, setAttachedLeaves] = useState<string[]>([]);
  const [fallingLeaf, setFallingLeaf] = useState<string | null>(null);
  const [status, setStatus] = useState(
    "Try attaching a leaf first — or start with the trunk.",
  );

  function clickTrunk() {
    if (trunkBuilt) return;
    setTrunkBuilt(true);
    setStatus("Trunk built: the fundamental principles are in place.");
  }

  function clickBranch(branchId: string) {
    if (builtBranches.includes(branchId)) return;
    if (!trunkBuilt) {
      setStatus("The branch has no trunk to grow from. Build the trunk first.");
      return;
    }
    setBuiltBranches((current) => [...current, branchId]);
    setStatus("Branch built: a core truth, attached to fundamentals.");
  }

  function clickLeaf(leafId: string, branchId: string) {
    if (attachedLeaves.includes(leafId)) return;
    if (!trunkBuilt || !builtBranches.includes(branchId)) {
      setFallingLeaf(leafId);
      setStatus("The leaf fell. A detail has nothing to hang on to yet.");
      window.setTimeout(() => setFallingLeaf(null), 900);
      return;
    }
    setAttachedLeaves((current) => [...current, leafId]);
    setStatus(
      attachedLeaves.length + 1 === leaves.length
        ? "Every detail holds, because the structure came first."
        : "Leaf attached: the detail has a branch to hang on to.",
    );
  }

  function reset() {
    setTrunkBuilt(false);
    setBuiltBranches([]);
    setAttachedLeaves([]);
    setFallingLeaf(null);
    setStatus(
      "Cleared. Build it in any order you like — or the order that works.",
    );
  }

  const complete = trunkBuilt && attachedLeaves.length === leaves.length;

  return (
    <div className="fw-visual fw-tree">
      <div className="fw-tree-canvas">
        <svg
          className="fw-tree-svg"
          viewBox="0 0 400 320"
          role="img"
          aria-label="A tree with a trunk, three big branches and seven leaves, drawn faint until each part is built. Leaves clicked before their branch exists fall off."
        >
          <line className="fw-tree-ground" x1={80} y1={288} x2={320} y2={288} />
          <path
            className={`fw-tree-trunk${trunkBuilt ? " is-built" : ""}`}
            d="M200 288 C 198 272, 202 254, 200 240"
          />
          {branches.map((branch) => (
            <path
              className={`fw-tree-branch${
                builtBranches.includes(branch.id) ? " is-built" : ""
              }`}
              key={branch.id}
              d={branch.d}
            />
          ))}
          {leaves.map((leaf) => (
            <circle
              className={`fw-tree-leaf${
                attachedLeaves.includes(leaf.id) ? " is-built" : ""
              }${fallingLeaf === leaf.id ? " is-falling" : ""}`}
              key={leaf.id}
              cx={leaf.x}
              cy={leaf.y}
              r={7}
            />
          ))}
        </svg>

        <div className="fw-tree-hotspots" aria-hidden={false}>
          <button
            className="fw-hotspot fw-hotspot-trunk"
            type="button"
            aria-pressed={trunkBuilt}
            aria-label="Build the trunk: the fundamental principles"
            onClick={clickTrunk}
            style={{ left: "50%", top: "82%" }}
          >
            <span aria-hidden="true" />
          </button>
          {branches.map((branch, index) => (
            <button
              className="fw-hotspot"
              key={branch.id}
              type="button"
              aria-pressed={builtBranches.includes(branch.id)}
              aria-label={`Build a big branch: a ${branch.label}`}
              onClick={() => clickBranch(branch.id)}
              style={{
                left: `${[37.5, 51.5, 62.5][index]}%`,
                top: `${[58, 53, 61][index]}%`,
              }}
            >
              <span aria-hidden="true" />
            </button>
          ))}
          {leaves.map((leaf) => (
            <button
              className="fw-hotspot fw-hotspot-leaf"
              key={leaf.id}
              type="button"
              aria-pressed={attachedLeaves.includes(leaf.id)}
              aria-label="Attach a leaf: a detail"
              onClick={() => clickLeaf(leaf.id, leaf.branch)}
              style={{
                left: `${(leaf.x / 400) * 100}%`,
                top: `${(leaf.y / 320) * 100}%`,
              }}
            >
              <span aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>

      <div className="fw-tree-footer">
        <p className="fw-status" role="status">
          {status}
        </p>
        {(trunkBuilt || complete) && (
          <button className="fw-reset" type="button" onClick={reset}>
            Start over
          </button>
        )}
      </div>
    </div>
  );
}
