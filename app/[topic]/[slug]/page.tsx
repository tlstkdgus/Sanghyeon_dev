import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Blocks, { GRADIENT_FRAME } from "@/components/Blocks";
import Inline from "@/components/Inline";
import ReadingProgress from "@/components/ReadingProgress";
import ReadMark from "@/components/ReadMark";
import ToneIcon from "@/components/ToneIcon";
import type { Block } from "@/lib/blocks";
import { docs, findDoc, neighbors, topicBySlug } from "@/lib/content";
import { outline, summaryOf } from "@/lib/sections";

export const dynamicParams = false;

export function generateStaticParams() {
  return docs.map((d) => ({ topic: d.topic, slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string; slug: string }>;
}): Promise<Metadata> {
  const { topic, slug } = await params;
  const doc = findDoc(topic, slug);
  if (!doc) return {};
  return {
    title: doc.title,
    description: doc.desc,
    openGraph: { title: doc.title, description: doc.desc, type: "article" },
  };
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ topic: string; slug: string }>;
}) {
  const { topic: topicSlug, slug } = await params;
  const doc = findDoc(topicSlug, slug);
  const topic = topicBySlug(topicSlug);
  if (!doc || !topic) notFound();

  // content/{topic}/{slug}.ts 가 Block[] 을 default export 합니다.
  const mod = (await import(`@/content/${topicSlug}/${slug}`)) as {
    default: Block[];
  };
  const part = topic.parts.find((p) => p.key === doc.partKey);
  const { prev, next } = neighbors(topicSlug, slug);
  const sections = outline(mod.default);
  const summary = summaryOf(mod.default);

  return (
    <article id="article" className="pb-20 lg:pl-12">
      <ReadingProgress targetId="article" />
      <header className="py-14 sm:py-20">
        <nav className="flex flex-wrap items-center gap-x-2 text-caption font-medium text-ink-dim">
          <Link href={`/${topic.slug}`} className="transition-colors hover:text-ink">
            {topic.name}
          </Link>
          {part && (
            <>
              <span aria-hidden>/</span>
              <span>{part.name}</span>
            </>
          )}
          <span aria-hidden>/</span>
          <span className="tnum">{String(doc.num).padStart(2, "0")}</span>
        </nav>

        <h1 className="mt-6 max-w-[20ch] text-[2.25rem] font-medium leading-[1.05] tracking-[-0.045em] text-ink sm:text-display-lg">
          {doc.title}
        </h1>

        <p className="mt-6 max-w-[44ch] text-body-lg text-ink-muted">{doc.desc}</p>

        <p className="mt-7 flex flex-wrap items-center gap-2 text-caption text-ink-dim">
          <span className="tnum">약 {doc.minutes}분</span>
          {doc.tags.map((t) => (
            <span key={t} className="rounded-sm bg-surface-1 px-1.5 py-0.5">
              {t}
            </span>
          ))}
        </p>
      </header>

      {/* 이 장의 지도 — 섹션 순서와 핵심 정리 미리보기 */}
      {sections.length > 1 && (
        <section aria-label="이 장의 지도" className="mb-4 max-w-[44rem] rounded-[20px] p-5 sm:p-7" style={GRADIENT_FRAME}>
          <p className="flex items-center gap-2 text-body-sm font-semibold text-ink">
            <ToneIcon name="map" size={16} />
            이 장의 지도
            <span className="tnum font-normal text-ink-dim">· {sections.length}개 섹션</span>
          </p>
          <ol className="mt-4 grid gap-x-6 gap-y-1 sm:grid-cols-2">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="group flex items-baseline gap-2.5 rounded-md py-1.5 text-body-sm leading-snug text-ink-muted transition-colors hover:text-ink"
                >
                  <span className="tnum shrink-0 text-micro text-ink-dim group-hover:text-ink-muted">
                    {String(s.n).padStart(2, "0")}
                  </span>
                  <span>{s.title}</span>
                </a>
              </li>
            ))}
          </ol>
          {summary.length > 0 && (
            <details className="group mt-4 border-t border-hairline pt-4">
              <summary className="flex cursor-pointer list-none items-center gap-2 text-body-sm font-medium text-ink [&::-webkit-details-marker]:hidden">
                <span style={{ color: "var(--tip)" }}>
                  <ToneIcon name="tip" size={15} />
                </span>
                핵심 정리 먼저 보기
                <span aria-hidden className="ml-auto text-ink-dim transition-transform group-open:rotate-90">
                  ›
                </span>
              </summary>
              <ul className="mt-3 space-y-2.5">
                {summary.map((it) => (
                  <li key={it} className="flex gap-2.5 text-body-sm leading-[1.7] text-ink-body">
                    <span className="mt-[0.35em]" style={{ color: "var(--tip)" }}>
                      <ToneIcon name="check" size={13} />
                    </span>
                    <span>
                      <Inline md={it} />
                    </span>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </section>
      )}

      {/* 본문 */}
      <div className="max-w-[44rem] pt-2">
        <Blocks blocks={mod.default} />
      </div>

      <div className="mt-16">
        <ReadMark topic={doc.topic} slug={doc.slug} />
      </div>

      <nav className="mt-10 grid gap-3 border-t border-hairline-soft pt-8 sm:grid-cols-2">
        {prev ? <NavCard doc={prev} kind="이전" /> : <span />}
        {next && <NavCard doc={next} kind="다음" align="right" />}
      </nav>
    </article>
  );
}

function NavCard({
  doc,
  kind,
  align,
}: {
  doc: (typeof docs)[number];
  kind: string;
  align?: "right";
}) {
  return (
    <Link
      href={`/${doc.topic}/${doc.slug}`}
      className={`group rounded-lg border border-hairline bg-surface-1 p-5 transition-colors hover:bg-surface-2 ${
        align === "right" ? "text-right sm:col-start-2" : ""
      }`}
    >
      <span className="text-caption font-medium text-ink-dim">{kind}</span>
      <span className="mt-1.5 block text-body font-medium tracking-[-0.02em] text-ink">
        {doc.title}
      </span>
    </Link>
  );
}
