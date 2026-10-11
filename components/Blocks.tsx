import type { Block, Tone } from "@/lib/blocks";
import { highlight } from "@/lib/highlight";
import { isReferencesHeading, isSummaryHeading, sectionMap, type SectionInfo } from "@/lib/sections";

import CodeBlock from "./CodeBlock";
import Demo from "./Demo";
import { FIGURES } from "./figures";
import Inline from "./Inline";
import Tabs from "./Tabs";
import ToneIcon from "./ToneIcon";

/**
 * Block[] 렌더러. 서버 컴포넌트라서 Shiki 하이라이팅이 빌드 타임에 끝납니다.
 * 상호작용이 필요한 조각(CodeBlock 복사 버튼, Tabs, Demo)만 클라이언트입니다.
 *
 * 최상위에서만 하는 일 (lib/sections.ts 규칙):
 *   - h3마다 번호와 앵커 id(s-1, s-2 …)를 붙입니다. 사이드바 섹션 목차가 같은 id를 씁니다.
 *   - 「정리」 h3 + 목록 → 핵심 정리 카드, 「참고자료」 h3 + 목록 → 접히는 출처 목록.
 */
export default async function Blocks({ blocks }: { blocks: Block[] }) {
  const sections = sectionMap(blocks);
  const out: React.ReactNode[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    const next = blocks[i + 1];
    const list = next && (next.t === "ul" || next.t === "ol") ? next.items : null;

    if (isSummaryHeading(b) && list) {
      out.push(<SummaryCard key={i} items={list} />);
      i += 1;
      continue;
    }
    if (isReferencesHeading(b) && list) {
      out.push(<References key={i} items={list} />);
      i += 1;
      continue;
    }
    out.push(await renderBlock(b, i, sections.get(i)));
  }
  return <>{out}</>;
}

/** 본문 문단·목록의 글자. 한글 장문 기준으로 크기와 대비를 키웠습니다. */
const BODY = "text-[1rem] sm:text-[1.0625rem] leading-[1.85] tracking-[-0.012em] text-ink-body";

const TONE: Record<Tone, { label: string; chip: string; v: string }> = {
  tip: { label: "잘 되는 것", chip: "이렇게", v: "var(--tip)" },
  warn: { label: "주의", chip: "주의", v: "var(--warn)" },
  bad: { label: "안 되는 것", chip: "함정", v: "var(--bad)" },
  fe: { label: "이미 아는 것에 붙이면", chip: "비유", v: "var(--fe)" },
  note: { label: "메모", chip: "참고", v: "var(--ink-muted)" },
};

const mix = (color: string, pct: number, base = "transparent") =>
  `color-mix(in srgb, ${color} ${pct}%, ${base})`;

/** 장 하나에 두 번까지만 쓰는 그라디언트 테두리 (DESIGN.md 스포트라이트 규칙) */
export const GRADIENT_FRAME: React.CSSProperties = {
  border: "1px solid transparent",
  background:
    "linear-gradient(var(--surface-1), var(--surface-1)) padding-box, linear-gradient(135deg, var(--grad-violet), var(--grad-magenta) 50%, var(--grad-orange)) border-box",
};

async function renderBlock(b: Block, key: number, section?: SectionInfo): Promise<React.ReactNode> {
  switch (b.t) {
    /* ---------------- 텍스트 ---------------- */
    case "p":
      return (
        <p key={key} className={`mt-5 ${BODY}`}>
          <Inline md={b.md} />
        </p>
      );

    case "h2":
      return (
        <h2
          key={key}
          className="mt-16 border-t border-hairline pt-8 text-[1.75rem] font-medium leading-[1.15] tracking-[-0.045em] text-ink"
        >
          <Inline md={b.md} />
        </h2>
      );

    case "h3":
      return section ? (
        <div key={key} id={section.id} className="mt-20 scroll-mt-28 border-t border-hairline-soft pt-10">
          <p className="tnum text-caption font-medium tracking-[0.02em] text-ink-dim">
            {String(section.n).padStart(2, "0")}
          </p>
          <h3 className="mt-2 text-[1.5rem] font-medium leading-[1.25] tracking-[-0.035em] text-ink sm:text-[1.75rem]">
            <Inline md={b.md} />
          </h3>
        </div>
      ) : (
        <h3 key={key} className="mt-11 text-[1.25rem] font-medium leading-[1.25] tracking-[-0.03em] text-ink">
          <Inline md={b.md} />
        </h3>
      );

    case "h4":
      return (
        <h4
          key={key}
          className="mt-10 flex items-center gap-2.5 text-[1.0625rem] font-semibold tracking-[-0.02em] text-ink"
        >
          <span aria-hidden className="h-[1.05em] w-[3px] shrink-0 rounded-full bg-ink-dim" />
          <span>
            <Inline md={b.md} />
          </span>
        </h4>
      );

    case "legend":
      return (
        <p key={key} className="mt-3 flex gap-2 text-caption leading-[1.6] text-ink-dim">
          <span className="mt-[0.2em]">
            <ToneIcon name="source" size={13} />
          </span>
          <span>
            <Inline md={b.md} />
          </span>
        </p>
      );

    case "hr":
      return <hr key={key} className="my-12 border-t border-hairline-soft" />;

    /* ---------------- 목록 ---------------- */
    case "ul":
      return (
        <ul key={key} className="mt-5 space-y-2.5">
          {b.items.map((it) => (
            <li key={it} className={`relative pl-5 ${BODY}`}>
              <span className="absolute left-0.5 top-[0.78em] h-[5px] w-[5px] rounded-full bg-ink-dim" />
              <Inline md={it} />
            </li>
          ))}
        </ul>
      );

    case "ol":
      return (
        <ol key={key} className="mt-5 space-y-2.5">
          {b.items.map((it, i) => (
            <li key={it} className={`relative pl-9 ${BODY}`}>
              <span className="tnum absolute left-0 top-[0.28em] flex h-6 w-6 items-center justify-center rounded-full bg-surface-2 text-micro font-medium text-ink-muted">
                {i + 1}
              </span>
              <Inline md={it} />
            </li>
          ))}
        </ol>
      );

    /* ---------------- 표 ---------------- */
    case "table":
      return (
        <div key={key} className="mt-7 overflow-x-auto rounded-[15px] border border-hairline">
          <table
            className="w-full border-collapse text-left [&_tbody_tr:last-child_td]:border-b-0"
            style={{ minWidth: b.head.length >= 3 ? `${Math.min(b.head.length, 5) * 8.5}rem` : undefined }}
          >
            {b.head.length > 0 && (
              <thead>
                <tr>
                  {b.head.map((h, i) => (
                    <th
                      key={i}
                      className="whitespace-nowrap border-b border-hairline bg-surface-1 px-4 py-3 text-caption font-semibold tracking-[-0.01em] text-ink"
                    >
                      <Inline md={h} />
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {b.rows.map((row, ri) => (
                <tr key={ri} className="transition-colors hover:bg-surface-1/60">
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className={`border-b border-hairline-soft px-4 py-3.5 align-top text-body-sm leading-[1.7] ${
                        ci === 0 ? "text-ink" : "text-ink-body"
                      }`}
                    >
                      <Inline md={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    /* ---------------- 코드 ---------------- */
    case "code": {
      const html = await highlight(b.src, b.lang);
      return (
        <CodeBlock key={key} code={b.src} caption={b.caption}>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </CodeBlock>
      );
    }

    /* ---------------- 강조 박스 ---------------- */
    case "callout": {
      const toneKey = b.tone ?? "note";
      const tone = TONE[toneKey];
      const body = await Promise.all((b.body ?? []).map((c, i) => renderBlock(c, i)));
      return (
        <aside
          key={key}
          className="mt-8 rounded-[15px] border p-5 sm:p-6"
          style={{ borderColor: mix(tone.v, 34, "var(--hairline)"), background: mix(tone.v, 6, "var(--surface-1)") }}
        >
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-body-sm font-semibold tracking-[-0.015em]">
            <span className="inline-flex items-center gap-1.5 rounded-pill px-2 py-0.5 text-micro" style={{ color: tone.v, background: mix(tone.v, 14) }}>
              <ToneIcon name={toneKey} size={13} />
              {tone.chip}
            </span>
            <span className="text-ink">{b.title ?? tone.label}</span>
          </p>
          <div className="[&>*:first-child]:mt-3">{body}</div>
        </aside>
      );
    }

    /* ---------------- 그리드 ---------------- */
    case "grid": {
      const min = { 2: "17rem", 3: "13rem", 4: "10rem" }[b.cols ?? 2];
      const items = await Promise.all(b.items.map((c, i) => renderBlock(c, i)));
      return (
        <div
          key={key}
          className="mt-8 grid gap-4"
          style={{ gridTemplateColumns: `repeat(auto-fit, minmax(min(${min}, 100%), 1fr))` }}
        >
          {items}
        </div>
      );
    }

    case "card": {
      const toneKey = b.tone;
      const tone = toneKey ? TONE[toneKey] : null;
      const body = await Promise.all((b.body ?? []).map((c, i) => renderBlock(c, i)));
      return (
        <div
          key={key}
          className="rounded-[15px] border border-hairline bg-surface-1 p-5"
          style={tone ? { borderTop: `3px solid ${tone.v}` } : undefined}
        >
          {b.title && (
            <p
              className="flex items-center gap-2 text-[0.9375rem] font-semibold tracking-[-0.015em]"
              style={{ color: tone?.v ?? "var(--ink)" }}
            >
              {toneKey && <ToneIcon name={toneKey} size={15} />}
              {b.title}
            </p>
          )}
          <div className="[&>*:first-child]:mt-2.5 [&_li]:text-[0.9375rem] [&_li]:leading-[1.75] [&_p]:text-[0.9375rem] [&_p]:leading-[1.75]">
            {body}
          </div>
        </div>
      );
    }

    case "stat": {
      const long = b.n.length > 10;
      return (
        <div key={key} className="rounded-[15px] border border-hairline bg-surface-1 p-5">
          <div
            className={
              long
                ? "text-[1rem] font-medium leading-[1.3] tracking-[-0.02em] text-ink"
                : "tnum text-[2.25rem] font-medium leading-[1] tracking-[-0.045em] text-ink"
            }
          >
            {b.n}
          </div>
          <p className="mt-3 text-caption leading-[1.5] text-ink-dim">{b.l}</p>
        </div>
      );
    }

    /* ---------------- 흐름도 ----------------
       데스크톱은 가로로 이어지는 번호 카드, 모바일은 세로 단계. */
    case "flow":
      return (
        <ol key={key} className="mt-8 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-stretch">
          {b.items.map((raw, i) => {
            const [main, sub] = raw.split("|");
            return (
              <li key={raw} className="flex flex-col items-stretch gap-2 sm:flex-row">
                {i > 0 && (
                  <span aria-hidden className="select-none self-center text-ink-dim">
                    <span className="sm:hidden">↓</span>
                    <span className="hidden sm:inline">→</span>
                  </span>
                )}
                <div className="flex items-start gap-3 rounded-[14px] border border-hairline bg-surface-1 px-4 py-3">
                  <span className="tnum mt-[1px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-2 text-micro text-ink-muted">
                    {i + 1}
                  </span>
                  <span className="text-body-sm leading-snug">
                    <span className="block font-medium text-ink">{main}</span>
                    {sub && <span className="mt-0.5 block text-caption text-ink-dim">{sub}</span>}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      );

    /* ---------------- 탭 ---------------- */
    case "tabs": {
      const panes = await Promise.all(
        b.tabs.map(async (t, i) => {
          const body = await Promise.all(t.body.map((c, j) => renderBlock(c, j)));
          return <div key={i}>{body}</div>;
        })
      );
      return (
        <Tabs key={key} labels={b.tabs.map((t) => t.label)}>
          {panes}
        </Tabs>
      );
    }

    /* ---------------- 그 외 ---------------- */
    case "demo":
      return <Demo key={key} name={b.name} />;

    case "diagram": {
      const Fig = FIGURES[b.name];
      return (
        <figure key={key} className="mt-9 overflow-hidden rounded-[20px] border border-hairline bg-surface-1">
          {/* 폰에서 도식을 화면 폭으로 줄이면 글자가 읽히지 않아, 최소 폭을 두고 옆으로 밀어 보게 합니다 */}
          <div className="overflow-x-auto p-5 sm:p-6 [&_svg]:h-auto [&_svg]:w-full [&_svg]:min-w-[540px]">
            {Fig ? (
              <Fig />
            ) : (
              <p className="text-body-sm text-bad">
                등록되지 않은 도식: <code>{b.name}</code> — components/figures/index.tsx 의 FIGURES를 확인하세요.
              </p>
            )}
          </div>
          {b.caption && (
            <figcaption className="flex gap-2.5 border-t border-hairline px-6 py-3.5 text-caption leading-[1.6] text-ink-muted">
              <span className="shrink-0 font-medium text-ink-dim">그림</span>
              <span>
                {b.caption}
                <span className="ml-1.5 text-ink-dim sm:hidden">(옆으로 밀어서 보기)</span>
              </span>
            </figcaption>
          )}
        </figure>
      );
    }

    default:
      return null;
  }
}

/* ---------------- 특수 섹션 ---------------- */

function SummaryCard({ items }: { items: string[] }) {
  return (
    <section id="summary" className="mt-20 scroll-mt-28 rounded-[20px] p-6 sm:p-8" style={GRADIENT_FRAME}>
      <p className="flex items-center gap-2 text-body-sm font-semibold text-ink">
        <span style={{ color: "var(--tip)" }}>
          <ToneIcon name="tip" size={17} />
        </span>
        핵심 정리
        <span className="font-normal text-ink-dim">· 시험 직전에 이것만</span>
      </p>
      <ul className="mt-5 space-y-3.5">
        {items.map((it) => (
          <li key={it} className="flex gap-3 text-[1rem] leading-[1.8] tracking-[-0.012em] text-ink-body">
            <span className="mt-[0.4em]" style={{ color: "var(--tip)" }}>
              <ToneIcon name="check" size={15} />
            </span>
            <span>
              <Inline md={it} />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function References({ items }: { items: string[] }) {
  return (
    <details id="references" className="group mt-10 rounded-[15px] border border-hairline bg-surface-1 px-5 py-4">
      <summary className="flex cursor-pointer list-none items-center gap-2 text-body-sm font-medium text-ink-muted [&::-webkit-details-marker]:hidden">
        <ToneIcon name="source" size={15} />
        참고자료
        <span className="tnum text-ink-dim">· {items.length}개</span>
        <span aria-hidden className="ml-auto text-ink-dim transition-transform group-open:rotate-90">
          ›
        </span>
      </summary>
      <ul className="mt-4 space-y-2 border-t border-hairline-soft pt-4">
        {items.map((it) => (
          <li key={it} className="relative pl-4 text-body-sm leading-[1.65] text-ink-muted">
            <span className="absolute left-0 top-[0.7em] h-1 w-1 rounded-full bg-ink-dim" />
            <Inline md={it} />
          </li>
        ))}
      </ul>
    </details>
  );
}
