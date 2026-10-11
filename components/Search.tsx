"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { docs, topicBySlug, topics } from "@/lib/content";

type Item = { href: string; kind: string; title: string; desc: string; hay: string };

/* 제목·설명·태그만 훑습니다. 본문 전문 검색은 아직입니다. */
const items: Item[] = [
  ...docs.map((d) => {
    const t = topicBySlug(d.topic);
    return {
      href: `/${d.topic}/${d.slug}`,
      kind: t?.name ?? d.topic,
      title: `${d.num}. ${d.title}`,
      desc: d.desc,
      hay: `${d.num} ${d.title} ${d.desc} ${d.tags.join(" ")} ${d.slug} ${t?.name ?? ""}`.toLowerCase(),
    };
  }),
  ...topics.map((t) => ({
    href: `/${t.slug}`,
    kind: "주제",
    title: t.name,
    desc: t.tagline,
    hay: `${t.name} ${t.tagline} ${t.intro} ${t.slug}`.toLowerCase(),
  })),
  {
    href: "/glossary",
    kind: "부록",
    title: "용어집",
    desc: "Web3 · AI 핵심 용어 정리",
    hay: "용어집 glossary 사전 용어 gas nonce mev tvl slippage oracle 토큰 어텐션 rag 환각 임베딩 kv 캐시 hbm 프롬프트 인젝션",
  },
  {
    href: "/quiz",
    kind: "부록",
    title: "셀프 체크 퀴즈",
    desc: "이해도 확인 문항",
    hay: "퀴즈 quiz 문제 테스트 체크",
  },
];

export default function Search() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQ("");
    setSel(0);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const needle = q.trim().toLowerCase();
  const res = needle
    ? items.filter((i) => i.hay.includes(needle)).slice(0, 8)
    : items.slice(0, 6);

  function go(href: string) {
    router.push(href);
    close();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => Math.min(s + 1, res.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter" && res[sel]) {
      e.preventDefault();
      go(res[sel].href);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 items-center gap-2 rounded-pill bg-surface-1 px-3.5 text-button font-medium text-ink-muted transition-colors hover:text-ink"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <span className="hidden sm:inline">검색</span>
        <kbd className="hidden font-mono text-micro text-ink-dim sm:inline">⌘K</kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm"
          onClick={close}
          role="presentation"
        >
          <div
            className="h-fit w-full max-w-[36rem] overflow-hidden rounded-xl border border-hairline bg-surface-1 shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setSel(0);
              }}
              onKeyDown={onKeyDown}
              placeholder="챕터, 주제, 용어 검색…"
              aria-label="검색어"
              className="w-full border-b border-hairline bg-transparent px-5 py-4 text-body-lg text-ink outline-none placeholder:text-ink-dim focus-visible:shadow-none"
            />
            <div className="max-h-[52vh] overflow-y-auto p-2">
              {res.length === 0 && (
                <p className="px-4 py-10 text-center text-body-sm text-ink-dim">
                  검색 결과가 없습니다.
                </p>
              )}
              {res.map((r, i) => (
                <button
                  key={r.href}
                  type="button"
                  onMouseEnter={() => setSel(i)}
                  onClick={() => go(r.href)}
                  className={`block w-full rounded-md px-3.5 py-2.5 text-left transition-colors ${
                    i === sel ? "bg-surface-2" : ""
                  }`}
                >
                  <div className="flex items-baseline gap-2.5">
                    <span className="shrink-0 text-micro font-medium text-ink-dim">
                      {r.kind}
                    </span>
                    <span className="text-body font-medium text-ink">
                      {r.title}
                    </span>
                  </div>
                  <div className="mt-0.5 line-clamp-1 text-caption text-ink-dim">
                    {r.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
