import React, { useMemo, useState } from "react";
import "../../styles/Board/Board.css";
import boardSvg from "../../assets/plateau.svg";
import { boardCells as initialCells } from "./boardCells";

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

export default function BoardEditor() {
  const [cells, setCells] = useState(initialCells);
  const [selectedId, setSelectedId] = useState(0);

  const selected = useMemo(
    () => cells.find((c) => c.id === selectedId),
    [cells, selectedId]
  );

  function updateCell(id, patch) {
    setCells((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
    );
  }

  function exportJSON() {
    const out = cells
      .slice()
      .sort((a, b) => a.id - b.id)
      .map((c) => ({
        id: c.id,
        x: +c.x.toFixed(2),
        y: +c.y.toFixed(2),
        w: +c.w.toFixed(2),
        h: +c.h.toFixed(2),
      }));

    console.log("✅ Remplace boardCells par ceci :");
    console.log(out);
    alert("Export fait dans la console (F12) ✅");
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        {/* Plateau + rectangles */}
        <div className="board-wrap" style={{ flex: 1 }}>
          <div className="board-stage">
            <img className="board-img" src={boardSvg} alt="Plateau (SVG)" />

            {cells.map((c) => (
              <CellRect
                key={c.id}
                cell={c}
                selected={c.id === selectedId}
                onSelect={() => setSelectedId(c.id)}
                onChange={(patch) => updateCell(c.id, patch)}
              />
            ))}
          </div>
        </div>

        {/* Panneau */}
        <div
          style={{
            width: 300,
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 12,
            padding: 12,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>Éditeur cases</strong>
            <button onClick={exportJSON}>Exporter</button>
          </div>

          <div style={{ marginTop: 10 }}>
            <label>Case:</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(Number(e.target.value))}
              style={{ width: "100%", marginTop: 6 }}
            >
              {cells
                .slice()
                .sort((a, b) => a.id - b.id)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id}
                  </option>
                ))}
            </select>
          </div>

          {selected && (
            <div style={{ marginTop: 12, fontFamily: "monospace", fontSize: 13 }}>
              <div>x: {selected.x.toFixed(2)}%</div>
              <div>y: {selected.y.toFixed(2)}%</div>
              <div>w: {selected.w.toFixed(2)}%</div>
              <div>h: {selected.h.toFixed(2)}%</div>

              <p style={{ opacity: 0.8, marginTop: 10 }}>
                Déplacer: drag sur le rectangle<br />
                Resize: drag le petit carré en bas-droite
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CellRect({ cell, selected, onSelect, onChange }) {
  const [drag, setDrag] = useState(null);

  function onPointerDownMove(e) {
    e.preventDefault();
    onSelect();
    setDrag({
      type: "move",
      startX: e.clientX,
      startY: e.clientY,
      x: cell.x,
      y: cell.y,
    });
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerDownResize(e) {
    e.preventDefault();
    e.stopPropagation();
    onSelect();
    setDrag({
      type: "resize",
      startX: e.clientX,
      startY: e.clientY,
      w: cell.w,
      h: cell.h,
    });
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (!drag) return;

    const stage = e.currentTarget.parentElement; // board-stage
    const rect = stage.getBoundingClientRect();

    const dxPct = ((e.clientX - drag.startX) / rect.width) * 100;
    const dyPct = ((e.clientY - drag.startY) / rect.height) * 100;

    if (drag.type === "move") {
      const nx = clamp(drag.x + dxPct, 0, 100 - cell.w);
      const ny = clamp(drag.y + dyPct, 0, 100 - cell.h);
      onChange({ x: nx, y: ny });
    } else {
      const nw = clamp(drag.w + dxPct, 1, 100 - cell.x);
      const nh = clamp(drag.h + dyPct, 1, 100 - cell.y);
      onChange({ w: nw, h: nh });
    }
  }

  function onPointerUp() {
    setDrag(null);
  }

  return (
    <div
      className="board-cell board-cell--debug"
      style={{
        left: `${cell.x}%`,
        top: `${cell.y}%`,
        width: `${cell.w}%`,
        height: `${cell.h}%`,
        outline: selected ? "3px solid rgba(0,255,255,0.95)" : undefined,
      }}
      onPointerDown={onPointerDownMove}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <span className="board-cell__id">{cell.id}</span>

      {/* poignée resize */}
      <div
        onPointerDown={onPointerDownResize}
        style={{
          position: "absolute",
          right: -6,
          bottom: -6,
          width: 14,
          height: 14,
          borderRadius: 4,
          background: "rgba(0,255,255,0.95)",
          cursor: "nwse-resize",
        }}
        title="Resize"
      />
    </div>
  );
}
