import { useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import type { GraphTapScreen } from '@contract/schema';
import { RichText } from '../../design/RichText';
import { compileFn, gridLines, isTapCorrect, niceStep, sampleSegments, type Pt } from './plot';
import type { QuestionProps } from './types';

const PAD = 10;

function fmt(n: number) {
  return Number(n.toFixed(2)).toString();
}

export function GraphTap({ screen, locked, revealed, onChange }: QuestionProps<GraphTapScreen>) {
  const { plot, target, tolerance } = screen;
  const boxRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [tap, setTap] = useState<Pt | null>(null);
  const clipId = useId();

  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    // Minus the frame's 2px borders, so the SVG fits inside it.
    const measure = () => setWidth(Math.max(0, Math.floor(el.clientWidth) - 4));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const [x0, x1] = plot.xRange;
  const [y0, y1] = plot.yRange;
  // Square-ish units when they fit; otherwise a 4:3 box, capped at 55% of the viewport height.
  const maxH = typeof window === 'undefined' ? 480 : window.innerHeight * 0.55;
  const height = Math.min(Math.round(width * 0.75), Math.round(maxH));
  const sx = (x: number) => PAD + ((x - x0) / (x1 - x0)) * (width - 2 * PAD);
  const sy = (y: number) => height - PAD - ((y - y0) / (y1 - y0)) * (height - 2 * PAD);
  const toGraph = (px: number, py: number): Pt => ({
    x: Math.max(x0, Math.min(x1, x0 + ((px - PAD) / (width - 2 * PAD)) * (x1 - x0))),
    y: Math.max(y0, Math.min(y1, y0 + ((height - PAD - py) / (height - 2 * PAD)) * (y1 - y0))),
  });

  // Compile once per screen; sample once per screen.
  const curves = useMemo(
    () =>
      plot.functions.map((fn) => {
        const f = compileFn(fn.expr);
        return f ? sampleSegments(f, plot.xRange, plot.yRange, fn.domain) : [];
      }),
    [plot],
  );

  const xStep = niceStep(x1 - x0);
  const yStep = niceStep(y1 - y0);
  const xs = gridLines(plot.xRange, xStep);
  const ys = gridLines(plot.yRange, yStep);
  const axisX = Math.max(x0, Math.min(x1, 0));
  const axisY = Math.max(y0, Math.min(y1, 0));

  const place = (p: Pt) => {
    if (locked) return;
    setTap(p);
    onChange({ hasAnswer: true, isCorrect: isTapCorrect(p, target, tolerance) });
  };

  // click (not pointerdown) so a finger can still scroll the page over the graph.
  const onClick = (e: MouseEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    place(toGraph(e.clientX - r.left, e.clientY - r.top));
  };

  const onKeyDown = (e: KeyboardEvent<SVGSVGElement>) => {
    const dx = { ArrowLeft: -1, ArrowRight: 1 }[e.key] ?? 0;
    const dy = { ArrowDown: -1, ArrowUp: 1 }[e.key] ?? 0;
    if (!dx && !dy) return;
    e.preventDefault();
    const start = tap ?? { x: (x0 + x1) / 2, y: (y0 + y1) / 2 };
    const step = (e.shiftKey ? 4 : 1) * Math.min(xStep, yStep) * 0.25;
    place({
      x: Math.max(x0, Math.min(x1, start.x + dx * step)),
      y: Math.max(y0, Math.min(y1, start.y + dy * step)),
    });
  };

  const correct = tap ? isTapCorrect(tap, target, tolerance) : false;
  const path = (seg: Pt[]) => seg.map((p, i) => `${i ? 'L' : 'M'}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join(' ');
  const describe = tap ? `Marker at x ${fmt(tap.x)}, y ${fmt(tap.y)}.` : 'No marker yet.';

  return (
    <div className="screen screen--question">
      <RichText className="screen__prompt" text={screen.prompt} />
      <div ref={boxRef} className="graph">
        {width > 0 && (
          <div className="graph__frame" style={{ height }}>
            <svg
              className={`graph__svg${locked ? ' is-locked' : ''}`}
              width={width}
              height={height}
              viewBox={`0 0 ${width} ${height}`}
              tabIndex={0}
              role="application"
              aria-label={`Graph. Tap or use the arrow keys to place a marker. ${describe}`}
              onClick={onClick}
              onKeyDown={onKeyDown}
            >
              <defs>
                <clipPath id={clipId}>
                  <rect x={PAD} y={PAD} width={width - 2 * PAD} height={height - 2 * PAD} />
                </clipPath>
              </defs>
              {xs.map((x) => (
                <line key={`gx${x}`} className="graph__grid" x1={sx(x)} x2={sx(x)} y1={PAD} y2={height - PAD} />
              ))}
              {ys.map((y) => (
                <line key={`gy${y}`} className="graph__grid" x1={PAD} x2={width - PAD} y1={sy(y)} y2={sy(y)} />
              ))}
              <line className="graph__axis" x1={PAD} x2={width - PAD} y1={sy(axisY)} y2={sy(axisY)} />
              <line className="graph__axis" x1={sx(axisX)} x2={sx(axisX)} y1={PAD} y2={height - PAD} />
              {xs.filter((x) => x !== axisX).map((x) => (
                <text key={`tx${x}`} className="graph__tick" x={sx(x)} y={Math.min(height - PAD - 2, sy(axisY) + 14)} textAnchor="middle">
                  {fmt(x)}
                </text>
              ))}
              {ys.filter((y) => y !== axisY).map((y) => (
                <text key={`ty${y}`} className="graph__tick" x={Math.max(PAD + 2, sx(axisX) - 5)} y={sy(y) + 4} textAnchor={sx(axisX) - 5 < PAD + 20 ? 'start' : 'end'}>
                  {fmt(y)}
                </text>
              ))}

              {revealed && target.y === undefined && (
                <rect
                  className="graph__target-band"
                  x={sx(target.x - tolerance)}
                  y={PAD}
                  width={Math.max(2, sx(target.x + tolerance) - sx(target.x - tolerance))}
                  height={height - 2 * PAD}
                />
              )}

              <g clipPath={`url(#${clipId})`}>
                {curves.map((segs, i) =>
                  segs.map((seg, j) => <path key={`${i}-${j}`} className={`graph__curve graph__curve--${i + 1}`} d={path(seg)} />),
                )}
              </g>

              {plot.points?.map((p, i) => (
                <circle key={`p${i}`} className={`graph__point graph__point--${p.style ?? 'filled'}`} cx={sx(p.x)} cy={sy(p.y)} r={6} />
              ))}

              {revealed && target.y !== undefined && (
                <circle className="graph__target" cx={sx(target.x)} cy={sy(target.y)} r={Math.max(10, sx(x0 + tolerance) - sx(x0))} />
              )}

              {tap && (
                <g className={`graph__marker${revealed ? (correct ? ' is-right' : ' is-wrong') : ''}`} transform={`translate(${sx(tap.x)},${sy(tap.y)})`}>
                  <circle r={13} className="graph__marker-halo" />
                  <circle r={6} className="graph__marker-dot" />
                </g>
              )}
            </svg>
            {/* Point labels are HTML so they can hold KaTeX. */}
            {plot.points?.map((p, i) =>
              p.label ? (
                <span key={`l${i}`} className="graph__label" style={{ left: sx(p.x) + 9, top: sy(p.y) - 26 }}>
                  <RichText inline text={p.label} />
                </span>
              ) : null,
            )}
          </div>
        )}
      </div>
      {plot.functions.some((f) => f.label) && (
        <ul className="graph__legend">
          {plot.functions.map((f, i) =>
            f.label ? (
              <li key={i}>
                <span className={`graph__swatch graph__swatch--${i + 1}`} aria-hidden />
                <RichText inline text={f.label} />
              </li>
            ) : null,
          )}
        </ul>
      )}
      <p className="screen__hint" aria-live="polite">
        {tap ? `Your tap: (${fmt(tap.x)}, ${fmt(tap.y)}). Tap again to move it.` : 'Tap the graph to place your answer. Arrow keys work too.'}
      </p>
    </div>
  );
}
