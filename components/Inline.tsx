import Link from "next/link";
import { Fragment } from "react";

import { parseInline } from "@/lib/blocks";

/**
 * 문단 안의 **굵게** *기울임* `코드` [링크](url) ~~취소선~~ 를 렌더합니다.
 * 이 한 겹 덕분에 콘텐츠 데이터를 JSX 없이 평범한 문자열로 쓸 수 있습니다.
 */
export default function Inline({ md }: { md: string }) {
  return (
    <>
      {parseInline(md).map((t, i) => {
        switch (t.k) {
          case "strong":
            return (
              <strong
                key={i}
                className="font-semibold text-ink [background-image:linear-gradient(transparent_64%,var(--hl)_64%)] [box-decoration-break:clone]"
              >
                {t.v}
              </strong>
            );
          case "em":
            return (
              <em key={i} className="italic">
                {t.v}
              </em>
            );
          case "del":
            return (
              <s key={i} className="opacity-55">
                {t.v}
              </s>
            );
          case "code":
            return (
              <code
                key={i}
                className="rounded-[4px] border border-hairline bg-surface-1 px-[0.34em] py-[0.1em] font-mono text-[0.85em] text-ink"
              >
                {t.v}
              </code>
            );
          case "link": {
            const external = t.href.startsWith("http");
            const cls =
              "text-accent underline decoration-accent/40 underline-offset-[3px] transition-colors hover:decoration-accent";
            return external ? (
              <a
                key={i}
                href={t.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cls}
              >
                {t.v}
              </a>
            ) : (
              <Link key={i} href={t.href} className={cls}>
                {t.v}
              </Link>
            );
          }
          default:
            return <Fragment key={i}>{t.v}</Fragment>;
        }
      })}
    </>
  );
}
