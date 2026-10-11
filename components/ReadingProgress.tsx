"use client";

import { useEffect, useState } from "react";

/** 헤더 바로 아래에 붙는 얇은 읽기 진행 막대. 본문(article) 기준으로 계산합니다. */
export default function ReadingProgress({ targetId }: { targetId: string }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const done = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1;
      setPct(done * 100);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [targetId]);

  return (
    <div aria-hidden className="no-print pointer-events-none fixed inset-x-0 top-14 z-40 h-[2px]">
      <div
        className="h-full origin-left transition-[width] duration-150"
        style={{
          width: `${pct}%`,
          background: "linear-gradient(90deg, var(--grad-violet), var(--grad-magenta), var(--grad-orange))",
        }}
      />
    </div>
  );
}
