"use client";

import Link from "next/link";
import { useState } from "react";

import { docs } from "@/lib/content";
import { questions } from "@/lib/quiz";

/** topic을 주면 그 주제 챕터에 딸린 문항만 보여줍니다. */
export default function Quiz({ topic }: { topic?: string }) {
  const list = topic
    ? questions.filter(
        (q) => docs.find((d) => d.slug === q.chapter)?.topic === topic
      )
    : questions;

  const [picked, setPicked] = useState<(number | null)[]>(
    list.map(() => null)
  );

  const answered = picked.filter((p) => p !== null).length;
  const correct = picked.filter((p, i) => p === list[i].answer).length;

  function pick(qi: number, oi: number) {
    if (picked[qi] !== null) return;
    setPicked((prev) => prev.map((v, i) => (i === qi ? oi : v)));
  }

  return (
    <div className="max-w-[46rem]">
      {/* 점수판 */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-5 rounded-xl border border-hairline bg-surface-1 p-6">
        <div>
          <div className="tnum text-[2.5rem] font-medium leading-none tracking-[-0.05em] text-ink">
            {correct}
            <span className="text-ink-dim">/{list.length}</span>
          </div>
          <p className="mt-2.5 text-caption text-ink-dim">
            정답 · {answered}문항 응답
          </p>
        </div>
        <div className="min-w-[10rem] flex-1">
          <div className="h-px w-full bg-hairline">
            <div
              className="h-px bg-ink transition-[width] duration-500"
              style={{ width: `${(answered / list.length) * 100}%` }}
            />
          </div>
        </div>
        {answered > 0 && (
          <button
            type="button"
            onClick={() => setPicked(list.map(() => null))}
            className="rounded-pill bg-surface-2 px-4 py-2 text-button font-medium text-ink-muted transition-colors hover:text-ink"
          >
            다시 풀기
          </button>
        )}
      </div>

      {/* 문항 */}
      <ol className="mt-4 space-y-4">
        {list.map((q, qi) => {
          const p = picked[qi];
          const doc = docs.find((d) => d.slug === q.chapter);
          const right = p === q.answer;

          return (
            <li
              key={q.q}
              className="rounded-xl border border-hairline bg-surface-1 p-6"
            >
              <p className="flex gap-3 text-body-lg leading-[1.6] text-ink">
                <span className="tnum shrink-0 text-caption leading-[2.1] text-ink-dim">
                  {String(qi + 1).padStart(2, "0")}
                </span>
                <span>{q.q}</span>
              </p>

              <ul className="mt-5 space-y-2">
                {q.opts.map((o, oi) => {
                  const isAnswer = oi === q.answer;
                  const isPicked = oi === p;
                  const revealed = p !== null;

                  let style = "bg-surface-2 text-ink-muted hover:text-ink";
                  if (revealed && isAnswer) style = "bg-surface-2 text-tip";
                  else if (revealed && isPicked) style = "bg-surface-2 text-bad";
                  else if (revealed) style = "bg-surface-2 text-ink-dim";

                  return (
                    <li key={o}>
                      <button
                        type="button"
                        onClick={() => pick(qi, oi)}
                        disabled={revealed}
                        className={`w-full rounded-md px-4 py-3 text-left text-body-sm transition-colors ${style} ${
                          revealed ? "cursor-default" : ""
                        }`}
                      >
                        {o}
                      </button>
                    </li>
                  );
                })}
              </ul>

              {p !== null && (
                <div className="mt-5 border-t border-hairline pt-4 text-body-sm text-ink-muted">
                  <span
                    className="font-medium"
                    style={{ color: right ? "var(--tip)" : "var(--bad)" }}
                  >
                    {right
                      ? "정답입니다."
                      : `오답 — 정답은 ${q.answer + 1}번입니다.`}
                  </span>{" "}
                  {q.exp}
                  {doc && (
                    <>
                      {" "}
                      <Link
                        href={`/${doc.topic}/${doc.slug}`}
                        className="text-accent underline underline-offset-[3px]"
                      >
                        → {doc.num}장 「{doc.title}」에서 복습
                      </Link>
                    </>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
