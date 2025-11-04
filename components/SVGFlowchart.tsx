"use client";

import React from "react";

type NodeType = "terminal" | "process" | "io" | "decision" | "predefined" | "connector" | "note";

export type FlowNode = {
  id: string;
  type: NodeType;
  x: number; // center x
  y: number; // center y
  w?: number;
  h?: number;
  text: string;
};

export type FlowEdge = {
  id: string;
  from: string;
  to: string;
  label?: string;
  // optional manual bend via an intermediate point
  via?: { x: number; y: number }[];
};

export type Flow = {
  nodes: FlowNode[];
  edges: FlowEdge[];
};

const defaultSize: Record<NodeType, { w: number; h: number }> = {
  terminal: { w: 180, h: 56 },
  process: { w: 220, h: 70 },
  io: { w: 220, h: 70 },
  decision: { w: 170, h: 170 },
  predefined: { w: 240, h: 70 },
  connector: { w: 40, h: 40 },
  note: { w: 220, h: 70 }
};

function wrapText(text: string, maxWidth: number, lineHeight: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  const approxChar = 7; // heuristic
  const maxChars = Math.max(8, Math.floor(maxWidth / approxChar));
  for (const w of words) {
    if ((current + " " + w).trim().length > maxChars) {
      if (current) lines.push(current);
      current = w;
    } else {
      current = (current + " " + w).trim();
    }
  }
  if (current) lines.push(current);
  return lines.map((line, i) => (
    <tspan key={i} x={0} dy={i === 0 ? 0 : lineHeight}>
      {line}
    </tspan>
  ));
}

function Terminal({ x, y, w, h, text }: { x: number; y: number; w: number; h: number; text: string }) {
  const rx = Math.min(w, h) * 0.35;
  return (
    <g transform={`translate(${x - w / 2}, ${y - h / 2})`}>
      <rect width={w} height={h} rx={rx} ry={rx} fill="#fff" stroke="#111827" strokeWidth={2} />
      <g transform={`translate(${w / 2}, ${h / 2})`}>
        <text textAnchor="middle" dominantBaseline="middle" fontSize={14} fill="#111827">
          {wrapText(text, w - 24, 18)}
        </text>
      </g>
    </g>
  );
}

function Process({ x, y, w, h, text }: { x: number; y: number; w: number; h: number; text: string }) {
  return (
    <g transform={`translate(${x - w / 2}, ${y - h / 2})`}>
      <rect width={w} height={h} fill="#fff" stroke="#111827" strokeWidth={2} />
      <g transform={`translate(${w / 2}, ${h / 2})`}>
        <text textAnchor="middle" dominantBaseline="middle" fontSize={14} fill="#111827">
          {wrapText(text, w - 24, 18)}
        </text>
      </g>
    </g>
  );
}

function IO({ x, y, w, h, text }: { x: number; y: number; w: number; h: number; text: string }) {
  const skew = 16;
  return (
    <g transform={`translate(${x - w / 2}, ${y - h / 2})`}>
      <polygon
        points={`${skew},0 ${w},0 ${w - skew},${h} 0,${h}`}
        fill="#fff"
        stroke="#111827"
        strokeWidth={2}
      />
      <g transform={`translate(${w / 2}, ${h / 2})`}>
        <text textAnchor="middle" dominantBaseline="middle" fontSize={14} fill="#111827">
          {wrapText(text, w - 32, 18)}
        </text>
      </g>
    </g>
  );
}

function Decision({ x, y, w, h, text }: { x: number; y: number; w: number; h: number; text: string }) {
  const halfW = w / 2;
  const halfH = h / 2;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <polygon
        points={`0,${-halfH} ${halfW},0 0,${halfH} ${-halfW},0`}
        fill="#fff"
        stroke="#111827"
        strokeWidth={2}
      />
      <g>
        <text textAnchor="middle" dominantBaseline="middle" fontSize={14} fill="#111827">
          {wrapText(text, Math.min(w, h) - 36, 18)}
        </text>
      </g>
    </g>
  );
}

function Predefined({ x, y, w, h, text }: { x: number; y: number; w: number; h: number; text: string }) {
  const margin = 18;
  return (
    <g transform={`translate(${x - w / 2}, ${y - h / 2})`}>
      <rect width={w} height={h} fill="#fff" stroke="#111827" strokeWidth={2} />
      <line x1={margin} y1={0} x2={margin} y2={h} stroke="#111827" strokeWidth={2} />
      <line x1={w - margin} y1={0} x2={w - margin} y2={h} stroke="#111827" strokeWidth={2} />
      <g transform={`translate(${w / 2}, ${h / 2})`}>
        <text textAnchor="middle" dominantBaseline="middle" fontSize={14} fill="#111827">
          {wrapText(text, w - 48, 18)}
        </text>
      </g>
    </g>
  );
}

function Connector({ x, y, w, h, text }: { x: number; y: number; w: number; h: number; text: string }) {
  const r = Math.min(w, h) / 2;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle r={r} fill="#fff" stroke="#111827" strokeWidth={2} />
      {text && (
        <text textAnchor="middle" dominantBaseline="middle" fontSize={14} fill="#111827">{text}</text>
      )}
    </g>
  );
}

function Note({ x, y, w, h, text }: { x: number; y: number; w: number; h: number; text: string }) {
  return (
    <g transform={`translate(${x - w / 2}, ${y - h / 2})`}>
      <rect width={w} height={h} fill="#fffbeb" stroke="#f59e0b" strokeDasharray="6 4" />
      <g transform={`translate(${w / 2}, ${h / 2})`}>
        <text textAnchor="middle" dominantBaseline="middle" fontSize={13} fill="#92400e">
          {wrapText(text, w - 24, 16)}
        </text>
      </g>
    </g>
  );
}

function Arrow({ from, to, label, via }: { from: { x: number; y: number }; to: { x: number; y: number }; label?: string; via?: { x: number; y: number }[] }) {
  const pts = [from, ...(via || []), to];
  const path = pts
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(" ");
  const last = pts[pts.length - 1];
  const prev = pts[pts.length - 2] || from;
  const angle = Math.atan2(last.y - prev.y, last.x - prev.x);
  const ah = 10;
  const aw = 6;
  const ax = last.x - Math.cos(angle) * ah;
  const ay = last.y - Math.sin(angle) * ah;
  const leftX = ax + Math.cos(angle + Math.PI / 2) * aw;
  const leftY = ay + Math.sin(angle + Math.PI / 2) * aw;
  const rightX = ax + Math.cos(angle - Math.PI / 2) * aw;
  const rightY = ay + Math.sin(angle - Math.PI / 2) * aw;

  const mid = pts[Math.floor(pts.length / 2)];

  return (
    <g>
      <path d={path} stroke="#111827" strokeWidth={2} fill="none" />
      <polygon points={`${last.x},${last.y} ${leftX},${leftY} ${rightX},${rightY}`} fill="#111827" />
      {label && (
        <text x={mid.x} y={mid.y - 6} textAnchor="middle" fontSize={13} fill="#111827" fontWeight={600}>
          {label}
        </text>
      )}
    </g>
  );
}

export function SVGFlowchart({ flow, width = 1200, height = 800 }: { flow: Flow; width?: number; height?: number }) {
  const nodeMap = React.useMemo(() => {
    const m = new Map<string, FlowNode & { w: number; h: number }>();
    for (const n of flow.nodes) {
      const size = defaultSize[n.type];
      m.set(n.id, { ...n, w: n.w ?? size.w, h: n.h ?? size.h });
    }
    return m;
  }, [flow]);

  const getAnchor = (node: FlowNode & { w: number; h: number }, side: "top" | "bottom" | "left" | "right") => {
    switch (side) {
      case "top":
        return { x: node.x, y: node.y - node.h / 2 };
      case "bottom":
        return { x: node.x, y: node.y + node.h / 2 };
      case "left":
        return { x: node.x - node.w / 2, y: node.y };
      case "right":
        return { x: node.x + node.w / 2, y: node.y };
    }
  };

  const renderNode = (n: FlowNode & { w: number; h: number }) => {
    const props = { x: n.x, y: n.y, w: n.w, h: n.h, text: n.text };
    switch (n.type) {
      case "terminal":
        return <Terminal key={n.id} {...props} />;
      case "process":
        return <Process key={n.id} {...props} />;
      case "io":
        return <IO key={n.id} {...props} />;
      case "decision":
        return <Decision key={n.id} {...props} />;
      case "predefined":
        return <Predefined key={n.id} {...props} />;
      case "connector":
        return <Connector key={n.id} {...props} />;
      case "note":
        return <Note key={n.id} {...props} />;
    }
  };

  const edgeEls = flow.edges.map((e) => {
    const from = nodeMap.get(e.from);
    const to = nodeMap.get(e.to);
    if (!from || !to) return null;
    // naive auto-anchor: vertical if roughly aligned, else route horizontally then vertically
    const vertical = Math.abs(from.x - to.x) < 4 || from.y < to.y;
    const fromPt = getAnchor(from, vertical ? "bottom" : from.x < to.x ? "right" : "left");
    const toPt = getAnchor(to, vertical ? "top" : to.x < from.x ? "right" : "left");
    let via = e.via;
    if (!via && !vertical) {
      // add a dogleg
      const midX = (fromPt.x + toPt.x) / 2;
      via = [
        { x: midX, y: fromPt.y },
        { x: midX, y: toPt.y }
      ];
    }
    return <Arrow key={e.id} from={fromPt} to={toPt} label={e.label} via={via} />;
  });

  const nodeEls = Array.from(nodeMap.values()).map(renderNode);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="???? ????-?????">
      <defs>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.12" />
        </filter>
      </defs>
      <g filter="url(#softShadow)">
        {edgeEls}
        {nodeEls}
      </g>
    </svg>
  );
}
