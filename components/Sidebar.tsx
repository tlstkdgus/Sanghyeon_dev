"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { docsOf, groupedDocs, type Topic } from "@/lib/content";
import { PROGRESS_EVENT, docKey, readProgress } from "@/lib/progress";
import type { SectionInfo } from "@/lib/sections";

/** 지금 화면 위쪽에 걸쳐 있는 섹션 id (스크롤 추적). */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(",");

  useEffect(() => {
    if (ids.length === 0) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 140) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
    // ids는 key로 비교합니다 (배열 참조가 매 렌더 바뀌어도 다시 구독하지 않도록)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return active;
}

export default function Sidebar({
  topic,
  outlines = {},
}: {
  topic: Topic;
  outlines?: Record<string, SectionInfo[]>;
}) {
  const pathname = usePathname();
  const [done, setDone] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const activeSlug = pathname.split("/")[2] ?? "";
  const activeSections = outlines[activeSlug] ?? [];
  const activeId = useActiveSection(activeSections.map((s) => s.id));

  useEffect(() => {
    const sync = () => setDone(readProgress());
    sync();
    window.addEventListener(PROGRESS_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(PROGRESS_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // 라우트가 바뀌면 모바일 목차는 닫습니다.
  useEffect(() => setOpen(false), [pathname]);

  const all = docsOf(topic.slug);
  const readCount = all.filter((d) => done.includes(docKey(d.topic, d.slug))).length;
  const pct = all.length ? Math.round((readCount / all.length) * 100) : 0;

  const nav = (
    <nav>
      <div className="mb-7">
        <div className="flex items-baseline justify-between text-micro font-medium">
          <span className="text-ink-muted">{topic.name}</span>
          <span className="tnum text-ink-dim">
            {readCount}/{all.length}
          </span>
        </div>
        <div className="mt-2.5 h-px w-full bg-hairline">
          <div
            className="h-px bg-ink transition-[width] duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {groupedDocs(topic).map(({ part, items }) => (
        <div key={part.key} className="mb-6">
          <p className="mb-2 px-3 text-micro font-medium text-ink-dim">
            {part.name}
          </p>
          <ul className="space-y-0.5">
            {items.map((d) => {
              const href = `/${d.topic}/${d.slug}`;
              const active = pathname === href;
              const read = done.includes(docKey(d.topic, d.slug));
              return (
                <li key={d.slug}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-baseline gap-2.5 rounded-md px-3 py-2 text-body-sm leading-snug transition-colors ${
                      active
                        ? "bg-surface-2 text-ink"
                        : "text-ink-dim hover:text-ink"
                    }`}
                  >
                    <span className="tnum w-4 shrink-0 text-micro">
                      {String(d.num).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">{d.title}</span>
                    {read && (
                      <span
                        aria-label="읽음"
                        className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent"
                      />
                    )}
                  </Link>
                  {active && activeSections.length > 1 && (
                    <ul className="mb-2 ml-[1.15rem] mt-1 space-y-0.5 border-l border-hairline pl-3">
                      {activeSections.map((s) => {
                        const on = activeId === s.id;
                        return (
                          <li key={s.id}>
                            <a
                              href={`#${s.id}`}
                              onClick={() => setOpen(false)}
                              className={`-ml-[13px] block border-l py-1 pl-3 text-micro leading-snug transition-colors ${
                                on
                                  ? "border-ink text-ink"
                                  : "border-transparent text-ink-dim hover:text-ink-muted"
                              }`}
                            >
                              {s.title}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      {/* 데스크톱: 고정 사이드바 */}
      <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 overflow-y-auto py-10 pr-8 lg:block">
        {nav}
      </aside>

      {/* 모바일: 헤더 아래 접이식 목차 */}
      <div className="sticky top-14 z-30 -mx-5 border-b border-hairline-soft bg-canvas/90 px-5 backdrop-blur-xl sm:-mx-8 sm:px-8 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center gap-2 py-3.5 text-body-sm font-medium text-ink-muted"
        >
          <span className="text-ink-dim">{open ? "▾" : "▸"}</span>
          {topic.name} 목차
          <span className="tnum ml-auto text-caption text-ink-dim">
            {readCount}/{all.length}
          </span>
        </button>
        {open && <div className="pb-7">{nav}</div>}
      </div>
    </>
  );
}
